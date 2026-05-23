import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import CartSidebar from "../pages/Cart/components/CartSidebar";

const MainLayout = ({
  children,
}) => {
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

      {/* Global Cart Sidebar */}
      <CartSidebar />
    </>
  );
};

export default MainLayout;