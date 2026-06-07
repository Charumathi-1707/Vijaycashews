const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Order = require('../models/Order');

// ─── Create Razorpay Order ──────────────────────────────────────────────────
// Called BEFORE checkout — frontend gets razorpay_order_id to open the payment modal
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise (₹1 = 100 paise)
      currency,
      receipt: `receipt_${orderId || Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        userEmail: req.user.email,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    next(error);
  }
};

// ─── Verify Payment & Update Order ─────────────────────────────────────────
// Called AFTER successful payment on frontend
exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId, // our internal DB order _id
    } = req.body;

    // Step 1: Verify signature (HMAC SHA256)
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed — invalid signature' });
    }

    // Step 2: Fetch payment details from Razorpay to double-check amount
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (payment.status !== 'captured') {
      return res.status(400).json({ success: false, message: `Payment not captured. Status: ${payment.status}` });
    }

    // Step 3: Update our order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Prevent double-processing
    if (order.payment.status === 'paid') {
      return res.json({ success: true, message: 'Payment already recorded', order });
    }

    order.payment.status = 'paid';
    order.payment.razorpayOrderId = razorpay_order_id;
    order.payment.razorpayPaymentId = razorpay_payment_id;
    order.payment.razorpaySignature = razorpay_signature;
    order.payment.transactionId = razorpay_payment_id;
    order.payment.paidAt = new Date();
    order.status = 'confirmed';
    order.statusHistory.push({
      status: 'confirmed',
      message: `Payment confirmed via Razorpay (${razorpay_payment_id})`,
      updatedBy: req.user._id,
    });

    await order.save();

    res.json({ success: true, message: 'Payment verified successfully', order });
  } catch (error) {
    console.error('Payment verification error:', error);
    next(error);
  }
};

// ─── Razorpay Webhook ───────────────────────────────────────────────────────
// Razorpay calls this URL for async events (payment.captured, payment.failed, refund, etc.)
exports.razorpayWebhook = async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSignature) {
    console.warn('⚠️  Invalid Razorpay webhook signature');
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }

  const event = req.body.event;
  const payload = req.body.payload;

  console.log(`📬 Razorpay webhook: ${event}`);

  try {
    if (event === 'payment.captured') {
      const payment = payload.payment.entity;
      // Find order by razorpay order id and mark as paid if not already
      const order = await Order.findOne({ 'payment.razorpayOrderId': payment.order_id });
      if (order && order.payment.status !== 'paid') {
        order.payment.status = 'paid';
        order.payment.razorpayPaymentId = payment.id;
        order.payment.paidAt = new Date();
        order.status = 'confirmed';
        order.statusHistory.push({ status: 'confirmed', message: 'Payment captured via webhook' });
        await order.save();
        console.log(`✅ Order ${order.orderId} payment captured via webhook`);
      }
    }

    if (event === 'payment.failed') {
      const payment = payload.payment.entity;
      const order = await Order.findOne({ 'payment.razorpayOrderId': payment.order_id });
      if (order) {
        order.payment.status = 'failed';
        order.statusHistory.push({ status: 'pending', message: `Payment failed: ${payment.error_description || 'Unknown error'}` });
        await order.save();
        console.log(`❌ Order ${order.orderId} payment failed via webhook`);
      }
    }

    if (event === 'refund.created') {
      const refund = payload.refund.entity;
      const order = await Order.findOne({ 'payment.razorpayPaymentId': refund.payment_id });
      if (order) {
        order.payment.status = 'refunded';
        order.statusHistory.push({ status: order.status, message: `Refund initiated: ₹${refund.amount / 100}` });
        await order.save();
        console.log(`💸 Order ${order.orderId} refund created via webhook`);
      }
    }
  } catch (err) {
    console.error('Webhook processing error:', err.message);
  }

  // Always return 200 to Razorpay — otherwise it will retry
  res.status(200).json({ received: true });
};

// ─── Initiate Refund (Admin) ────────────────────────────────────────────────
exports.initiateRefund = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (!order.payment.razorpayPaymentId) {
      return res.status(400).json({ success: false, message: 'No Razorpay payment found for this order' });
    }

    if (order.payment.status === 'refunded') {
      return res.status(400).json({ success: false, message: 'Already refunded' });
    }

    const refundAmount = req.body.amount
      ? Math.round(req.body.amount * 100)
      : undefined; // undefined = full refund

    const refund = await razorpay.payments.refund(order.payment.razorpayPaymentId, {
      amount: refundAmount,
      notes: { reason: req.body.reason || 'Refund by admin', orderId: order.orderId },
    });

    order.payment.status = 'refunded';
    order.statusHistory.push({
      status: order.status,
      message: `Refund of ₹${(refund.amount / 100)} initiated (Refund ID: ${refund.id})`,
      updatedBy: req.user._id,
    });
    await order.save();

    res.json({ success: true, message: 'Refund initiated successfully', refund });
  } catch (error) {
    console.error('Refund error:', error);
    next(error);
  }
};

// ─── Update Courier Tracking (Admin) ───────────────────────────────────────
exports.updateCourierTracking = async (req, res, next) => {
  try {
    const { courierName, trackingId, trackingUrl } = req.body;

    if (!courierName || !trackingId) {
      return res.status(400).json({ success: false, message: 'Courier name and tracking ID are required' });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.shipping = {
      type: 'courier',
      courierName: courierName.trim(),
      trackingId: trackingId.trim(),
      trackingUrl: trackingUrl?.trim() || '',
      courierUpdatedAt: new Date(),
    };

    // Auto-advance status to shipped if not already
    if (!['shipped', 'out_for_delivery', 'delivered'].includes(order.status)) {
      order.status = 'shipped';
    }

    order.statusHistory.push({
      status: order.status,
      message: `Shipped via ${courierName} — Tracking ID: ${trackingId}`,
      updatedBy: req.user._id,
    });

    await order.save();

    res.json({ success: true, message: 'Courier tracking updated', order });
  } catch (error) {
    next(error);
  }
};

// ─── Get Payment Details (Admin) ────────────────────────────────────────────
exports.getPaymentDetails = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);
    res.json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};
