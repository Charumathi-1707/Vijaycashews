import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Create order
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, deliveryCharge, discount } = req.body;

    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Verify stock and prepare order items
    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.productName}`,
        });
      }

      // Reduce product stock
      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      });
    }

    const totalAmount = cart.totalPrice;
    const finalAmount = totalAmount + (deliveryCharge || 0) - (discount || 0);

    const order = await Order.create({
      userId: req.userId,
      orderId: `VCO-${Date.now()}`,
      items: orderItems,
      totalAmount,
      deliveryCharge: deliveryCharge || 0,
      discount: discount || 0,
      finalAmount,
      shippingAddress,
      paymentMethod,
    });

    // Clear cart
    await Cart.updateOne({ userId: req.userId }, { items: [], totalItems: 0, totalPrice: 0 });

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this order' });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Admin or Delivery)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, notes, assignedTo } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.userRole === 'delivery') {
      if (!order.assignedTo || order.assignedTo.toString() !== req.userId) {
        return res.status(403).json({ message: 'Not authorized to update this order' });
      }
    }

    if (assignedTo) {
      order.assignedTo = assignedTo;
    }

    if (status) {
      order.status = status.toLowerCase();
    }

    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }

    if (notes !== undefined) {
      order.notes = notes;
    }

    await order.save();
    await order.populate('assignedTo', 'name email');

    res.status(200).json({
      message: 'Order updated successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get assigned orders for delivery users
export const getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ assignedTo: req.userId }).sort({ createdAt: -1 }).populate('userId', 'name email phone').populate('assignedTo', 'name email');
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const { status, sortBy } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    let orders = Order.find(query);

    if (sortBy === 'newest') {
      orders = orders.sort({ createdAt: -1 });
    } else if (sortBy === 'oldest') {
      orders = orders.sort({ createdAt: 1 });
    }

    const result = await orders.populate('userId', 'name email phone').populate('assignedTo', 'name email');

    res.status(200).json({ orders: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
