import axiosInstance from "../api/axios";

// Fetch delivery charges (deprecated - now integrated with orders)
export const fetchDeliveryCharges = async () => {
  try {
    // This is now calculated per order based on location
    // Placeholder for backward compatibility
    return [];
  } catch (error) {
    console.error("Delivery Charges Fetch Error:", error);
    return [];
  }
};

// Fetch delivery tracking status
export const fetchDeliveryStatus = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data.order;
  } catch (error) {
    console.error("Delivery Status Fetch Error:", error);
    return null;
  }
};

// Get user deliveries
export const fetchUserDeliveries = async () => {
  try {
    const response = await axiosInstance.get("/orders");
    return response.data.orders || [];
  } catch (error) {
    console.error("Deliveries Fetch Error:", error);
    return [];
  }
};
