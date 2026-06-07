const express = require('express');
const router = express.Router();
const wrap = require('../utils/wrapControllers');
const ctrl = wrap(require('../controllers/categoryController'));
const { protect, authorize } = require('../middleware/auth');
const { uploadProduct } = require('../config/cloudinary');

router.get('/', ctrl.getCategories);
router.get('/all', protect, authorize('admin'), ctrl.getAllCategories);
router.post('/', protect, authorize('admin'), uploadProduct.single('image'), ctrl.createCategory);
router.put('/:id', protect, authorize('admin'), uploadProduct.single('image'), ctrl.updateCategory);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteCategory);

module.exports = router;
