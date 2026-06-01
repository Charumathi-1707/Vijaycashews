import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTruck,
  FaClock,
  FaShieldAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaGift,
  FaLeaf,
  FaQuestionCircle,
  FaCheckCircle,
  FaInfoCircle,
  FaPercent,
  FaRupeeSign,
} from "react-icons/fa";
import CartSummary from "../../Cart/components/CartSummary";
import useCart from "../../../hooks/useCart";

const Section2 = () => {
  const { cartItems } = useCart();
  const [showDeliveryInfo, setShowDeliveryInfo] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [cutoffTimePassed, setCutoffTimePassed] = useState(false);

  // Calculate totals from cart
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  const deliveryCharge = subtotal > 999 ? 0 : 99;
  const isFreeShipping = subtotal >= 999;
  const amountForFreeShipping = Math.max(0, 999 - subtotal);

  // Calculate delivery estimate
  useEffect(() => {
    const today = new Date();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    
    // Check if cutoff time (2 PM) has passed for same-day dispatch
    const cutoffPassed = currentHour > 14 || (currentHour === 14 && currentMinute > 0);
    setCutoffTimePassed(cutoffPassed);
    
    // Calculate estimated delivery date
    const deliveryDateObj = new Date(today);
    let daysToAdd = cutoffPassed ? 4 : 3;
    deliveryDateObj.setDate(today.getDate() + daysToAdd);
    
    // Skip Sunday
    if (deliveryDateObj.getDay() === 0) {
      deliveryDateObj.setDate(deliveryDateObj.getDate() + 1);
    }
    
    const formattedDate = deliveryDateObj.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    
    setDeliveryDate(formattedDate);
  }, [cartItems]);

  const getDeliveryMessage = () => {
    if (cutoffTimePassed) {
      return "Order now for delivery after estimated date";
    }
    return "Order within 2 hours for same-day dispatch";
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
        className="rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 shadow-md"
      >
        <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
        <div className="mt-6 text-center py-8">
          <FaInfoCircle className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-3 text-gray-500">No items in cart</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="sticky top-24"
    >
      {/* Main Order Summary Card */}
      <div className="rounded-3xl bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-50 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
        
        {/* Header */}
        <motion.div variants={itemVariants} className="border-b border-yellow-200 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
            <div className="rounded-full bg-yellow-200 px-3 py-1">
              <span className="text-xs font-semibold text-yellow-800">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Free Shipping Progress */}
        <motion.div variants={itemVariants} className="mt-5">
          {!isFreeShipping ? (
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-700">Add ₹{amountForFreeShipping.toLocaleString()} more for</span>
                <span className="font-semibold text-green-600">Free Shipping!</span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((999 - amountForFreeShipping) / 999) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-green-500 to-green-600"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Free shipping on orders over ₹999
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-green-100 p-3">
              <FaCheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">
                🎉 Congratulations! You've unlocked Free Shipping
              </span>
            </div>
          )}
        </motion.div>

        {/* Cart Summary Component */}
        <motion.div variants={itemVariants} className="mt-5">
          <CartSummary />
        </motion.div>

        {/* Delivery Information Section */}
        <motion.div variants={itemVariants} className="mt-6">
          <button
            onClick={() => setShowDeliveryInfo(!showDeliveryInfo)}
            className="flex w-full items-center justify-between rounded-xl bg-white p-4 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <FaTruck className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Delivery Information</p>
                <p className="text-xs text-gray-500">{getDeliveryMessage()}</p>
              </div>
            </div>
            <FaInfoCircle className="text-gray-400" />
          </button>

          <AnimatePresence>
            {showDeliveryInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden rounded-xl bg-white p-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FaClock className="mt-0.5 h-4 w-4 text-yellow-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Estimated Delivery</p>
                      <p className="text-sm text-gray-600">{deliveryDate}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {cutoffTimePassed 
                          ? "Order will be processed tomorrow" 
                          : "Order before 2 PM for same-day processing"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaShieldAlt className="mt-0.5 h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Safe & Secure Delivery</p>
                      <p className="text-xs text-gray-500">
                        Your package will be handled with care and delivered safely
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Payment Methods Accepted */}
        <motion.div variants={itemVariants} className="mt-5">
          <div className="rounded-xl bg-white p-4">
            <p className="mb-3 text-sm font-semibold text-gray-700">We Accept:</p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5">
                <FaCreditCard className="text-blue-600" />
                <span className="text-xs">Card</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5">
                <FaMoneyBillWave className="text-green-600" />
                <span className="text-xs">COD</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5">
                <img src="/images/upi-icon.svg" alt="UPI" className="h-4 w-4" />
                <span className="text-xs">UPI</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5">
                <FaPercent className="text-purple-600" />
                <span className="text-xs">Wallets</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Eco-Friendly Note */}
        <motion.div variants={itemVariants} className="mt-5">
          <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 p-3">
            <FaLeaf className="h-4 w-4 text-green-600" />
            <p className="text-xs text-green-700">
              Eco-friendly packaging used for all orders
            </p>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div variants={itemVariants} className="mt-5 text-center">
          <button className="inline-flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-yellow-700">
            <FaQuestionCircle className="h-3 w-3" />
            Need help with your order?
          </button>
        </motion.div>

        {/* Trust Badge */}
        <motion.div variants={itemVariants} className="mt-4 flex items-center justify-center gap-2 border-t border-yellow-200 pt-4">
          <div className="flex items-center gap-1">
            <FaShieldAlt className="h-3 w-3 text-green-600" />
            <span className="text-xs text-gray-500">Secure Checkout</span>
          </div>
          <div className="h-3 w-px bg-gray-300"></div>
          <div className="flex items-center gap-1">
            <FaCheckCircle className="h-3 w-3 text-green-600" />
            <span className="text-xs text-gray-500">Quality Guaranteed</span>
          </div>
          <div className="h-3 w-px bg-gray-300"></div>
          <div className="flex items-center gap-1">
            <FaRupeeSign className="h-3 w-3 text-green-600" />
            <span className="text-xs text-gray-500">Best Price</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Section2;