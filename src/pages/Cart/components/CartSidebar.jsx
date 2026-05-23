import { useState } from "react";

import {
  FaShoppingCart,
  FaTimes,
} from "react-icons/fa";

import useCart from "../../../hooks/useCart";

import CartItem from "./CartItem";
import CheckoutModal from "./CheckoutModal";

const CartSidebar = () => {
  const {
    cartItems,
    cartOpen,
    setCartOpen,
  } = useCart();

  const [checkoutOpen, setCheckoutOpen] =
    useState(false);

  const total = cartItems.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-8 right-8 z-40 rounded-full bg-yellow-700 p-5 text-white shadow-2xl transition hover:scale-110"
      >
        <FaShoppingCart className="text-2xl" />

        {cartItems.length > 0 && (
          <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 text-xs text-white">
            {cartItems.length}
          </span>
        )}
      </button>

      {/* Overlay */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          className="fixed inset-0 z-40 bg-black/50"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300
        
        ${
          cartOpen
            ? "translate-x-0"
            : "translate-x-full"
        }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-bold">
            Shopping Cart
          </h2>

          <button
            onClick={() => setCartOpen(false)}
            className="rounded-full bg-gray-100 p-3 transition hover:bg-red-500 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        {/* Cart Items */}
        <div className="h-[70vh] overflow-y-auto p-6">

          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">

              <FaShoppingCart className="text-6xl text-gray-300" />

              <p className="mt-4 text-gray-500">
                Your cart is empty
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-6">

            <div className="mb-5 flex items-center justify-between text-xl font-bold">

              <span>Total</span>

              <span>₹{total}</span>
            </div>

            <button
              onClick={() =>
                setCheckoutOpen(true)
              }
              className="w-full rounded-full bg-yellow-700 py-4 font-semibold text-white transition hover:bg-yellow-800"
            >
              Proceed To Checkout
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {checkoutOpen && (
        <CheckoutModal
          closeModal={() =>
            setCheckoutOpen(false)
          }
        />
      )}
    </>
  );
};

export default CartSidebar;