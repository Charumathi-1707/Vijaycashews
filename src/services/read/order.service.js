import axios from "../api/axios";
import { BASE_URL } from "../api/sheets";

export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error("Orders Fetch Error:", error);
    return [];
  }
};
