const Order = require('../models/Order');
const Product = require('../models/Product');
const { Cart, Coupon } = require('../models/Cart');

// @desc    Create order
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, payment, couponCode, notes } = req.body;

    // Validate stock and calculate pricing
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }

      const price = product.discountPrice || product.price;
      subtotal += price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        price,
        quantity: item.quantity,
        variant: item.variant || '',
      });
    }

    const shippingCost = subtotal >= 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.05);
    let discount = 0;
    let couponData = null;

    // Apply coupon
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        if (coupon.expiresAt && coupon.expiresAt < new Date()) {
          return res.status(400).json({ success: false, message: 'Coupon expired' });
        }
        if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
          return res.status(400).json({ success: false, message: `Minimum order ₹${coupon.minOrderAmount} required` });
        }
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
          return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
        }

        if (coupon.discountType === 'percentage') {
          discount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
        } else {
          discount = coupon.discountValue;
        }

        couponData = { code: coupon.code, discount };
        await Coupon.findByIdAndUpdate(coupon._id, {
          $inc: { usedCount: 1 },
          $push: { usedBy: req.user._id },
        });
      }
    }

    const total = subtotal + shippingCost + tax - discount;

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      shippingAddress,
      pricing: { subtotal, shippingCost, discount, tax, total },
      coupon: couponData,
      // FIX: All orders start as 'pending'. Only verifyPayment promotes to 'paid'.
      // Previously, non-COD orders were incorrectly marked 'paid' before payment happened.
      payment: { method: payment?.method || 'cod', status: 'pending' },
      notes,
      statusHistory: [{ status: 'pending', message: 'Order placed successfully', updatedBy: req.user._id }],
    });

    // Reduce stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], coupon: '', discount: 0 });

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let query = { customer: req.user._id };
    if (status) query.status = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('deliveryman', 'name phone avatar vehicleNumber');

    res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('deliveryman', 'name phone avatar vehicleNumber vehicleType');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Allow customer to view their own orders
    if (req.user.role === 'customer' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (Customer)
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel order at this stage' });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = req.body.reason || 'Cancelled by customer';
    order.statusHistory.push({ status: 'cancelled', message: req.body.reason, updatedBy: req.user._id });

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity, sold: -item.quantity } });
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// ===== ADMIN CONTROLLERS =====

// @desc    Get all orders (Admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    let query = {};
    if (status) query.status = status;
    if (search) query.orderId = { $regex: search, $options: 'i' };

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('deliveryman', 'name phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, message, deliverymanId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    order.statusHistory.push({ status, message: message || `Status updated to ${status}`, updatedBy: req.user._id });

    if (deliverymanId) order.deliveryman = deliverymanId;
    if (status === 'delivered') order.deliveredAt = new Date();
    if (status === 'cancelled') order.cancelledAt = new Date();
    if (status === 'shipped') order.estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign deliveryman (Admin)
exports.assignDeliveryman = async (req, res, next) => {
  try {
    const { deliverymanId } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryman: deliverymanId, status: 'shipped', $push: { statusHistory: { status: 'shipped', message: 'Assigned to delivery partner', updatedBy: req.user._id } } },
      { new: true }
    ).populate('deliveryman', 'name phone');
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [totalOrders, todayOrders, monthOrders, pendingOrders, totalRevenue, monthRevenue] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ createdAt: { $gte: thisMonth } }),
      Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'processing'] } }),
      Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$pricing.total' } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: thisMonth }, status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$pricing.total' } } }]),
    ]);

    // Revenue by day (last 30 days)
    const revenueChart = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, status: { $ne: 'cancelled' } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$pricing.total' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Status distribution
    const statusDist = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const User = require('../models/User');
    const Product = require('../models/Product');
    const [totalUsers, totalProducts, lowStockProducts] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ stock: { $lte: 10 }, isActive: true }),
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders, todayOrders, monthOrders, pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthRevenue: monthRevenue[0]?.total || 0,
        totalUsers, totalProducts, lowStockProducts,
      },
      revenueChart,
      statusDist,
    });
  } catch (error) {
    next(error);
  }
};

// ===== DELIVERYMAN CONTROLLERS =====

// @desc    Get deliveryman orders
exports.getDeliveryOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = { deliveryman: req.user._id };
    if (status) query.status = status;
    else query.status = { $in: ['shipped', 'out_for_delivery', 'delivered'] };

    const orders = await Order.find(query)
      .populate('customer', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery status (Deliveryman)
exports.updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status, message } = req.body;
    const allowed = ['out_for_delivery', 'delivered'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status update' });
    }

    const order = await Order.findOne({ _id: req.params.id, deliveryman: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    order.statusHistory.push({ status, message: message || `Updated to ${status}`, updatedBy: req.user._id });
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      order.payment.status = 'paid';
      await require('../models/User').findByIdAndUpdate(req.user._id, { $inc: { totalDeliveries: 1 } });
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};