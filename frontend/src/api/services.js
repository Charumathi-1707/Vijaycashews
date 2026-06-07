import api from './axios';

// AUTH
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data) => api.put('/auth/change-password', data),
  addAddress: (data) => api.post('/auth/address', data),
  updateAddress: (id, data) => api.put(`/auth/address/${id}`, data),
  deleteAddress: (id) => api.delete(`/auth/address/${id}`),
};

// PRODUCTS
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  getAdminAll: (params) => api.get('/products/admin', { params }),
  create: (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/${id}`),
  deleteImage: (id, publicId) => api.delete(`/products/${id}/image`, { data: { publicId } }),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
};

// CATEGORIES
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getAllAdmin: () => api.get('/categories/all'),
  create: (data) => api.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/categories/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/categories/${id}`),
};

// CART
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  update: (itemId, quantity) => api.put(`/cart/item/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/cart/item/${itemId}`),
  clear: () => api.delete('/cart/clear'),
  applyCoupon: (code) => api.post('/cart/coupon', { code }),
  removeCoupon: () => api.delete('/cart/coupon'),
};

// WISHLIST
export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  toggle: (productId) => api.post('/wishlist/toggle', { productId }),
};

// ORDERS
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMy: (params) => api.get('/orders/my', { params }),
  getOne: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  // Admin
  adminGetAll: (params) => api.get('/orders/admin/all', { params }),
  adminGetStats: () => api.get('/orders/admin/stats'),
  adminUpdateStatus: (id, data) => api.put(`/orders/admin/${id}/status`, data),
  adminAssign: (id, deliverymanId) => api.put(`/orders/admin/${id}/assign`, { deliverymanId }),
  // Delivery
  deliveryGetMy: (params) => api.get('/orders/delivery/my', { params }),
  deliveryUpdateStatus: (id, data) => api.put(`/orders/delivery/${id}/status`, data),
};

// PAYMENT
export const paymentAPI = {
  createRazorpayOrder: (data) => api.post('/payment/razorpay/create-order', data),
  verifyPayment: (data) => api.post('/payment/razorpay/verify', data),
  initiateRefund: (orderId, data) => api.post(`/payment/refund/${orderId}`, data),
  updateCourierTracking: (orderId, data) => api.post(`/payment/courier/${orderId}`, data),
  getPaymentDetails: (paymentId) => api.get(`/payment/details/${paymentId}`),
};

// ADMIN
export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  createStaff: (data) => api.post('/admin/staff', data),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
  getDeliverymen: () => api.get('/admin/deliverymen'),
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
};
