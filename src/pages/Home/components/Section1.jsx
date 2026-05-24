import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaShoppingCart, 
  FaArrowRight, 
  FaCheckCircle, 
  FaStar, 
  FaTruck, 
  FaLeaf,
  FaPlay
} from "react-icons/fa";
import logoImage from "../../../assets/images/logo.jpeg";

const Section1 = () => {
  const navigate = useNavigate();

  // Floating animation for background elements
  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const floatingAnimation2 = {
    y: [0, 15, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1,
    },
  };

  const stats = [
    { value: "39+", label: "Years of Excellence", icon: FaStar, color: "text-yellow-600" },
    { value: "50K+", label: "Happy Customers", icon: FaCheckCircle, color: "text-green-600" },
    { value: "24/7", label: "Customer Support", icon: FaTruck, color: "text-blue-600" },
  ];

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-yellow-100 pt-20 sm:pt-24 md:pt-28 lg:pt-32"
    >
      {/* Background Decorative Elements - Fixed Version */}
      <div className="absolute inset-0 -z-10">
        {/* Animated Blobs */}
        <motion.div
          animate={floatingAnimation}
          className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-yellow-200/40 blur-3xl"
        />
        <motion.div
          animate={floatingAnimation2}
          className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl"
        />
        
        {/* Simple Dot Pattern (No SVG Data URI) */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #F59E0B 1.5px, transparent 1.5px)',
            backgroundSize: '32px 32px'
          }}
        />
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-100/20 via-transparent to-amber-100/20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 py-12 md:gap-12 md:py-16 lg:grid-cols-2 lg:py-20">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-2 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-600 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-600" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-yellow-800 sm:text-sm">
                Premium Quality Since 1985
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Nature's Finest
              <span className="relative inline-block ml-2">
                <span className="relative z-10 bg-gradient-to-r from-yellow-700 to-yellow-600 bg-clip-text text-transparent">
                  Cashews
                </span>
                <motion.svg
                  className="absolute -bottom-2 left-0 z-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  preserveAspectRatio="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <path
                    d="M0 4 Q50 8 100 4 Q150 0 200 4"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </motion.svg>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl"
            >
              Experience rich buttery taste from handpicked premium
              cashews sourced from the best farms in India.
            </motion.p>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex flex-wrap justify-center gap-4 lg:justify-start"
            >
              {["100% Natural", "Chemical Free", "Premium Quality"].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-1.5 rounded-full bg-white/50 px-3 py-1.5 backdrop-blur-sm"
                >
                  <FaLeaf className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/products")}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-yellow-600 to-yellow-700 px-8 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                <span className="relative flex items-center justify-center gap-2">
                  Shop Now
                  <FaShoppingCart className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-yellow-500 to-yellow-600 transition-transform duration-500 group-hover:translate-x-0" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const aboutSection = document.getElementById("about");
                  if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="group flex items-center justify-center gap-2 rounded-full border-2 border-yellow-700 bg-white/80 px-8 py-3.5 font-semibold text-yellow-700 backdrop-blur-sm transition-all duration-300 hover:bg-yellow-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Learn More
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-10 flex flex-wrap justify-center gap-4 border-t border-yellow-200 pt-8 lg:justify-start"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="rounded-full bg-white/80 p-2 shadow-sm backdrop-blur-sm">
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-600">{stat.label}</p>
                    </div>
                    {index < stats.length - 1 && (
                      <div className="hidden h-8 w-px bg-yellow-200 sm:block" />
                    )}
                  </div>
                );
              })}
            </motion.div>

            {/* Rating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6 flex items-center justify-center gap-2 lg:justify-start"
            >
              <div className="flex -space-x-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-6 w-6 rounded-full border-2 border-white bg-gradient-to-br from-yellow-400 to-yellow-600"
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                ))}
                <span className="ml-2 text-sm font-medium text-gray-700">
                  4.9/5
                </span>
                <span className="text-sm text-gray-500">(2,000+ reviews)</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, type: "spring", damping: 15 }}
            className="relative flex justify-center"
          >
            {/* Decorative Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="h-80 w-80 rounded-full border-2 border-yellow-200/50 sm:h-96 sm:w-96"
              />
              <motion.div
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.05, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute h-[22rem] w-[22rem] rounded-full border border-yellow-200/30 sm:h-[26rem] sm:w-[26rem]"
              />
            </div>

            {/* Main Image */}
            <div className="group relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-20 blur-xl transition-opacity duration-500 group-hover:opacity-40" />
              <img
                src={logoImage}
                alt="Premium Cashews - Vijay Cashews"
                className="relative rounded-3xl shadow-2xl transition-all duration-500 group-hover:scale-105"
                loading="eager"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x400?text=Vijay+Cashews";
                }}
              />
            </div>

            {/* Floating Badge - Organic */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-4 -left-4 rounded-2xl bg-white px-3 py-2 shadow-lg md:-bottom-6 md:-left-6"
            >
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 p-1.5">
                  <FaCheckCircle className="h-3 w-3 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">100% Organic</p>
                  <p className="text-xs text-gray-500">Certified</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Badge - Video */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
              className="absolute -right-4 -top-4 rounded-2xl bg-white px-3 py-2 shadow-lg md:-right-6 md:-top-6"
            >
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-red-100 p-1.5">
                  <FaPlay className="h-2.5 w-2.5 text-red-600" />
                </div>
                <span className="text-xs font-semibold text-gray-800">Watch Story</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="hidden pb-8 text-center md:block"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-gray-400">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-6 w-3 rounded-full border border-gray-400 p-0.5"
          >
            <div className="mx-auto h-1.5 w-1.5 rounded-full bg-yellow-600" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Section1;