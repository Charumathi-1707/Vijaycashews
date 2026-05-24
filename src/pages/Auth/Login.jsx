import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaFacebook, 
  FaApple,
  FaSpinner,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle
} from "react-icons/fa";
import MainLayout from "../../layouts/MainLayout";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authLoading, authError } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error when user starts typing
    if (error || authError) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    
    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      // Handle remember me
      if (formData.rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      // Navigate to intended page or products
      const from = location.state?.from?.pathname || "/products";
      navigate(from, { replace: true });
      return;
    }

    setError(result.error || "Unable to login. Please check your credentials.");
    setIsSubmitting(false);
  };

  const handleSocialLogin = (provider) => {
    // Social login logic would go here
    console.log(`Login with ${provider}`);
    // This preserves original logic by not actually implementing
    // social auth unless you add it to your backend
  };

  const isLoading = authLoading || isSubmitting;

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

  return (
    <MainLayout>
      <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 px-4 sm:py-20 sm:px-6 lg:py-24">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-yellow-100/30 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-amber-100/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-50/40 blur-3xl" />
        </div>

        <div className="mx-auto max-w-md">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl sm:p-8 md:p-10"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 p-3">
                <FaShieldAlt className="h-6 w-6 text-yellow-700" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-gray-600 sm:text-base">
                Sign in to manage your cart, track orders, and view your account
              </p>
            </motion.div>

            {/* Error Messages */}
            <AnimatePresence>
              {(error || authError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 rounded-2xl bg-gradient-to-r from-red-50 to-red-100 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="rounded-full bg-red-200 p-1">
                        <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-red-700">{error || authError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Email Field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className={`relative transition-all duration-200 ${
                  focusedField === "email" ? "scale-[1.02]" : ""
                }`}>
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className={`relative transition-all duration-200 ${
                  focusedField === "password" ? "scale-[1.02]" : ""
                }`}>
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-12 outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-yellow-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div 
                variants={itemVariants}
                className="flex items-center justify-between"
              >
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-yellow-700 transition-colors hover:text-yellow-800 hover:underline"
                >
                  Forgot password?
                </Link>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-yellow-600 to-yellow-700 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div 
              variants={itemVariants}
              className="relative my-6"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white/80 px-4 text-gray-500 backdrop-blur-sm">
                  Or continue with
                </span>
              </div>
            </motion.div>

            {/* Social Login Buttons */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-3"
            >
              <button
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 transition-all hover:border-yellow-300 hover:bg-yellow-50 hover:shadow-md"
              >
                <FaGoogle className="text-red-500" />
                <span className="text-sm font-medium text-gray-700">Google</span>
              </button>
              <button
                onClick={() => handleSocialLogin("facebook")}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 transition-all hover:border-yellow-300 hover:bg-yellow-50 hover:shadow-md"
              >
                <FaFacebook className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Facebook</span>
              </button>
              <button
                onClick={() => handleSocialLogin("apple")}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 transition-all hover:border-yellow-300 hover:bg-yellow-50 hover:shadow-md"
              >
                <FaApple className="text-gray-800" />
                <span className="text-sm font-medium text-gray-700">Apple</span>
              </button>
            </motion.div>

            {/* Register Link */}
            <motion.div 
              variants={itemVariants}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-semibold text-yellow-700 transition-colors hover:text-yellow-800 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </motion.div>

            {/* Trust Badge */}
            <motion.div 
              variants={itemVariants}
              className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400"
            >
              <div className="flex items-center gap-1">
                <FaCheckCircle className="h-3 w-3 text-green-500" />
                <span>Secure Login</span>
              </div>
              <div className="flex items-center gap-1">
                <FaShieldAlt className="h-3 w-3 text-green-500" />
                <span>SSL Encrypted</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Login;