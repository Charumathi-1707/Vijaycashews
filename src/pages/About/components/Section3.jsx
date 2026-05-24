import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { 
  FaGem, 
  FaHandsHelping, 
  FaSmile, 
  FaLeaf, 
  FaTrophy, 
  FaHeart,
  FaShieldAlt,
  FaUsers,
  FaChartLine
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Section3 = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const controls = useAnimation();
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const coreValues = [
    {
      title: "Quality First",
      description: "We source only the finest cashews, ensuring premium taste and freshness in every batch.",
      icon: FaGem,
      color: "from-amber-500 to-yellow-500",
      bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
      iconColor: "text-amber-600",
      stats: "100% Quality Checked",
      delay: 0,
    },
    {
      title: "Uncompromising Integrity",
      description: "Transparent sourcing, fair pricing, and honest business practices since day one.",
      icon: FaShieldAlt,
      color: "from-blue-500 to-cyan-500",
      bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
      iconColor: "text-blue-600",
      stats: "100% Transparent",
      delay: 0.1,
    },
    {
      title: "Customer Delight",
      description: "Your satisfaction drives us. We go above and beyond to create memorable experiences.",
      icon: FaSmile,
      color: "from-green-500 to-emerald-500",
      bg: "bg-gradient-to-br from-green-50 to-emerald-50",
      iconColor: "text-green-600",
      stats: "98% Satisfaction Rate",
      delay: 0.2,
    },
  ];

  const extendedValues = [
    {
      title: "Sustainability",
      description: "Eco-friendly practices and responsible sourcing for a better tomorrow.",
      icon: FaLeaf,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Community First",
      description: "Supporting local farmers and giving back to our communities.",
      icon: FaUsers,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Continuous Innovation",
      description: "Constantly improving our processes and products.",
      icon: FaChartLine,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  const qualityBadges = [
    { label: "ISO Certified", icon: FaTrophy },
    { label: "FSSAI Approved", icon: FaShieldAlt },
    { label: "Export Quality", icon: FaGem },
    { label: "Chemical Free", icon: FaLeaf },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (delay) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: delay,
        type: 'spring',
        damping: 15,
        stiffness: 120,
      },
    }),
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 200,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:py-28"
      aria-label="Our values section"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-yellow-100/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-amber-100/20 blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(to right, #92400e 1px, transparent 1px), linear-gradient(to bottom, #92400e 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="rounded-3xl bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
        >
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Header Section */}
            <div className="mb-12 text-center md:mb-16">
              <motion.div variants={itemVariants} className="mb-4 inline-block">
                <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2">
                  <FaHeart className="h-4 w-4 text-amber-600 animate-pulse" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-amber-800">
                    What We Believe
                  </span>
                </div>
              </motion.div>
              
              <motion.h2 
                variants={itemVariants}
                className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl"
              >
                <span className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                  Our Values
                </span>
              </motion.h2>
              
              <motion.div 
                variants={itemVariants}
                className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500"
              />
            </div>

            {/* Main Description */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="relative text-center">
                <div className="absolute left-1/2 top-0 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                <p className="pt-6 text-base leading-relaxed text-gray-700 sm:text-lg md:text-xl md:leading-relaxed">
                  Quality, integrity, and customer satisfaction are at the heart of everything we do.
                </p>
              </div>
            </motion.div>

            {/* Quality Badges */}
            <motion.div 
              variants={itemVariants}
              className="mb-12 flex flex-wrap items-center justify-center gap-3"
            >
              {qualityBadges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-50 to-white px-4 py-2 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Icon className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>

            {/* Core Values Cards */}
            <motion.div 
              variants={containerVariants}
              className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {coreValues.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    custom={value.delay}
                    variants={cardVariants}
                    whileHover="hover"
                    onHoverStart={() => setHoveredCard(index)}
                    onHoverEnd={() => setHoveredCard(null)}
                    className={`group relative overflow-hidden rounded-2xl ${value.bg} p-6 shadow-lg transition-all duration-300 hover:shadow-xl`}
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 opacity-0 bg-gradient-to-br from-white/50 to-transparent transition-opacity duration-500 group-hover:opacity-100" />
                    
                    {/* Icon */}
                    <div className="relative mb-4 inline-block">
                      <div className={`rounded-xl bg-gradient-to-r ${value.color} p-3 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                        <Icon className={`h-6 w-6 text-white`} />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="relative mb-2 text-xl font-bold text-gray-800">
                      {value.title}
                    </h3>
                    <p className="relative mb-3 text-sm leading-relaxed text-gray-600">
                      {value.description}
                    </p>
                    
                    {/* Stats badge */}
                    <div className="relative inline-block rounded-full bg-white/80 px-3 py-1 backdrop-blur-sm">
                      <span className="text-xs font-semibold text-amber-700">
                        {value.stats}
                      </span>
                    </div>
                    
                    {/* Animated border on hover */}
                    {hoveredCard === index && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Extended Values Grid */}
            <motion.div variants={itemVariants} className="mb-12">
              <h3 className="mb-6 text-center text-lg font-semibold text-gray-700 sm:text-xl">
                More Reasons to Choose Us
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {extendedValues.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <motion.div
                      key={value.title}
                      variants={itemVariants}
                      className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      whileHover={{ x: 5 }}
                    >
                      <div className={`rounded-full ${value.bg} p-2 transition-transform duration-300 hover:scale-110`}>
                        <Icon className={`h-5 w-5 ${value.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {value.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {value.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div 
              variants={itemVariants}
              className="rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 p-6 text-center text-white shadow-lg md:p-8"
            >
              <h3 className="mb-2 text-xl font-bold md:text-2xl">
                Experience the Vijay Cashews Difference
              </h3>
              <p className="mb-4 text-sm text-white/90 md:text-base">
                Join thousands of satisfied customers who trust us for premium quality cashews
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 font-semibold text-amber-700 transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-amber-600 active:scale-95 md:px-8 md:py-3"
              >
                Shop Now
                <FaHandsHelping className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Section3;