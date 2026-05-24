import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTruck,
  FaShieldAlt,
  FaGift,
  FaLeaf,
  FaRupeeSign,
  FaCheckCircle,
  FaArrowRight,
  FaPercent,
  FaShoppingBag,
} from "react-icons/fa";
import useCart from "../../../hooks/useCart";

const CartSummary = () => {
  const { cartItems } = useCart();

  const [showSavings, setShowSavings] = useState(false);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  // Calculate totals with more detailed breakdown
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  // Shipping logic - free over ₹999
  const shipping = subtotal > 999 ? 0 : 99;
  const shippingSaved = subtotal > 999 ? 99 : 0;
  
  // Tax calculation (GST 5%)
  const gst = subtotal * 0.05;
  
  // Platform fee
  const platformFee = subtotal > 0 ? 10 : 0;
  
  // Calculate potential savings (if items have original prices)
  const totalSavings = cartItems.reduce((acc, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return acc + (item.originalPrice - item.price) * item.quantity;
    }
    return acc;
  }, 0);
  
  // Final total
  const total = subtotal + shipping + gst + platformFee;
  
  // Free shipping progress
  const freeShippingThreshold = 999;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const isFreeShippingEligible = subtotal >= freeShippingThreshold;
  
  // Animate total on mount or when subtotal changes
  useEffect(() => {
    let start = 0;
    const duration = 800;
    const increment = total / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= total) {
        setAnimatedTotal(total);
        clearInterval(timer);
      } else {
        setAnimatedTotal(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [total]);
  
  // Show savings notification when savings exist
  useEffect(() => {
    if (totalSavings > 0) {
      setShowSavings(true);
      const timer = setTimeout(() => setShowSavings(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [totalSavings]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 text-center shadow-md"
      >
        <FaShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-3 text-xl font-semibold text-gray-700">Cart is Empty</h3>
        <p className="mt-2 text-sm text-gray-500">
          Add items to see order summary
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative rounded-3xl bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-50 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl"
    >
      {/* Savings Alert Badge */}
      <AnimatePresence>
        {showSavings && totalSavings > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg"
          >
            🎉 You saved ₹{totalSavings.toLocaleString()}!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between border-b border-yellow-200 pb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Order Summary</h3>
          <p className="text-sm text-gray-600">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="rounded-full bg-yellow-200 px-3 py-1">
          <span className="text-xs font-semibold text-yellow-800">
            {cartItems.length} Products
          </span>
        </div>
      </motion.div>

      {/* Free Shipping Progress Bar */}
      {!isFreeShippingEligible && (
        <motion.div variants={itemVariants} className="mt-4 rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-700">Add ₹{amountForFreeShipping.toLocaleString()} more for</span>
            <span className="font-semibold text-green-600">Free Shipping!</span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-gray-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${shippingProgress}%` }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-green-500 to-green-600"
            />
            <motion.div
              initial={{ left: "0%" }}
              animate={{ left: `${shippingProgress}%` }}
              className="absolute -top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-green-600 bg-white"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            *Free shipping on orders over ₹{freeShippingThreshold}
          </p>
        </motion.div>
      )}

      {/* Price Breakdown */}
      <motion.div variants={itemVariants} className="mt-6 space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-700">
          <span className="flex items-center gap-2">
            <FaShoppingBag className="h-4 w-4 text-yellow-600" />
            Subtotal
          </span>
          <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
        </div>

        {/* Total Savings (if any) */}
        {totalSavings > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-2">
              <FaPercent className="h-4 w-4" />
              Total Savings
            </span>
            <span className="font-semibold">-₹{totalSavings.toLocaleString()}</span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex justify-between text-gray-700">
          <span className="flex items-center gap-2">
            <FaTruck className="h-4 w-4 text-yellow-600" />
            Shipping
          </span>
          <span className="font-semibold">
            {shipping === 0 ? (
              <span className="flex items-center gap-1 text-green-600">
                <FaCheckCircle className="h-3 w-3" />
                Free
              </span>
            ) : (
              `₹${shipping}`
            )}
          </span>
        </div>

        {/* GST */}
        <div className="flex justify-between text-gray-700">
          <span className="flex items-center gap-2">
            <FaRupeeSign className="h-4 w-4 text-yellow-600" />
            GST (5%)
          </span>
          <span className="font-semibold">₹{gst.toLocaleString()}</span>
        </div>

        {/* Platform Fee */}
        {platformFee > 0 && (
          <div className="flex justify-between text-gray-700">
            <span className="flex items-center gap-2">
              <FaShieldAlt className="h-4 w-4 text-yellow-600" />
              Platform Fee
            </span>
            <span className="font-semibold">₹{platformFee}</span>
          </div>
        )}
      </motion.div>

      {/* Divider with animation */}
      <motion.div variants={itemVariants} className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dashed border-yellow-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gradient-to-r from-yellow-50 to-amber-50 px-2 text-xs text-gray-400">
            Total Amount
          </span>
        </div>
      </motion.div>

      {/* Total Amount with Animation */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between pb-4 text-2xl font-bold"
      >
        <span className="text-gray-800">Total</span>
        <motion.span
          key={animatedTotal}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-yellow-700 to-yellow-800 bg-clip-text text-transparent"
        >
          ₹{animatedTotal.toLocaleString()}
        </motion.span>
      </motion.div>

      {/* Additional Info Cards */}
      <motion.div variants={itemVariants} className="mt-4 space-y-2">
        {/* Eco-friendly badge */}
        <div className="flex items-center gap-2 rounded-xl bg-white/60 p-3 text-xs text-gray-600">
          <FaLeaf className="h-4 w-4 text-green-600" />
          <span>Eco-friendly packaging used for all orders</span>
        </div>

        {/* Gift option */}
        <div className="flex items-center justify-between rounded-xl bg-white/60 p-3">
          <div className="flex items-center gap-2">
            <FaGift className="h-4 w-4 text-yellow-600" />
            <span className="text-xs text-gray-600">Gift wrap available</span>
          </div>
          <button className="text-xs font-semibold text-yellow-700 transition hover:text-yellow-800">
            Add +
          </button>
        </div>
      </motion.div>

      {/* Order Benefits */}
      <motion.div variants={itemVariants} className="mt-4 rounded-xl bg-white p-3 shadow-sm">
        <p className="mb-2 text-xs font-semibold text-gray-700">Order Benefits:</p>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <FaCheckCircle className="h-3 w-3 text-green-500" />
            <span>30-day return policy</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCheckCircle className="h-3 w-3 text-green-500" />
            <span>Quality guaranteed</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCheckCircle className="h-3 w-3 text-green-500" />
            <span>Secure checkout</span>
          </div>
        </div>
      </motion.div>

      {/* Checkout Button with Animation */}
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-700 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
      >
        <span>Proceed to Checkout</span>
        <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
      </motion.button>

      {/* Payment Methods */}
      <motion.div variants={itemVariants} className="mt-4">
        <p className="mb-2 text-center text-xs text-gray-500">Secure payment methods</p>
        <div className="flex justify-center gap-3 opacity-60">
          <img src="/images/visa.svg" alt="Visa" className="h-6" />
          <img src="/images/mastercard.svg" alt="Mastercard" className="h-6" />
          <img src="/images/rupay.svg" alt="RuPay" className="h-6" />
          <img src="/images/upi.svg" alt="UPI" className="h-6" />
          <img src="/images/paytm.svg" alt="Paytm" className="h-6" />
        </div>
      </motion.div>

      {/* Shipping Info Tooltip */}
      <motion.div variants={itemVariants} className="mt-3 text-center">
        <p className="text-xs text-gray-400">
          Delivery charges may apply based on location
        </p>
      </motion.div>
    </motion.div>
  );
};

export default CartSummary;