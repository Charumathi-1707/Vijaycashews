const express = require('express');
const router = express.Router();
const wrap = require('../utils/wrapControllers');
const ctrl = wrap(require('../controllers/adminController'));
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/users', ctrl.getAllUsers);
router.get('/users/:id', ctrl.getUserById);
router.put('/users/:id', ctrl.updateUser);
router.post('/staff', ctrl.createStaffUser);
router.put('/users/:id/toggle', ctrl.toggleUserStatus);
router.get('/deliverymen', ctrl.getDeliverymen);

router.get('/coupons', ctrl.getCoupons);
router.post('/coupons', ctrl.createCoupon);
router.put('/coupons/:id', ctrl.updateCoupon);
router.delete('/coupons/:id', ctrl.deleteCoupon);

module.exports = router;
