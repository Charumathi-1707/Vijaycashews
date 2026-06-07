const express = require('express');
const router = express.Router();
const wrap = require('../utils/wrapControllers');
const ctrl = wrap(require('../controllers/productController'));
const { protect, authorize } = require('../middleware/auth');
const { uploadProduct } = require('../config/cloudinary');

router.get('/', ctrl.getProducts);
router.get('/admin', protect, authorize('admin'), ctrl.getAdminProducts);
router.get('/:id', ctrl.getProduct);
router.post('/', protect, authorize('admin'), uploadProduct.array('images', 6), ctrl.createProduct);
router.put('/:id', protect, authorize('admin'), uploadProduct.array('images', 6), ctrl.updateProduct);
router.delete('/:id/image', protect, authorize('admin'), ctrl.deleteProductImage);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteProduct);
router.post('/:id/reviews', protect, authorize('customer'), uploadProduct.array('images', 3), ctrl.addReview);

module.exports = router;
