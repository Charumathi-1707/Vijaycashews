import axios from "../api/axios";
import { BASE_URL } from "../api/sheets";

export const fetchDeliveryCharges = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/delivery`);
    return response.data;
  } catch (error) {
    console.error("Delivery Charges Fetch Error:", error);
    return [];
  }
};
