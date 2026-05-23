import { useState } from "react";

import {
  FaShoppingCart,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import navigation from "../../data/navigation";

import useCart from "../../hooks/useCart";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] =
    useState(false);

  const {
    cartItems,
    setCartOpen,
  } = useCart();

  const totalItems = cartItems.reduce(
    (acc, item) =>
      acc + item.quantity,
    0
  );

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-yellow-100 bg-white/90 backdrop-blur-lg">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link
          to="/"
          className="text-3xl font-bold text-yellow-800"
        >
          Vijay Cashews
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-8 md:flex">

          {navigation.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="font-medium text-gray-700 transition hover:text-yellow-700"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* CART */}
          <button
            onClick={() =>
              setCartOpen(true)
            }
            className="relative"
          >
            <FaShoppingCart className="text-2xl text-gray-700" />

            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 text-xs text-white">

                {totalItems}
              </span>
            )}
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            className="text-2xl md:hidden"
            onClick={() =>
              setMobileMenu(
                !mobileMenu
              )
            }
          >
            {mobileMenu ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="space-y-4 border-t bg-white px-6 py-6 md:hidden">

          {navigation.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="block text-lg font-medium text-gray-700"

              onClick={() =>
                setMobileMenu(false)
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;