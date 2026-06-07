const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  images: [{ url: String, publicId: String }],
}, { timestamps: true });

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "500g", "1kg"
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  sku: { type: String, default: '' },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  sku: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, default: '' },
  images: [{ url: String, publicId: String }],
  variants: [variantSchema],
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  weight: { type: Number, default: 0 }, // in grams
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  meta: {
    title: String,
    description: String,
  },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
