import axios from "../api/axios";
import { BASE_URL } from "../api/sheets";

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Products Fetch Error:", error);
    return [];
  }
};
