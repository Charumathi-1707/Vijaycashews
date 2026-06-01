import express from 'express';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import {
  getUsersByRole,
  getUserById,
  createDriver,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

// All routes protected and admin-only
router.get('/', auth, admin, getUsersByRole);
router.get('/:id', auth, admin, getUserById);
router.post('/', auth, admin, createDriver);
router.put('/:id', auth, admin, updateUser);
router.delete('/:id', auth, admin, deleteUser);

export default router;
