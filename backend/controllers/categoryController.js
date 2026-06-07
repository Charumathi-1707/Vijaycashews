const Category = require('../models/Category');
const { cloudinary } = require('../config/cloudinary');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    res.json({ success: true, categories });
  } catch (error) { next(error); }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ success: true, categories });
  } catch (error) { next(error); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, sortOrder } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const data = { name, slug, description, sortOrder };
    if (req.file) { data.image = req.file.path; data.imagePublicId = req.file.filename; }
    const category = await Category.create(data);
    res.status(201).json({ success: true, category });
  } catch (error) { next(error); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.name) data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (req.file) {
      const existing = await Category.findById(req.params.id);
      if (existing?.imagePublicId) await cloudinary.uploader.destroy(existing.imagePublicId);
      data.image = req.file.path;
      data.imagePublicId = req.file.filename;
    }
    const category = await Category.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ success: true, category });
  } catch (error) { next(error); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    if (category.imagePublicId) await cloudinary.uploader.destroy(category.imagePublicId);
    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) { next(error); }
};
