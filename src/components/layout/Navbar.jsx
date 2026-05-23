import { useState } from "react";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

import navigation from "../../data/navigation";
import useCart from "../../hooks/useCart";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  const {
    cartItems,
    setCartOpen,
  } = useCart();

  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-yellow-100 bg-white/90 backdrop-blur-lg">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <h1 className="text-3xl font-bold text-yellow-800">
          Vijay Cashews
        </h1>

        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-medium text-gray-700 transition hover:text-yellow-700"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">

          <button
            onClick={() => setCartOpen(true)}
            className="relative"
          >
            <FaShoppingCart className="text-2xl text-gray-700" />

            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 text-xs text-white">
                {totalItems}
              </span>
            )}
          </button>

          <button
            className="text-2xl md:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="space-y-4 border-t bg-white px-6 py-6 md:hidden">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block text-lg font-medium"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;