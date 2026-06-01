import axiosInstance from "../api/axios";

export const uploadProductImage = async (formData) => {
  try {
    const response = await axiosInstance.post("/products/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Product Image Upload Error:", error);
    throw error.response?.data || error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post("/products", productData);
    return response.data;
  } catch (error) {
    console.error("Create Product Error:", error);
    throw error.response?.data || error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await axiosInstance.put(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error("Update Product Error:", error);
    throw error.response?.data || error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Delete Product Error:", error);
    throw error.response?.data || error;
  }
};
