import express from 'express';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getAssignedOrders,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', auth, createOrder);
router.get('/assigned', auth, getAssignedOrders);
router.get('/', auth, getOrders);
router.get('/:id', auth, getOrderById);
router.put('/:id/status', auth, updateOrderStatus); // Admin or Delivery
router.post('/:id/cancel', auth, cancelOrder);
router.get('/admin/all', auth, admin, getAllOrders); // Admin only

export default router;
