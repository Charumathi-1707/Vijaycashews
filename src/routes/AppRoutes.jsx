import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "../components/common/ScrollToTop";

import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/Products/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Testimonials from "../pages/Testimonials/Testimonials";
import Success from "../pages/Success/Success";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import MyOrders from "../pages/User/MyOrders";
import Wishlist from "../pages/User/Wishlist";
import Profile from "../pages/User/Profile";
import DeliveryDashboard from "../pages/Delivery/DeliveryDashboard";
import AdminOrders from "../pages/Admin/AdminOrders";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoute from "../components/common/ProtectedRoute";
import useAuth from "../hooks/useAuth";

const AppRoutes = () => {
  const { user } = useAuth();

  const GuestHome = () => {
    return user ? <Navigate to="/products" replace /> : <Home />;
  };
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<GuestHome />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<ProtectedRoute>{<Cart />}</ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute>{<Checkout />}</ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/login" element={<ProtectedRoute guestOnly>{<Login />}</ProtectedRoute>} />
        <Route path="/register" element={<ProtectedRoute guestOnly>{<Register />}</ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute>{<Profile />}</ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute>{<MyOrders />}</ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute>{<Wishlist />}</ProtectedRoute>} />
        <Route path="/delivery" element={<ProtectedRoute allowRoles={["delivery"]}>{<DeliveryDashboard />}</ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute allowRoles={["admin"]}>{<AdminOrders />}</ProtectedRoute>} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/success" element={<Success />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;