import axiosInstance from "../api/axios";

// Add to wishlist
export const addToWishlist = async (productId) => {
  try {
    const response = await axiosInstance.post("/wishlist/add", { productId });
    return response.data;
  } catch (error) {
    console.error("Add to Wishlist Error:", error);
    throw error.response?.data || error;
  }
};

// Remove from wishlist
export const removeFromWishlist = async (productId) => {
  try {
    const response = await axiosInstance.post("/wishlist/remove", { productId });
    return response.data;
  } catch (error) {
    console.error("Remove from Wishlist Error:", error);
    throw error.response?.data || error;
  }
};

// Legacy function for backward compatibility
export const saveWishlist = async (email, items) => {
  return addToWishlist(items[0].productId);
};
