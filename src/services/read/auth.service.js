import axios from "../api/axios";
import { BASE_URL } from "../api/sheets";

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Users Fetch Error:", error);
    return [];
  }
};
