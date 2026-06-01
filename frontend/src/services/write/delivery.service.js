import axiosInstance from "../api/axios";

// Update delivery status (Delivery Partner)
export const updateDeliveryStatus = async (deliveryId, status, currentLocation) => {
  try {
    const response = await axiosInstance.put(`/delivery/${deliveryId}`, {
      status,
      currentLocation,
    });
    return response.data;
  } catch (error) {
    console.error("Update Delivery Error:", error);
    throw error.response?.data || error;
  }
};

// Confirm delivery
export const confirmDelivery = async (deliveryId, notes) => {
  try {
    const response = await axiosInstance.post(`/delivery/${deliveryId}/confirm`, { notes });
    return response.data;
  } catch (error) {
    console.error("Confirm Delivery Error:", error);
    throw error.response?.data || error;
  }
};
