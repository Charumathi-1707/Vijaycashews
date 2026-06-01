import axiosInstance from "../api/axios";

// Create order
export const saveOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Save Order Error:", error);
    throw error.response?.data || error;
  }
};

// Update order status (Admin or Delivery)
export const updateOrderStatus = async (orderId, status, trackingNumber, notes, assignedTo) => {
  try {
    const payload = {
      status,
      trackingNumber,
      notes,
    };
    if (assignedTo) payload.assignedTo = assignedTo;
    const response = await axiosInstance.put(`/orders/${orderId}/status`, payload);
    return response.data;
  } catch (error) {
    console.error("Update Order Status Error:", error);
    throw error.response?.data || error;
  }
};

// Cancel order
export const cancelOrder = async (orderId) => {
  try {
    const response = await axiosInstance.post(`/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Cancel Order Error:", error);
    throw error.response?.data || error;
  }
};

// Legacy function for backward compatibility
export const assignDeliveryPerson = async (orderId, deliveryPerson) => {
  return updateOrderStatus(orderId, "assigned", null, `Assigned to ${deliveryPerson}`);
};
