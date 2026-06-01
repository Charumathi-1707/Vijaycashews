import axiosInstance from "../api/axios";

// Add to cart
export const addToCart = async (productId, quantity) => {
  try {
    const response = await axiosInstance.post("/cart/add", {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Add to Cart Error:", error);
    throw error.response?.data || error;
  }
};

// Remove from cart
export const removeFromCart = async (productId) => {
  try {
    const response = await axiosInstance.post("/cart/remove", { productId });
    return response.data;
  } catch (error) {
    console.error("Remove from Cart Error:", error);
    throw error.response?.data || error;
  }
};

// Update cart quantity
export const updateCartQuantity = async (productId, quantity) => {
  try {
    const response = await axiosInstance.post("/cart/update", {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Update Cart Error:", error);
    throw error.response?.data || error;
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    const response = await axiosInstance.post("/cart/clear");
    return response.data;
  } catch (error) {
    console.error("Clear Cart Error:", error);
    throw error.response?.data || error;
  }
};

// Legacy function for backward compatibility
export const saveCart = async (email, items) => {
  return addToCart(items[0].productId, items[0].quantity);
};
