const express = require('express');
const router = express.Router();
const wrap = require('../utils/wrapControllers');
const ctrl = wrap(require('../controllers/paymentController'));
const { protect, authorize } = require('../middleware/auth');

// Customer — create Razorpay order before checkout
router.post('/razorpay/create-order', protect, authorize('customer'), ctrl.createRazorpayOrder);

// Customer — verify payment after Razorpay modal success
router.post('/razorpay/verify', protect, authorize('customer'), ctrl.verifyPayment);

// Razorpay webhook — NO auth (Razorpay calls this directly)
// Must use raw body for signature verification
router.post('/razorpay/webhook', express.raw({ type: 'application/json' }), ctrl.razorpayWebhook);

// Admin — refund
router.post('/refund/:orderId', protect, authorize('admin'), ctrl.initiateRefund);

// Admin — courier tracking
router.post('/courier/:orderId', protect, authorize('admin'), ctrl.updateCourierTracking);

// Admin — get payment details from Razorpay
router.get('/details/:paymentId', protect, authorize('admin'), ctrl.getPaymentDetails);

module.exports = router;
