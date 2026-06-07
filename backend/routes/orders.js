const express = require('express');
const router = express.Router();
const wrap = require('../utils/wrapControllers');
const ctrl = wrap(require('../controllers/orderController'));
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), ctrl.createOrder);
router.get('/my', protect, authorize('customer'), ctrl.getMyOrders);
router.put('/:id/cancel', protect, authorize('customer'), ctrl.cancelOrder);

router.get('/admin/all', protect, authorize('admin'), ctrl.getAllOrders);
router.get('/admin/stats', protect, authorize('admin'), ctrl.getDashboardStats);
router.put('/admin/:id/status', protect, authorize('admin'), ctrl.updateOrderStatus);
router.put('/admin/:id/assign', protect, authorize('admin'), ctrl.assignDeliveryman);

router.get('/delivery/my', protect, authorize('deliveryman'), ctrl.getDeliveryOrders);
router.put('/delivery/:id/status', protect, authorize('deliveryman'), ctrl.updateDeliveryStatus);

router.get('/:id', protect, ctrl.getOrder);

module.exports = router;
