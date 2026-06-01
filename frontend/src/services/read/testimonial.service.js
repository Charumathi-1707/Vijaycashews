import axiosInstance from "../api/axios";

// Fetch testimonials (approved only)
export const fetchTestimonials = async () => {
  try {
    const response = await axiosInstance.get("/testimonials");
    return response.data.testimonials || [];
  } catch (error) {
    console.error("Testimonials Fetch Error:", error);
    return [];
  }
};

// Fetch all testimonials (Admin)
export const fetchAllTestimonials = async () => {
  try {
    const response = await axiosInstance.get("/testimonials/admin/all");
    return response.data.testimonials || [];
  } catch (error) {
    console.error("Testimonials Fetch Error:", error);
    return [];
  }
};
