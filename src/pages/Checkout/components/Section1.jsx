import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaCode,
  FaCreditCard,
  FaGooglePay,
  FaPaypal,
  FaAmazonPay,
  FaShieldAlt,
  FaSpinner,
  FaCheckCircle,
  FaArrowRight,
  FaTruck,
  FaClock,
} from "react-icons/fa";
import useCart from "../../../hooks/useCart";
import {
  saveOrder,
} from "../../../services/write/order.service";
import generateOrderId from "../../../utils/generateOrderId";

const Section1 = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    landmark: "",
    state: "",
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  const deliveryCharge = subtotal > 999 ? 0 : 99;
  const gst = subtotal * 0.05;
  const platformFee = 10;
  const total = subtotal + deliveryCharge + gst + platformFee;
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Validate pincode format
  const validatePincode = (pincode) => {
    return /^[1-9][0-9]{5}$/.test(pincode);
  };

  // Validate phone number
  const validatePhone = (phone) => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  // Validate email
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Field validators
  const validators = {
    name: (value) => value.trim().length >= 3 || "Name must be at least 3 characters",
    email: (value) => !value || validateEmail(value) || "Enter a valid email address",
    phone: (value) => validatePhone(value) || "Enter a valid 10-digit phone number",
    address: (value) => value.trim().length >= 10 || "Address must be at least 10 characters",
    city: (value) => value.trim().length >= 2 || "Enter a valid city name",
    pincode: (value) => validatePincode(value) || "Enter a valid 6-digit pincode",
    landmark: () => null,
    state: () => null,
  };

  const validateField = (name, value) => {
    const validator = validators[name];
    if (validator && touched[name]) {
      const error = validator(value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    let isValid = true;
    const newErrors = {};
    
    Object.keys(validators).forEach(key => {
      const validator = validators[key];
      if (validator && formData[key] !== undefined) {
        const error = validator(formData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });

    // Check required fields
    const requiredFields = ["name", "phone", "address", "city", "pincode"];
    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      }
    });

    if (!acceptTerms) {
      alert("Please accept the terms and conditions");
      return;
    }

    if (!isValid) {
      setErrors(newErrors);
      alert("Please fix the errors before continuing");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const orderId = generateOrderId();

      const orderData = {
        orderId,
        date: new Date().toLocaleString(),
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        email: formData.email || "N/A",
        landmark: formData.landmark || "",
        state: formData.state || "",
        products: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        productSummary: cartItems
          .map((item) => `${item.name} x${item.quantity}`)
          .join(", "),
        subtotal,
        delivery: deliveryCharge,
        gst,
        platformFee,
        total,
        paymentMethod,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      console.log("ORDER DATA:", orderData);

      await saveOrder(orderData);
      clearCart();
      navigate("/success", { state: { orderId, total, paymentMethod } });
    } catch (error) {
      console.error(error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.name.trim().length >= 3 &&
      validatePhone(formData.phone) &&
      formData.address.trim().length >= 10 &&
      formData.city.trim().length >= 2 &&
      validatePincode(formData.pincode) &&
      acceptTerms
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative overflow-hidden rounded-3xl bg-white shadow-xl"
    >
      {/* Header */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-white p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-yellow-100 p-2">
            <FaUser className="h-5 w-5 text-yellow-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Billing Details</h2>
            <p className="text-sm text-gray-600">
              Complete your order by providing the following information
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-5">
          {/* Full Name */}
          <motion.div variants={itemVariants}>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className={`relative transition-all duration-200 ${focusedField === "name" ? "scale-[1.02]" : ""}`}>
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={() => handleFocus("name")}
                placeholder="Enter your full name"
                className={`w-full rounded-2xl border py-3 pl-11 pr-4 outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 ${
                  errors.name && touched.name ? "border-red-500 bg-red-50" : "border-gray-200"
                }`}
                required
              />
            </div>
            {errors.name && touched.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants}>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email Address <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className={`relative transition-all duration-200 ${focusedField === "email" ? "scale-[1.02]" : ""}`}>
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={() => handleFocus("email")}
                placeholder="your@email.com"
                className={`w-full rounded-2xl border py-3 pl-11 pr-4 outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 ${
                  errors.email && touched.email ? "border-red-500 bg-red-50" : "border-gray-200"
                }`}
              />
            </div>
            {errors.email && touched.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </motion.div>

          {/* Phone */}
          <motion.div variants={itemVariants}>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className={`relative transition-all duration-200 ${focusedField === "phone" ? "scale-[1.02]" : ""}`}>
              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={() => handleFocus("phone")}
                placeholder="10-digit mobile number"
                className={`w-full rounded-2xl border py-3 pl-11 pr-4 outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 ${
                  errors.phone && touched.phone ? "border-red-500 bg-red-50" : "border-gray-200"
                }`}
                required
              />
            </div>
            {errors.phone && touched.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </motion.div>

          {/* Address */}
          <motion.div variants={itemVariants}>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Delivery Address <span className="text-red-500">*</span>
            </label>
            <div className={`relative transition-all duration-200 ${focusedField === "address" ? "scale-[1.02]" : ""}`}>
              <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-400" />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={() => handleFocus("address")}
                placeholder="House number, street, area"
                rows="4"
                className={`w-full rounded-2xl border py-3 pl-11 pr-4 outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 ${
                  errors.address && touched.address ? "border-red-500 bg-red-50" : "border-gray-200"
                }`}
                required
              />
            </div>
            {errors.address && touched.address && (
              <p className="mt-1 text-xs text-red-500">{errors.address}</p>
            )}
          </motion.div>

          {/* Landmark (Optional) */}
          <motion.div variants={itemVariants}>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Landmark <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="Near some landmark"
              className="w-full rounded-2xl border border-gray-200 py-3 px-4 outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
            />
          </motion.div>

          {/* City and Pincode Row */}
          <div className="grid gap-5 sm:grid-cols-2">
            <motion.div variants={itemVariants}>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <div className={`relative transition-all duration-200 ${focusedField === "city" ? "scale-[1.02]" : ""}`}>
                <FaCity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() => handleFocus("city")}
                  placeholder="City name"
                  className={`w-full rounded-2xl border py-3 pl-11 pr-4 outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 ${
                    errors.city && touched.city ? "border-red-500 bg-red-50" : "border-gray-200"
                  }`}
                  required
                />
              </div>
              {errors.city && touched.city && (
                <p className="mt-1 text-xs text-red-500">{errors.city}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Pincode <span className="text-red-500">*</span>
              </label>
              <div className={`relative transition-all duration-200 ${focusedField === "pincode" ? "scale-[1.02]" : ""}`}>
                <FaCode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() => handleFocus("pincode")}
                  placeholder="6-digit pincode"
                  maxLength="6"
                  className={`w-full rounded-2xl border py-3 pl-11 pr-4 outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 ${
                    errors.pincode && touched.pincode ? "border-red-500 bg-red-50" : "border-gray-200"
                  }`}
                  required
                />
              </div>
              {errors.pincode && touched.pincode && (
                <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>
              )}
            </motion.div>
          </div>

          {/* State (Optional) */}
          <motion.div variants={itemVariants}>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              State <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State name"
              className="w-full rounded-2xl border border-gray-200 py-3 px-4 outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
            />
          </motion.div>

          {/* Payment Methods */}
          <motion.div variants={itemVariants}>
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { value: "cod", label: "Cash on Delivery", icon: FaCreditCard, color: "text-yellow-600" },
                { value: "online", label: "Credit/Debit Card", icon: FaCreditCard, color: "text-blue-600" },
                { value: "upi", label: "Google Pay / UPI", icon: FaGooglePay, color: "text-green-600" },
                { value: "paypal", label: "PayPal", icon: FaPaypal, color: "text-blue-500" },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-all ${
                    paymentMethod === method.value
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200 hover:border-yellow-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-yellow-600"
                  />
                  <method.icon className={`h-5 w-5 ${method.color}`} />
                  <span className="text-sm font-medium text-gray-700">{method.label}</span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Terms and Conditions */}
          <motion.div variants={itemVariants}>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-yellow-700 hover:underline">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-yellow-700 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-yellow-600 to-yellow-700 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
            >
              <span className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order • ₹{total.toLocaleString()}
                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </motion.div>

          {/* Order Summary Toggle */}
          <motion.div variants={itemVariants}>
            <button
              type="button"
              onClick={() => setShowOrderSummary(!showOrderSummary)}
              className="w-full text-center text-sm text-gray-500 hover:text-yellow-700"
            >
              {showOrderSummary ? "Hide Order Summary ▲" : "Show Order Summary ▼"}
            </button>
          </motion.div>

          {/* Order Summary */}
          <AnimatePresence>
            {showOrderSummary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-2xl bg-gray-50 p-4"
              >
                <h3 className="mb-3 font-semibold text-gray-800">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (5%)</span>
                      <span>₹{gst.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-yellow-700">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Badge */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <FaShieldAlt className="h-4 w-4 text-green-600" />
              <span>Your information is secure and encrypted</span>
            </div>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
};

export default Section1;