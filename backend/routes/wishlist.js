const express = require('express');
const router = express.Router();
const wrap = require('../utils/wrapControllers');
const ctrl = wrap(require('../controllers/wishlistController'));
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('customer'));
router.get('/', ctrl.getWishlist);
router.post('/toggle', ctrl.toggleWishlist);

module.exports = router;
