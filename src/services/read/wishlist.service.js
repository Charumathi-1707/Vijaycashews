import axios from "../api/axios";
import { BASE_URL } from "../api/sheets";

export const fetchWishlists = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/wishlists`);
    return response.data;
  } catch (error) {
    console.error("Wishlists Fetch Error:", error);
    return [];
  }
};
