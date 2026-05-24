import axios from "../api/axios";
import { BASE_URL } from "../api/sheets";

export const fetchCarts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/carts`);
    return response.data;
  } catch (error) {
    console.error("Carts Fetch Error:", error);
    return [];
  }
};
