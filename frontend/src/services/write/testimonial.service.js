import axiosInstance from "../api/axios";

// Submit testimonial
export const submitTestimonial = async (testimonialData) => {
  try {
    const response = await axiosInstance.post("/testimonials", testimonialData);
    return response.data;
  } catch (error) {
    console.error("Submit Testimonial Error:", error);
    throw error.response?.data || error;
  }
};

// Approve testimonial (Admin)
export const approveTestimonial = async (testimonialId) => {
  try {
    const response = await axiosInstance.put(`/testimonials/${testimonialId}/approve`);
    return response.data;
  } catch (error) {
    console.error("Approve Testimonial Error:", error);
    throw error.response?.data || error;
  }
};

// Delete testimonial (Admin)
export const deleteTestimonial = async (testimonialId) => {
  try {
    const response = await axiosInstance.delete(`/testimonials/${testimonialId}`);
    return response.data;
  } catch (error) {
    console.error("Delete Testimonial Error:", error);
    throw error.response?.data || error;
  }
};
