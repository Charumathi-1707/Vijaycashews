import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaShoppingBag, 
  FaUser, 
  FaCreditCard, 
  FaCheckCircle,
  FaShieldAlt,
  FaLock,
  FaArrowLeft,
  FaTruck,
  FaClock,
  FaGift,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import useCart from "../../hooks/useCart";
import Section1 from "./components/Section1";
import Section2 from "./components/Section2";

const Checkout = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderTimeline, setOrderTimeline] = useState(null);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  // Calculate delivery timeline
  useEffect(() => {
    const today = new Date();
    const currentHour = today.getHours();
    const cutoffPassed = currentHour >= 14;
    
    const orderDate = new Date(today);
    const deliveryDate = new Date(today);
    let daysToAdd = cutoffPassed ? 4 : 3;
    deliveryDate.setDate(today.getDate() + daysToAdd);
    
    // Skip Sunday
    if (deliveryDate.getDay() === 0) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }
    
    setOrderTimeline({
      orderPlaced: orderDate.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      estimatedDelivery: deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }),
      cutoffPassed,
    });
  }, []);

  // Check if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      // Redirect to cart after a short delay
      const timer = setTimeout(() => {
        navigate("/cart");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [cartItems, navigate]);

  const steps = [
    { number: 1, title: "Cart", icon: FaShoppingBag, completed: true },
    { number: 2, title: "Checkout", icon: FaUser, completed: true },
    { number: 3, title: "Payment", icon: FaCreditCard, completed: false },
    { number: 4, title: "Confirmation", icon: FaCheckCircle, completed: false },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // If cart is empty, show empty state
  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-24 sm:px-6 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white p-12 shadow-xl"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <FaShoppingBag className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
              <p className="mt-3 text-gray-600">
                Add some delicious cashews to your cart before checking out
              </p>
              <Link
                to="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow-600 px-6 py-3 font-semibold text-white transition hover:bg-yellow-700"
              >
                <FaArrowLeft />
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                  Secure Checkout
                </h1>
                <p className="mt-2 text-gray-600">
                  Complete your purchase with confidence
                </p>
              </div>
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 rounded-full border-2 border-yellow-700 bg-white px-6 py-2 font-semibold text-yellow-700 transition-all duration-300 hover:bg-yellow-700 hover:text-white sm:px-8 sm:py-3"
              >
                <FaArrowLeft />
                Back to Cart
              </Link>
            </div>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <div className="flex items-center justify-center">
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                        step.completed
                          ? "bg-green-500 text-white"
                          : step.number === currentStep
                          ? "bg-yellow-600 text-white ring-4 ring-yellow-200"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step.completed ? (
                        <FaCheckCircle className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        step.number === currentStep
                          ? "text-yellow-700"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="mx-2 flex-1">
                      <div className="h-0.5 bg-gray-200">
                        <div
                          className={`h-0.5 transition-all duration-500 ${
                            step.completed ? "w-full bg-green-500" : "w-0"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Main Checkout Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-8 lg:grid-cols-2"
          >
            {/* Billing Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Security Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-2">
                    <FaLock className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      🔒 Secure Checkout
                    </p>
                    <p className="text-xs text-green-700">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Timeline Card */}
              {orderTimeline && (
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                    <FaClock className="text-yellow-600" />
                    Delivery Timeline
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order placed by:</span>
                      <span className="font-medium text-gray-800">
                        {orderTimeline.orderPlaced}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated delivery:</span>
                      <span className="font-semibold text-green-700">
                        {orderTimeline.estimatedDelivery}
                      </span>
                    </div>
                    {orderTimeline.cutoffPassed && (
                      <p className="mt-2 text-xs text-orange-600">
                        ⚡ Order placed after cutoff time. Will be processed tomorrow.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Billing Form */}
              <Section1 />
            </motion.div>

            {/* Order Summary Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Order Summary */}
              <Section2 />

              {/* Additional Info Cards */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowSecurityInfo(!showSecurityInfo)}
                  className="flex w-full items-center justify-between rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <FaShieldAlt className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Secure Transaction Guarantee
                    </span>
                  </div>
                  <span className="text-gray-400">
                    {showSecurityInfo ? "▲" : "▼"}
                  </span>
                </button>

                <AnimatePresence>
                  {showSecurityInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden rounded-xl bg-white p-4 text-sm text-gray-600"
                    >
                      <p>We take security seriously. Your payment information is:</p>
                      <ul className="mt-2 space-y-1 list-disc list-inside">
                        <li>Encrypted using 256-bit SSL</li>
                        <li>Never stored on our servers</li>
                        <li>Processed through PCI compliant gateways</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Gift Option */}
                <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <FaGift className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">
                      This order is a gift
                    </span>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-yellow-600 peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              </div>

              {/* Customer Support */}
              <div className="rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 p-4 text-center">
                <p className="text-sm text-gray-700">
                  Need assistance? Contact our support team
                </p>
                <div className="mt-2 flex justify-center gap-4">
                  <a
                    href="tel:+919751694905"
                    className="text-sm font-semibold text-blue-700 hover:underline"
                  >
                    📞 Call Us
                  </a>
                  <span className="text-gray-400">|</span>
                  <a
                    href="mailto:support@vijaycashews.com"
                    className="text-sm font-semibold text-blue-700 hover:underline"
                  >
                    ✉️ Email Support
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center text-xs text-gray-500"
          >
            <p>
              By completing your purchase, you agree to our{" "}
              <a href="#" className="text-yellow-700 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-yellow-700 hover:underline">
                Privacy Policy
              </a>
            </p>
            <p className="mt-2">
              <FaShieldAlt className="mx-auto mb-1 inline-block h-3 w-3" />
              All transactions are secure and encrypted
            </p>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Checkout;