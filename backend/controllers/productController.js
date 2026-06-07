const Product = require('../models/Product');
const Category = require('../models/Category');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all products with filtering, sorting, pagination
exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12, featured, brand } = req.query;

    let query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (featured) query.isFeatured = true;
    if (brand) query.brand = { $regex: brand, $options: 'i' };

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'popular') sortOption = { sold: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ 
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
      isActive: true 
    }).populate('category', 'name slug').populate('reviews.user', 'name avatar');

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin)
exports.createProduct = async (req, res, next) => {
  try {
    const data = { ...req.body };
    
    // Generate slug
    data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();

    if (data.discountPrice && data.price) {
      data.discountPercent = Math.round(((data.price - data.discountPrice) / data.price) * 100);
    }

    if (req.files && req.files.length > 0) {
      data.images = req.files.map(f => ({ url: f.path, publicId: f.filename }));
    }

    if (data.variants && typeof data.variants === 'string') {
      data.variants = JSON.parse(data.variants);
    }
    if (data.tags && typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map(t => t.trim());
    }

    const product = await Product.create(data);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (data.discountPrice && data.price) {
      data.discountPercent = Math.round(((data.price - data.discountPrice) / data.price) * 100);
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => ({ url: f.path, publicId: f.filename }));
      const existing = await Product.findById(req.params.id);
      data.images = [...(existing.images || []), ...newImages];
    }

    if (data.variants && typeof data.variants === 'string') {
      data.variants = JSON.parse(data.variants);
    }
    if (data.tags && typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map(t => t.trim());
    }

    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product image
exports.deleteProductImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    await cloudinary.uploader.destroy(publicId);
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $pull: { images: { publicId } } },
      { new: true }
    );
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Delete images from cloudinary
    for (const img of product.images) {
      if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review
exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const already = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (already) return res.status(400).json({ success: false, message: 'Already reviewed' });

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      images: req.files ? req.files.map(f => ({ url: f.path, publicId: f.filename })) : [],
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save();

    res.status(201).json({ success: true, message: 'Review added' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products for admin
exports.getAdminProducts = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    let query = {};
    if (search) query.$text = { $search: search };
    
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, products, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};
