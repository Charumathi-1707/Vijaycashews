const express = require('express');
const router = express.Router();
const wrap = require('../utils/wrapControllers');
const ctrl = wrap(require('../controllers/cartController'));
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('customer'));
router.get('/', ctrl.getCart);
router.post('/add', ctrl.addToCart);
router.put('/item/:itemId', ctrl.updateCartItem);
router.delete('/item/:itemId', ctrl.removeFromCart);
router.delete('/clear', ctrl.clearCart);
router.post('/coupon', ctrl.applyCoupon);
router.delete('/coupon', ctrl.removeCoupon);

module.exports = router;
