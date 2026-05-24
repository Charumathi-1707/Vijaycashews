import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import CartSidebar from "../pages/Cart/components/CartSidebar";
import useAuth from "../hooks/useAuth";

const MainLayout = ({
  children,
}) => {
  const { user } = useAuth();
  const showCart = !user || user.role === "customer";

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Cart Sidebar for guests and customers */}
      {showCart && <CartSidebar />}
    </>
  );
};

export default MainLayout;