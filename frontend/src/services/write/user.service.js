import axiosInstance from "../api/axios";

export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/admin/users", userData);
    return response.data.user;
  } catch (error) {
    console.error("Create User Error:", error);
    throw error.response?.data || error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`/admin/users/${userId}`, userData);
    return response.data.user;
  } catch (error) {
    console.error("Update User Error:", error);
    throw error.response?.data || error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Delete User Error:", error);
    throw error.response?.data || error;
  }
};
