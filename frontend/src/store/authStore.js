import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../api/services';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      login: async (credentials) => {
        set({ loading: true });
        try {
          const { data } = await authAPI.login(credentials);
          localStorage.setItem('token', data.token);
          set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
          return { success: true, role: data.user.role };
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      register: async (userData) => {
        set({ loading: true });
        try {
          const { data } = await authAPI.register(userData);
          localStorage.setItem('token', data.token);
          set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
          return { success: true };
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: async () => {
        try { await authAPI.logout(); } catch {}
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      fetchMe: async () => {
        try {
          const { data } = await authAPI.getMe();
          set({ user: data.user, isAuthenticated: true });
        } catch {
          set({ user: null, token: null, isAuthenticated: false });
          localStorage.removeItem('token');
        }
      },

      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
