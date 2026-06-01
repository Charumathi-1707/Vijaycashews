import axiosInstance from "../api/axios";

export const fetchUsers = async (role) => {
  try {
    const params = {};
    if (role) params.role = role;
    const response = await axiosInstance.get("/admin/users", { params });
    return response.data.users || [];
  } catch (error) {
    console.error("Users Fetch Error:", error);
    return [];
  }
};

export const fetchUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/admin/users/${userId}`);
    return response.data.user;
  } catch (error) {
    console.error("User Fetch Error:", error);
    return null;
  }
};
