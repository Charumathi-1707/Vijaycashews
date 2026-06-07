const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name images price discountPrice rating stock isActive');
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    wishlist.products = wishlist.products.filter(p => p && p.isActive);
    res.json({ success: true, wishlist });
  } catch (error) { next(error); }
};

exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

    const idx = wishlist.products.indexOf(productId);
    let added;
    if (idx >= 0) { wishlist.products.splice(idx, 1); added = false; }
    else { wishlist.products.push(productId); added = true; }

    await wishlist.save();
    res.json({ success: true, added, message: added ? 'Added to wishlist' : 'Removed from wishlist' });
  } catch (error) { next(error); }
};
