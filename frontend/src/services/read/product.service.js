import axiosInstance from "../api/axios";

// Fetch all products
export const fetchProducts = async (category, search, sort) => {
  try {
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    if (sort) params.sort = sort;

    const response = await axiosInstance.get("/products", { params });
    return response.data.products || [];
  } catch (error) {
    console.error("Products Fetch Error:", error);
    return [];
  }
};

// Get product by ID
export const fetchProductById = async (productId) => {
  try {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response.data.product;
  } catch (error) {
    console.error("Product Fetch Error:", error);
    return null;
  }
};

// Add product review
export const addProductReview = async (productId, reviewData) => {
  try {
    const response = await axiosInstance.post(`/products/${productId}/review`, reviewData);
    return response.data;
  } catch (error) {
    console.error("Review Error:", error);
    throw error.response?.data || error;
  }
};
