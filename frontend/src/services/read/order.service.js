import axiosInstance from "../api/axios";

// Fetch user orders
export const fetchOrders = async () => {
  try {
    const response = await axiosInstance.get("/orders");
    return response.data.orders || [];
  } catch (error) {
    console.error("Orders Fetch Error:", error);
    return [];
  }
};

// Get order by ID
export const fetchOrderById = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data.order;
  } catch (error) {
    console.error("Order Fetch Error:", error);
    return null;
  }
};

// Get all orders (Admin)
export const fetchAllOrders = async (status) => {
  try {
    const params = {};
    if (status) params.status = status;
    const response = await axiosInstance.get("/orders/admin/all", { params });
    return response.data.orders || [];
  } catch (error) {
    console.error("Orders Fetch Error:", error);
    return [];
  }
};

// Get assigned orders for delivery users
export const fetchAssignedOrders = async () => {
  try {
    const response = await axiosInstance.get("/orders/assigned");
    return response.data.orders || [];
  } catch (error) {
    console.error("Assigned Orders Fetch Error:", error);
    return [];
  }
};
