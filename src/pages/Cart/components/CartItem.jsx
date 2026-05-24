import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaSpinner,
  FaHeart,
  FaRegHeart,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import useCart from "../../../hooks/useCart";
import useWishlist from "../../../hooks/useWishlist";

const CartItem = ({ item, index }) => {
  const {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
  
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState("");

  const maxQuantity = 99;
  const minQuantity = 1;
  const isMaxReached = item.quantity >= maxQuantity;
  const isMinReached = item.quantity <= minQuantity;
  const inWishlist = isInWishlist(item.id);

  const showMessage = (message) => {
    setTooltipMessage(message);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  const handleIncrease = async () => {
    if (isMaxReached) {
      showMessage(`Maximum ${maxQuantity} items per order`);
      return;
    }
    setIsUpdating(true);
    await increaseQuantity(item.id);
    setIsUpdating(false);
  };

  const handleDecrease = async () => {
    if (isMinReached) {
      showMessage("Minimum quantity is 1");
      return;
    }
    setIsUpdating(true);
    await decreaseQuantity(item.id);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    await removeFromCart(item.id);
    // Component will unmount after this
  };

  const handleToggleWishlist = async () => {
    if (inWishlist) {
      await removeFromWishlist(item.id);
      showMessage("Removed from wishlist");
    } else {
      await addToWishlist(item);
      showMessage("Added to wishlist");
    }
  };

  const itemTotal = item.price * item.quantity;
  const isLowStock = item.stock && item.stock <= 10;
  const isOutOfStock = item.stock === 0;

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: index * 0.05,
      }
    },
    exit: {
      opacity: 0,
      x: 50,
      transition: { duration: 0.3 }
    },
    updating: {
      scale: [1, 1.02, 1],
      transition: { duration: 0.3 }
    }
  };

  if (isRemoving) {
    return (
      <motion.div
        layout
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={itemVariants}
        className="flex items-center justify-center rounded-2xl bg-gray-50 p-8"
      >
        <FaSpinner className="h-6 w-6 animate-spin text-yellow-600" />
        <span className="ml-3 text-gray-600">Removing item...</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
      className="group relative rounded-2xl bg-white p-4 shadow-md transition-all duration-300 hover:shadow-xl sm:p-5"
    >
      {/* Stock Warning Badge */}
      {isLowStock && !isOutOfStock && (
        <div className="absolute -top-2 -right-2 z-10 rounded-full bg-orange-500 px-2 py-1 text-xs font-semibold text-white shadow-lg">
          Only {item.stock} left!
        </div>
      )}
      {isOutOfStock && (
        <div className="absolute -top-2 -right-2 z-10 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white shadow-lg">
          Out of Stock
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
        {/* Product Image */}
        <Link to={`/products/${item.id}`} className="group block flex-shrink-0">
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={item.image}
              alt={item.name}
              className="h-28 w-28 object-cover transition-transform duration-300 group-hover:scale-110 sm:h-32 sm:w-32"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-2">
            {/* Title and Category */}
            <div>
              <Link to={`/products/${item.id}`} className="group">
                <h3 className="text-base font-bold text-gray-800 transition-colors group-hover:text-yellow-700 sm:text-lg">
                  {item.name}
                </h3>
              </Link>
              {item.category && (
                <p className="text-xs text-gray-500">{item.category}</p>
              )}
            </div>

            {/* Price and Savings */}
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-yellow-700 sm:text-2xl">
                ₹{item.price.toLocaleString()}
              </p>
              {item.originalPrice && item.originalPrice > item.price && (
                <>
                  <p className="text-sm text-gray-400 line-through">
                    ₹{item.originalPrice.toLocaleString()}
                  </p>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                    {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Free Shipping Indicator */}
            {itemTotal >= 499 && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <FaTruck className="h-3 w-3" />
                <span>Free Shipping eligible</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleDecrease}
                disabled={isUpdating || isMinReached}
                className={`rounded-full p-2 transition-all duration-200 ${
                  isMinReached
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : "bg-gray-100 text-gray-700 hover:bg-yellow-700 hover:text-white"
                }`}
                aria-label="Decrease quantity"
              >
                <FaMinus className="h-3 w-3 sm:h-4 sm:w-4" />
              </motion.button>

              <motion.span
                key={item.quantity}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="min-w-[40px] text-center text-base font-semibold text-gray-800 sm:text-lg"
              >
                {item.quantity}
              </motion.span>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleIncrease}
                disabled={isUpdating || isMaxReached || isOutOfStock}
                className={`rounded-full p-2 transition-all duration-200 ${
                  isMaxReached || isOutOfStock
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : "bg-gray-100 text-gray-700 hover:bg-yellow-700 hover:text-white"
                }`}
                aria-label="Increase quantity"
              >
                <FaPlus className="h-3 w-3 sm:h-4 sm:w-4" />
              </motion.button>

              {isUpdating && (
                <FaSpinner className="h-4 w-4 animate-spin text-yellow-600" />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Wishlist Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleWishlist}
                className="rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {inWishlist ? (
                  <FaHeart className="h-4 w-4 text-red-500" />
                ) : (
                  <FaRegHeart className="h-4 w-4" />
                )}
              </motion.button>

              {/* Remove Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleRemove}
                className="rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                aria-label="Remove item"
              >
                <FaTrash className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          {/* Item Total */}
          <div className="mt-3 text-right">
            <p className="text-xs text-gray-500">Item Total</p>
            <p className="text-lg font-bold text-gray-900">
              ₹{itemTotal.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tooltip Message */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-12 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-white shadow-lg"
          >
            {tooltipMessage}
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CartItem;