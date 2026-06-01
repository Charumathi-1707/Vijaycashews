import axiosInstance from "../api/axios";

// Fetch user cart
export const fetchCart = async () => {
  try {
    const response = await axiosInstance.get("/cart");
    return response.data.cart?.items || [];
  } catch (error) {
    console.error("Cart Fetch Error:", error);
    return [];
  }
};

// Get carts (for backward compatibility)
export const fetchCarts = async () => {
  return fetchCart();
};
