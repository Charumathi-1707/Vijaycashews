import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaComment,
  FaPaperPlane,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaPhone,
  FaRegClock,
  FaHeadset,
} from "react-icons/fa";

const Section1 = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error'
  const [focusedField, setFocusedField] = useState(null);
  const [charCount, setCharCount] = useState(0);

  const maxMessageLength = 500;

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return null;
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Enter a valid email address";
    return null;
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return null; // Phone is optional
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) return "Enter a valid 10-digit mobile number";
    return null;
  };

  const validateMessage = (message) => {
    if (!message.trim()) return "Message is required";
    if (message.trim().length < 10) return "Message must be at least 10 characters";
    if (message.length > maxMessageLength) return `Message cannot exceed ${maxMessageLength} characters`;
    return null;
  };

  const validateField = (name, value) => {
    let error = null;
    switch (name) {
      case "name":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "message":
        error = validateMessage(value);
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "message") {
      setCharCount(value.length);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      validateField(name, value);
    }
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
    const allTouched = { name: true, email: true, message: true };
    setTouched(allTouched);
    
    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const messageError = validateMessage(formData.message);
    const phoneError = validatePhone(formData.phone);
    
    if (nameError || emailError || messageError || phoneError) {
      setErrors({
        name: nameError,
        email: emailError,
        message: messageError,
        phone: phoneError,
      });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    // Simulate API call (replace with actual API)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setCharCount(0);
      setTouched({});
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      validateEmail(formData.email) === null &&
      (!formData.phone || validatePhone(formData.phone) === null) &&
      formData.message.trim() &&
      formData.message.length <= maxMessageLength
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl"
    >
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500" />
      
      <div className="p-6 sm:p-8 md:p-10">
        {/* Header */}
        <div className="border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-100 p-3">
              <FaComment className="h-6 w-6 text-yellow-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Send Us a Message
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                We'll get back to you within 24 hours
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {submitStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 rounded-2xl bg-green-50 p-4"
            >
              <div className="flex items-center gap-3">
                <FaCheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Message Sent Successfully!</p>
                  <p className="text-sm text-green-700">
                    Thank you for reaching out. We'll respond shortly.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          
          {submitStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 rounded-2xl bg-red-50 p-4"
            >
              <div className="flex items-center gap-3">
                <FaTimesCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">Failed to Send Message</p>
                  <p className="text-sm text-red-700">
                    Please try again or contact us directly via phone.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
              />
            </div>
            {errors.name && touched.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </motion.div>

          {/* Email Address */}
          <motion.div variants={itemVariants}>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email Address <span className="text-red-500">*</span>
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
                placeholder="you@example.com"
                className={`w-full rounded-2xl border py-3 pl-11 pr-4 outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 ${
                  errors.email && touched.email ? "border-red-500 bg-red-50" : "border-gray-200"
                }`}
              />
            </div>
            {errors.email && touched.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </motion.div>

          {/* Phone Number (Optional) */}
          <motion.div variants={itemVariants}>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
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
              />
            </div>
            {errors.phone && touched.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </motion.div>

          {/* Message */}
          <motion.div variants={itemVariants}>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Your Message <span className="text-red-500">*</span>
            </label>
            <div className={`relative transition-all duration-200 ${focusedField === "message" ? "scale-[1.02]" : ""}`}>
              <FaComment className="absolute left-4 top-4 text-gray-400" />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={() => handleFocus("message")}
                placeholder="How can we help you?"
                rows="5"
                maxLength={maxMessageLength}
                className={`w-full rounded-2xl border py-3 pl-11 pr-4 outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 ${
                  errors.message && touched.message ? "border-red-500 bg-red-50" : "border-gray-200"
                }`}
              />
            </div>
            
            {/* Character Counter */}
            <div className="mt-2 flex justify-between text-xs">
              <span className={`${errors.message ? "text-red-500" : "text-gray-500"}`}>
                {charCount}/{maxMessageLength} characters
              </span>
              {errors.message && touched.message && (
                <span className="text-red-500">{errors.message}</span>
              )}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-yellow-600 to-yellow-700 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
            >
              <span className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <FaPaperPlane className="transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </motion.div>

          {/* Response Time Note */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
              <FaRegClock className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-600">
                Average response time: 2-4 hours
              </span>
            </div>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default Section1;