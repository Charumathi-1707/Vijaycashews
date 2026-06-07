const User = require('../models/User');
const Order = require('../models/Order');
const { Coupon } = require('../models/Cart');

// ===== USER MANAGEMENT =====
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    let query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const orders = await Order.find({ customer: user._id }).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, user, orders });
  } catch (error) { next(error); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, role, isActive, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, role, isActive, phone }, { new: true });
    res.json({ success: true, user });
  } catch (error) { next(error); }
};

exports.createStaffUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, vehicleNumber, vehicleType } = req.body;
    if (!['admin', 'deliveryman'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const user = await User.create({ name, email, password, role, phone, vehicleNumber, vehicleType });
    res.status(201).json({ success: true, user });
  } catch (error) { next(error); }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (error) { next(error); }
};

// ===== DELIVERYMEN =====
exports.getDeliverymen = async (req, res, next) => {
  try {
    const deliverymen = await User.find({ role: 'deliveryman' }).sort({ createdAt: -1 });
    res.json({ success: true, deliverymen });
  } catch (error) { next(error); }
};

// ===== COUPON MANAGEMENT =====
exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) { next(error); }
};

exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (error) { next(error); }
};

exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, coupon });
  } catch (error) { next(error); }
};

exports.deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) { next(error); }
};
