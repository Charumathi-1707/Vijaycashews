import Testimonial from '../models/Testimonial.js';

// Create testimonial
export const createTestimonial = async (req, res) => {
  try {
    const { name, email, rating, comment, image } = req.body;

    const testimonial = await Testimonial.create({
      userId: req.userId || null,
      name,
      email,
      rating,
      comment,
      image,
      isApproved: false,
    });

    res.status(201).json({
      message: 'Testimonial submitted successfully',
      testimonial,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get approved testimonials
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 });
    res.status(200).json({ testimonials });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all testimonials (Admin only)
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({ testimonials });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve testimonial (Admin only)
export const approveTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.status(200).json({
      message: 'Testimonial approved successfully',
      testimonial,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete testimonial (Admin only)
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
