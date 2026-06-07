const express = require('express');
const router = express.Router();
const wrap = require('../utils/wrapControllers');
const ctrl = wrap(require('../controllers/authController'));
const { protect } = require('../middleware/auth');
const { uploadAvatar } = require('../config/cloudinary');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/logout', protect, ctrl.logout);
router.get('/me', protect, ctrl.getMe);
router.put('/profile', protect, uploadAvatar.single('avatar'), ctrl.updateProfile);
router.put('/change-password', protect, ctrl.changePassword);
router.post('/address', protect, ctrl.addAddress);
router.put('/address/:addressId', protect, ctrl.updateAddress);
router.delete('/address/:addressId', protect, ctrl.deleteAddress);

module.exports = router;
