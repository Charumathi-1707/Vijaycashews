import express from 'express';
import auth from '../middleware/auth.js';
import {
  createTestimonial,
  getTestimonials,
  getAllTestimonials,
  approveTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';

const router = express.Router();

router.post('/', createTestimonial);
router.get('/', getTestimonials);
router.get('/admin/all', auth, getAllTestimonials); // Admin only
router.put('/:id/approve', auth, approveTestimonial); // Admin only
router.delete('/:id', auth, deleteTestimonial); // Admin only

export default router;
