import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaFacebook, 
  FaApple,
  FaSpinner,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaUserPlus
} from "react-icons/fa";
import MainLayout from "../../layouts/MainLayout";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { register, authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });

  // Password strength checker
  useEffect(() => {
    const password = formData.password;
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    const metCount = Object.values(requirements).filter(Boolean).length;
    let score = 0;
    let feedback = "";
    
    if (password.length === 0) {
      score = 0;
      feedback = "";
    } else if (metCount <= 2) {
      score = 25;
      feedback = "Weak password";
    } else if (metCount === 3) {
      score = 50;
      feedback = "Fair password";
    } else if (metCount === 4) {
      score = 75;
      feedback = "Good password";
    } else {
      score = 100;
      feedback = "Strong password";
    }
    
    setPasswordStrength({
      score,
      feedback,
      requirements,
    });
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Please enter your full name");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      setError("Please enter a password");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (passwordStrength.score < 50) {
      setError("Please choose a stronger password");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      navigate("/products");
      return;
    }

    setError(result.error || "Unable to register. Please try again.");
    setIsSubmitting(false);
  };

  const handleSocialSignup = (provider) => {
    // Social signup logic would go here
    console.log(`Sign up with ${provider}`);
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
            className="relative rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl sm:p-8"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 p-3">
                <FaUserPlus className="h-6 w-6 text-yellow-700" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Create Account
              </h1>
              <p className="mt-2 text-sm text-gray-600 sm:text-base">
                Join us for faster checkout and exclusive offers
              </p>
            </motion.div>

            {/* Error Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 rounded-2xl bg-gradient-to-r from-red-50 to-red-100 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="rounded-full bg-red-200 p-1">
                        <FaTimesCircle className="h-4 w-4 text-red-600" />
                      </div>
                    </div>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Name Field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <div className={`relative transition-all duration-200 ${
                  focusedField === "name" ? "scale-[1.02]" : ""
                }`}>
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="John Doe"
                    required
                    className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                  />
                </div>
              </motion.div>

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
                    placeholder="Create a password"
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-3">
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength.score}%` }}
                            className={`h-full transition-all ${
                              passwordStrength.score <= 25
                                ? "bg-red-500"
                                : passwordStrength.score <= 50
                                ? "bg-yellow-500"
                                : passwordStrength.score <= 75
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                          />
                        </div>
                      </div>
                      <span className={`text-xs font-medium ${
                        passwordStrength.score <= 25
                          ? "text-red-600"
                          : passwordStrength.score <= 50
                          ? "text-yellow-600"
                          : passwordStrength.score <= 75
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}>
                        {passwordStrength.feedback}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(passwordStrength.requirements).map(([key, met]) => (
                        <div key={key} className="flex items-center gap-1">
                          {met ? (
                            <FaCheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <FaTimesCircle className="h-3 w-3 text-gray-300" />
                          )}
                          <span className={met ? "text-gray-700" : "text-gray-400"}>
                            {key === "length" && "Min 8 characters"}
                            {key === "uppercase" && "Uppercase letter"}
                            {key === "lowercase" && "Lowercase letter"}
                            {key === "number" && "Number"}
                            {key === "special" && "Special character"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>
                <div className={`relative transition-all duration-200 ${
                  focusedField === "confirmPassword" ? "scale-[1.02]" : ""
                }`}>
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Confirm your password"
                    required
                    className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-12 outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-yellow-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                  <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                    <FaCheckCircle className="h-3 w-3" /> Passwords match
                  </p>
                )}
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
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
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
                  Or sign up with
                </span>
              </div>
            </motion.div>

            {/* Social Signup Buttons */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-3"
            >
              <button
                onClick={() => handleSocialSignup("google")}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 transition-all hover:border-yellow-300 hover:bg-yellow-50 hover:shadow-md"
              >
                <FaGoogle className="text-red-500" />
                <span className="text-sm font-medium text-gray-700">Google</span>
              </button>
              <button
                onClick={() => handleSocialSignup("facebook")}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 transition-all hover:border-yellow-300 hover:bg-yellow-50 hover:shadow-md"
              >
                <FaFacebook className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Facebook</span>
              </button>
              <button
                onClick={() => handleSocialSignup("apple")}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 transition-all hover:border-yellow-300 hover:bg-yellow-50 hover:shadow-md"
              >
                <FaApple className="text-gray-800" />
                <span className="text-sm font-medium text-gray-700">Apple</span>
              </button>
            </motion.div>

            {/* Login Link */}
            <motion.div 
              variants={itemVariants}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-semibold text-yellow-700 transition-colors hover:text-yellow-800 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>

            {/* Terms & Privacy */}
            <motion.div 
              variants={itemVariants}
              className="mt-4 text-center text-xs text-gray-400"
            >
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-yellow-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-yellow-600 hover:underline">
                Privacy Policy
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Register;