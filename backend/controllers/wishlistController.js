import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// Get user wishlist
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.userId }).populate('items.productId');

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.userId, items: [] });
    }

    res.status(200).json({ wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ userId: req.userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.userId, items: [] });
    }

    const existingItem = wishlist.items.find((item) => item.productId.toString() === productId);

    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    wishlist.items.push({
      productId,
      productName: product.name,
      price: product.price,
      image: product.image,
    });

    await wishlist.save();

    res.status(200).json({
      message: 'Added to wishlist successfully',
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const wishlist = await Wishlist.findOne({ userId: req.userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter((item) => item.productId.toString() !== productId);

    await wishlist.save();

    res.status(200).json({
      message: 'Removed from wishlist successfully',
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
