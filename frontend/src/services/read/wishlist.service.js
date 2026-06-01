import axiosInstance from "../api/axios";

// Fetch user wishlist
export const fetchWishlist = async () => {
  try {
    const response = await axiosInstance.get("/wishlist");
    return response.data.wishlist?.items || [];
  } catch (error) {
    console.error("Wishlist Fetch Error:", error);
    return [];
  }
};

// Get wishlists (backward compatibility)
export const fetchWishlists = async () => {
  return fetchWishlist();
};
