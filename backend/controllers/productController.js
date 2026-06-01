import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let products = Product.find(query);

    if (sort === 'price-asc') {
      products = products.sort({ price: 1 });
    } else if (sort === 'price-desc') {
      products = products.sort({ price: -1 });
    } else {
      products = products.sort({ createdAt: -1 });
    }

    const result = await products.exec();
    res.status(200).json({ products: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, image, imagePublicId, images, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      originalPrice,
      category,
      image,
      imagePublicId,
      images,
      stock,
    });

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCloudinaryPublicIdFromUrl = (url) => {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    const match = parsedUrl.pathname.match(/\/image\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const publicId = product.imagePublicId || getCloudinaryPublicIdFromUrl(product.image);

    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, { invalidate: true });
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
      }
    }

    product.isActive = false;
    await product.save();

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload product image to Cloudinary
export const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const fileData = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(fileData, {
      folder: 'vijay-cashews/products',
      transformation: [{ width: 1200, crop: 'limit' }],
    });

    res.status(200).json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Unable to upload image' });
  }
};

// Add product review
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = {
      userId: req.userId,
      name: req.userName || req.body.name || 'Anonymous',
      rating: Number(rating) || 0,
      comment,
    };

    product.reviews.push(review);
    product.rating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({
      message: 'Review added successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
