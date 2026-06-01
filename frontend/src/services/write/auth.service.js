import axiosInstance from "../api/axios";

export const saveUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error("Save User Error:", error);
    throw error.response?.data || error;
  }
};
