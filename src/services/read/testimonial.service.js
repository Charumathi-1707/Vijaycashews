import axios from "../api/axios";
import { BASE_URL } from "../api/sheets";

export const fetchTestimonials = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/testimonials`);
    return response.data;
  } catch (error) {
    console.error("Testimonials Fetch Error:", error);
    return [];
  }
};
