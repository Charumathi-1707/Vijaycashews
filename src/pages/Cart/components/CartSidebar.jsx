import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaTimes,
  FaTrash,
  FaTag,
  FaRupeeSign,
  FaTruck,
  FaGift,
  FaShieldAlt,
  FaCreditCard,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa";
import useCart from "../../../hooks/useCart";
import CartItem from "./CartItem";
import CheckoutModal from "./CheckoutModal";

const CartSidebar = () => {
  const {
    cartItems,
    cartOpen,
    setCartOpen,
    clearCart,
  } = useCart();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const sidebarRef = useRef(null);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  const shipping = subtotal > 0 && subtotal < 499 ? 49 : subtotal >= 499 ? 0 : 0;
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + shipping + tax - discount;
  
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isFreeShipping = subtotal >= 499;
  const shippingProgress = Math.min((subtotal / 499) * 100, 100);
  const amountNeededForFreeShipping = 499 - subtotal;

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && cartOpen) {
        setCartOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [cartOpen, setCartOpen]);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to remove all items from your cart?")) {
      setIsClearing(true);
      await clearCart();
      setIsClearing(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");

    // Simulate coupon validation (replace with actual API call)
    setTimeout(() => {
      const validCoupons = {
        "SAVE10": { discount: subtotal * 0.1, message: "10% off applied!" },
        "SAVE20": { discount: subtotal * 0.2, message: "20% off applied!" },
        "FREESHIP": { discount: shipping, message: "Free shipping applied!" },
        "WELCOME50": { discount: 50, message: "₹50 off applied!" },
      };

      const coupon = validCoupons[couponCode.toUpperCase()];
      if (coupon) {
        setDiscount(coupon.discount);
        setAppliedCoupon({ code: couponCode.toUpperCase(), discount: coupon.discount });
        setCouponError("");
        setShowCouponInput(false);
      } else {
        setCouponError("Invalid coupon code");
        setDiscount(0);
        setAppliedCoupon(null);
      }
      setIsApplyingCoupon(false);
      setCouponCode("");
    }, 800);
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponError("");
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  // Animation variants
  const sidebarVariants = {
    hidden: { x: "100%" },
    visible: { 
      x: 0,
      transition: { type: "spring", damping: 25, stiffness: 200 }
    },
    exit: { 
      x: "100%",
      transition: { duration: 0.3 }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <>
      {/* Floating Cart Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCartOpen(true)}
        className="fixed bottom-8 right-8 z-40 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-700 p-5 text-white shadow-2xl transition-all hover:shadow-3xl"
      >
        <FaShoppingCart className="text-2xl" />
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white shadow-lg"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </motion.span>
        )}
      </motion.button>

      {/* Backdrop Overlay */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            ref={sidebarRef}
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-white p-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Shopping Cart
                </h2>
                <p className="text-sm text-gray-500">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="flex gap-2">
                {cartItems.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    disabled={isClearing}
                    className="rounded-full bg-gray-100 p-3 text-gray-600 transition-all hover:bg-red-500 hover:text-white disabled:opacity-50"
                  >
                    {isClearing ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                  </button>
                )}
                <button
                  onClick={() => setCartOpen(false)}
                  className="rounded-full bg-gray-100 p-3 text-gray-600 transition-all hover:bg-gray-200"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Free Shipping Progress Bar */}
            {cartItems.length > 0 && !isFreeShipping && (
              <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-700">Add ₹{amountNeededForFreeShipping} more for</span>
                  <span className="font-semibold text-green-600">Free Shipping!</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    className="h-full bg-gradient-to-r from-green-500 to-green-600"
                  />
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex h-full flex-col items-center justify-center text-center"
                >
                  <div className="rounded-full bg-gray-100 p-8">
                    <FaShoppingCart className="text-5xl text-gray-400" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-800">
                    Your cart is empty
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Looks like you haven't added any items yet
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-6 rounded-full bg-yellow-600 px-6 py-2 text-white transition hover:bg-yellow-700"
                  >
                    Continue Shopping
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <CartItem key={item.id} item={item} index={index} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer - Order Summary */}
            {cartItems.length > 0 && (
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="border-t border-gray-200 bg-white p-5 shadow-lg"
              >
                {/* Coupon Section */}
                <div className="mb-4">
                  {!showCouponInput && !appliedCoupon ? (
                    <button
                      onClick={() => setShowCouponInput(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-yellow-300 bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-700 transition-all hover:bg-yellow-100"
                    >
                      <FaTag />
                      Apply Coupon Code
                    </button>
                  ) : showCouponInput && !appliedCoupon ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                          onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon}
                          className="rounded-full bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-700 disabled:opacity-50"
                        >
                          {isApplyingCoupon ? <FaSpinner className="animate-spin" /> : "Apply"}
                        </button>
                        <button
                          onClick={() => setShowCouponInput(false)}
                          className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-xs text-red-500">{couponError}</p>
                      )}
                    </div>
                  ) : appliedCoupon && (
                    <div className="flex items-center justify-between rounded-xl bg-green-50 p-3">
                      <div className="flex items-center gap-2">
                        <FaTag className="text-green-600" />
                        <div>
                          <span className="font-semibold text-green-700">
                            {appliedCoupon.code}
                          </span>
                          <p className="text-xs text-green-600">
                            Saved ₹{appliedCoupon.discount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 border-b border-gray-100 pb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>GST (5%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="mb-4 flex items-center justify-between pt-4 text-xl font-bold">
                  <span>Total</span>
                  <span className="text-yellow-700">₹{total.toLocaleString()}</span>
                </div>

                {/* Trust Badges */}
                <div className="mb-4 flex justify-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <FaShieldAlt className="h-3 w-3" />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCreditCard className="h-3 w-3" />
                    <span>100% Payment Protection</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-700 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                >
                  <span>Proceed to Checkout</span>
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>

                {/* Payment Methods */}
                <div className="mt-4 flex justify-center gap-2 opacity-50">
                  <img src="/images/visa.svg" alt="Visa" className="h-6" />
                  <img src="/images/mastercard.svg" alt="Mastercard" className="h-6" />
                  <img src="/images/upi.svg" alt="UPI" className="h-6" />
                  <img src="/images/paytm.svg" alt="Paytm" className="h-6" />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      {checkoutOpen && (
        <CheckoutModal
          closeModal={() => setCheckoutOpen(false)}
          cartTotal={total}
          cartItems={cartItems}
        />
      )}
    </>
  );
};

export default CartSidebar;