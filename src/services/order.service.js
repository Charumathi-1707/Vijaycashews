import {
  saveOrder as saveOrderApi,
  updateOrderStatus as updateOrderStatusApi,
  saveUser as saveUserApi,
  saveCart as saveCartApi,
  saveWishlist as saveWishlistApi,
} from "./write/index";

export const saveOrder = saveOrderApi;
export const updateOrderStatus = updateOrderStatusApi;
export const saveUser = saveUserApi;
export const saveCart = saveCartApi;
export const saveWishlist = saveWishlistApi;
