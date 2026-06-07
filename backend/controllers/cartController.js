const { Cart, Coupon } = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get cart
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price discountPrice stock isActive');
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    // Remove inactive/deleted products
    cart.items = cart.items.filter(item => item.product && item.product.isActive);
    await cart.save();

    const subtotal = cart.items.reduce((acc, item) => {
      const price = item.product.discountPrice || item.product.price;
      return acc + price * item.quantity;
    }, 0);

    res.json({ success: true, cart, subtotal });
  } catch (error) {
    next(error);
  }
};

// @desc    Add to cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, variant = '' } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existingIdx = cart.items.findIndex(
      item => item.product.toString() === productId && item.variant === variant
    );

    const price = product.discountPrice || product.price;

    if (existingIdx >= 0) {
      cart.items[existingIdx].quantity += quantity;
      cart.items[existingIdx].price = price;
    } else {
      cart.items.push({ product: productId, quantity, variant, price });
    }

    await cart.save();
    await cart.populate('items.product', 'name images price discountPrice stock');
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name images price discountPrice stock');
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: { _id: req.params.itemId } } },
      { new: true }
    ).populate('items.product', 'name images price discountPrice stock');
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], coupon: '', discount: 0 });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply coupon
exports.applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }
    if (coupon.usedBy.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You have already used this coupon' });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'price discountPrice');
    const subtotal = cart.items.reduce((acc, i) => acc + (i.product.discountPrice || i.product.price) * i.quantity, 0);

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return res.status(400).json({ success: false, message: `Minimum order amount ₹${coupon.minOrderAmount} required` });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
    } else {
      discount = coupon.discountValue;
    }

    cart.coupon = coupon.code;
    cart.discount = discount;
    await cart.save();

    res.json({ success: true, discount, coupon: { code: coupon.code, description: coupon.description } });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove coupon
exports.removeCoupon = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { coupon: '', discount: 0 });
    res.json({ success: true, message: 'Coupon removed' });
  } catch (error) {
    next(error);
  }
};
