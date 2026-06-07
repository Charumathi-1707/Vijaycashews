import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import { LoadingScreen } from './components/ui';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ProtectedRoute, PublicOnlyRoute } from './components/layout/ProtectedRoute';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { CartPage, CheckoutPage } from './pages/CartCheckoutPages';
import OrdersPage from './pages/customer/OrdersPage';
import AccountPage from './pages/customer/AccountPage';
import WishlistPage from './pages/customer/WishlistPage';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import { AdminUsersPage, AdminDeliverymenPage, AdminCategoriesPage, AdminCouponsPage } from './pages/admin/AdminSubPages';

import { DeliveryLayout, DeliveryDashboard, DeliveryOrdersPage } from './pages/delivery/DeliveryPages';

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    import('./api/services').then(({ categoryAPI }) => {
      categoryAPI.getAll()
        .then(r => { setCategories(r.data.categories); setLoading(false); })
        .catch(() => setLoading(false));
    });
  }, []);
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-8">All Categories</h1>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {categories.map(cat => (
              <a key={cat._id} href={`/shop?category=${cat._id}`}
                className="group flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50">
                  {cat.image
                    ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl">🗂️</div>}
                </div>
                <span className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors text-sm">{cat.name}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <div className="text-8xl mb-6">🔍</div>
      <h1 className="text-5xl font-display font-black text-gray-900 mb-3">404</h1>
      <p className="text-xl text-gray-500 mb-8">Page not found</p>
      <a href="/" className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors">Go Home</a>
    </div>
  );
}

export default function App() {
  const { token, fetchMe } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (token) await fetchMe();
      setInitializing(false);
    };
    init();
  }, []);

  if (initializing) return <LoadingScreen />;

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: { iconTheme: { primary: '#ea580c', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/shop" element={<PublicLayout><ShopPage /></PublicLayout>} />
        <Route path="/categories" element={<PublicLayout><CategoriesPage /></PublicLayout>} />
        <Route path="/product/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />

        {/* Auth-only (redirect if logged in) */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Customer */}
        <Route element={<ProtectedRoute roles={['customer']} />}>
          <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
          <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
          <Route path="/orders" element={<PublicLayout><OrdersPage /></PublicLayout>} />
          <Route path="/account" element={<PublicLayout><AccountPage /></PublicLayout>} />
          <Route path="/wishlist" element={<PublicLayout><WishlistPage /></PublicLayout>} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="deliverymen" element={<AdminDeliverymenPage />} />
            <Route path="coupons" element={<AdminCouponsPage />} />
          </Route>
        </Route>

        {/* Delivery */}
        <Route element={<ProtectedRoute roles={['deliveryman']} />}>
          <Route path="/delivery" element={<DeliveryLayout />}>
            <Route index element={<DeliveryDashboard />} />
            <Route path="orders" element={<DeliveryOrdersPage />} />
            <Route path="completed" element={<DeliveryOrdersPage completed />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
