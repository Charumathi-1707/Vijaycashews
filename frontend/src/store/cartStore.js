import { create } from 'zustand';
import { cartAPI } from '../api/services';
import toast from 'react-hot-toast';

const useCartStore = create((set, get) => ({
  cart: null,
  subtotal: 0,
  itemCount: 0,
  loading: false,

  fetchCart: async () => {
    try {
      const { data } = await cartAPI.get();
      const count = data.cart.items.reduce((acc, i) => acc + i.quantity, 0);
      set({ cart: data.cart, subtotal: data.subtotal, itemCount: count });
    } catch {}
  },

  addToCart: async (productId, quantity = 1, variant = '') => {
    try {
      const { data } = await cartAPI.add({ productId, quantity, variant });
      const count = data.cart.items.reduce((acc, i) => acc + i.quantity, 0);
      set({ cart: data.cart, itemCount: count });
      toast.success('Added to cart!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      return false;
    }
  },

  updateItem: async (itemId, quantity) => {
    try {
      const { data } = await cartAPI.update(itemId, quantity);
      const count = data.cart.items.reduce((acc, i) => acc + i.quantity, 0);
      set({ cart: data.cart, itemCount: count });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  },

  removeItem: async (itemId) => {
    try {
      const { data } = await cartAPI.remove(itemId);
      const count = data.cart.items.reduce((acc, i) => acc + i.quantity, 0);
      set({ cart: data.cart, itemCount: count });
      toast.success('Removed from cart');
    } catch {}
  },

  clearCart: async () => {
    try {
      await cartAPI.clear();
      set({ cart: null, subtotal: 0, itemCount: 0 });
    } catch {}
  },

  applyCoupon: async (code) => {
    try {
      const { data } = await cartAPI.applyCoupon(code);
      toast.success(`Coupon applied! Saved ₹${data.discount}`);
      return { success: true, discount: data.discount };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
      return { success: false };
    }
  },

  removeCoupon: async () => {
    try {
      await cartAPI.removeCoupon();
      toast.success('Coupon removed');
    } catch {}
  },
}));

export default useCartStore;
