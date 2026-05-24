import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingBag,
  FaArrowLeft,
  FaArrowRight,
  FaTruck,
  FaClock,
  FaGift,
  FaShieldAlt,
  FaCreditCard,
  FaWhatsapp,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import useCart from "../../../hooks/useCart";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyState from "../../../components/common/EmptyState";

const Section1 = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [deliveryEstimate, setDeliveryEstimate] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);

  // Calculate delivery estimate based on cart items
  useEffect(() => {
    if (cartItems.length > 0) {
      // Simulate delivery estimate calculation
      const today = new Date();
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + 3);
      
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      setDeliveryEstimate(formattedDate);
    }
  }, [cartItems]);

  // Load recommended products (simulated - replace with actual API call)
  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoadingRecommendations(true);
      // Simulate API call
      setTimeout(() => {
        setRecommendedProducts([
          {
            id: "rec1",
            name: "Premium Roasted Cashews",
            price: 599,
            image: "/images/roasted-cashews.jpg",
            rating: 4.8,
            reviews: 234,
          },
          {
            id: "rec2",
            name: "Honey Glazed Cashews",
            price: 649,
            image: "/images/honey-cashews.jpg",
            rating: 4.9,
            reviews: 189,
          },
          {
            id: "rec3",
            name: "Masala Cashew Gift Pack",
            price: 799,
            image: "/images/gift-pack.jpg",
            rating: 4.7,
            reviews: 456,
          },
        ]);
        setIsLoadingRecommendations(false);
      }, 800);
    };
    
    if (cartItems.length > 0) {
      loadRecommendations();
    }
  }, [cartItems.length]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const isFreeShippingEligible = subtotal >= 999;

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

  const handleWhatsAppOrder = () => {
    const message = `Hi! I'd like to place an order for:\n${cartItems.map(item => 
      `${item.quantity}x ${item.name} - ₹${item.price * item.quantity}`
    ).join('\n')}\n\nTotal: ₹${subtotal}`;
    
    window.open(`https://wa.me/919751694905?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (cartItems.length === 0) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-yellow-700 mb-8"
            >
              <FaArrowLeft />
              Back to Products
            </Link>
            
            <EmptyState
              title="Your cart is empty"
              description="Add a few premium cashew products to continue."
              actionText="Continue Shopping"
              actionLink="/products"
              icon={FaShoppingBag}
              variant="card"
              size="lg"
            />
          </motion.div>
        </div>
      </section>
    );
  }

  return (
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
                Your Cart
              </h1>
              <p className="mt-2 text-gray-600">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"} • 
                ₹{subtotal.toLocaleString()} subtotal
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-yellow-700 bg-white px-6 py-2 font-semibold text-yellow-700 transition-all duration-300 hover:bg-yellow-700 hover:text-white sm:px-8 sm:py-3"
            >
              <FaArrowLeft />
              Continue Shopping
            </Link>
          </div>
        </motion.div>

        {/* Delivery Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-4 shadow-md"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <FaTruck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {isFreeShippingEligible 
                    ? "✨ Free Shipping Available" 
                    : `Add ₹${(999 - subtotal).toLocaleString()} more for Free Shipping`}
                </p>
                <p className="text-sm text-gray-600">
                  Expected delivery by {deliveryEstimate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaClock className="h-4 w-4" />
              <span>Order within 2 hours for same-day dispatch</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 lg:grid-cols-3"
        >
          {/* Cart Items Section */}
          <div className="space-y-4 lg:col-span-2">
            {/* Cart Items Header */}
            <div className="hidden rounded-xl bg-white p-4 shadow-sm md:block">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1 text-center">Action</div>
              </div>
            </div>

            {/* Cart Items List */}
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <CartItem key={item.id} item={item} index={index} />
              ))}
            </AnimatePresence>

            {/* Order Special Instructions */}
            <motion.div variants={itemVariants} className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Special Instructions (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Any special requests? (e.g., gift wrapping, delivery instructions)"
                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
              />
              <p className="mt-2 text-xs text-gray-500">
                We'll do our best to accommodate your requests
              </p>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <CartSummary />

            {/* WhatsApp Order Option */}
            <motion.div variants={itemVariants} className="mt-4">
              <button
                onClick={handleWhatsAppOrder}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-500 bg-white px-4 py-3 font-semibold text-green-600 transition-all hover:bg-green-50"
              >
                <FaWhatsapp className="h-5 w-5" />
                Place Order on WhatsApp
              </button>
              <p className="mt-2 text-center text-xs text-gray-500">
                Quick & easy checkout via WhatsApp
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Recommended Products Section */}
        {cartItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  You May Also Like
                </h2>
                <p className="text-sm text-gray-600">
                  Complete your order with these popular items
                </p>
              </div>
              <Link
                to="/products"
                className="flex items-center gap-1 text-sm font-semibold text-yellow-700 transition-colors hover:text-yellow-800"
              >
                View All
                <FaArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {isLoadingRecommendations ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-200 border-t-yellow-600"></div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="group cursor-pointer rounded-2xl bg-white p-4 shadow-md transition-all duration-300 hover:shadow-xl"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200?text=Cashews";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                    </div>
                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-800 group-hover:text-yellow-700">
                        {product.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => {
                            const starValue = i + 1;
                            if (starValue <= Math.floor(product.rating)) {
                              return <FaStar key={i} className="h-3 w-3 text-yellow-500" />;
                            } else if (starValue === Math.ceil(product.rating) && product.rating % 1 !== 0) {
                              return <FaStarHalfAlt key={i} className="h-3 w-3 text-yellow-500" />;
                            } else {
                              return <FaStar key={i} className="h-3 w-3 text-gray-300" />;
                            }
                          })}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({product.reviews})
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xl font-bold text-yellow-700">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <button className="rounded-full bg-yellow-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-yellow-700">
                          Add
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-6 border-t border-gray-200 pt-8"
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaShieldAlt className="h-5 w-5 text-green-600" />
            <span>Secure Checkout</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaCreditCard className="h-5 w-5 text-blue-600" />
            <span>100% Payment Protection</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaGift className="h-5 w-5 text-yellow-600" />
            <span>Free Gift Wrap Available</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Section1;