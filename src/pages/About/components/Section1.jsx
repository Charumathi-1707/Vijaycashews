import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import { FaLeaf, FaHandshake, FaStar, FaPlay, FaArrowRight } from 'react-icons/fa';

const Section1 = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const controls = useAnimation();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
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

  const trustIndicators = [
    { label: "Organic Certified", icon: FaLeaf, color: "text-green-600", bg: "bg-green-50" },
    { label: "Direct Sourcing", icon: FaHandshake, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Crunch Guarantee", icon: FaStar, color: "text-yellow-600", bg: "bg-yellow-50" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-amber-50/30 to-white px-4 py-16 sm:px-6 sm:py-20 md:py-28 lg:py-32"
      aria-label="Hero section"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-amber-50 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-yellow-50 blur-3xl animate-pulse-slow animation-delay-1000" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/20 blur-3xl" />
        
        {/* Floating cashew shapes */}
        <div className="absolute left-[5%] top-[15%] opacity-10 animate-float">
          <div className="h-16 w-16 rotate-45 rounded-full bg-amber-600"></div>
        </div>
        <div className="absolute right-[8%] bottom-[20%] opacity-10 animate-float animation-delay-2000">
          <div className="h-12 w-12 rotate-12 rounded-full bg-amber-700"></div>
        </div>
        <div className="absolute left-[15%] bottom-[10%] opacity-5 animate-float animation-delay-1000">
          <div className="h-20 w-20 rounded-full bg-amber-500"></div>
        </div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 -z-5 opacity-5">
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-amber-50/50 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Animated Badge */}
          <motion.div
            variants={itemVariants}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 px-5 py-2 shadow-md ring-1 ring-amber-200/50 backdrop-blur-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-600 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-600" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[4px] text-amber-800 sm:text-sm">
              Since 1985
            </p>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:mt-8 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          >
            Crafting{" "}
            <span 
              className="relative inline-block"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <span className="relative z-10 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 bg-clip-text text-transparent bg-size-200 animate-gradient">
                Premium Cashew
              </span>
              <motion.svg
                className="absolute -bottom-2 left-0 z-0 w-full sm:-bottom-3"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
                animate={{ 
                  pathLength: isHovering ? 1 : 0.7,
                  opacity: isHovering ? 0.8 : 0.4
                }}
                transition={{ duration: 0.5 }}
              >
                <path
                  d="M0 6 Q75 12 150 6 Q225 0 300 6"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </motion.svg>
            </span>{" "}
            Experiences
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-3xl text-base text-gray-600 leading-relaxed sm:mt-8 sm:text-lg md:text-xl md:leading-relaxed"
          >
            We are committed to sourcing the finest cashews and delivering a
            delightful customer experience from{" "}
            <span className="relative inline-block group">
              <span className="font-semibold text-amber-700 transition-colors group-hover:text-amber-800">
                farm to table
              </span>
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-300 group-hover:w-full" />
            </span>
            .
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8 sm:gap-y-4"
          >
            {trustIndicators.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="group flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-md sm:px-4 sm:py-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`rounded-full ${item.bg} p-1 transition-transform group-hover:scale-110`}>
                    <Icon className={`h-4 w-4 ${item.color} sm:h-5 sm:w-5`} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 sm:text-sm">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row sm:gap-5"
          >
            <Link
              to="/about"
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 bg-size-200 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 active:scale-95 sm:px-10 sm:py-4"
            >
              <span className="relative z-10 flex items-center gap-2">
                Discover Our Story
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-amber-500 to-yellow-500 transition-transform duration-500 group-hover:translate-x-0" />
            </Link>
            
            <button
              className="flex items-center gap-2 rounded-full border-2 border-amber-200 bg-white/80 px-8 py-3.5 text-base font-semibold text-amber-700 backdrop-blur-sm transition-all duration-300 hover:border-amber-400 hover:bg-amber-50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 active:scale-95 sm:px-10 sm:py-4"
              aria-label="Watch farm video"
              onClick={() => {
                // Video modal logic would go here
                console.log("Open video modal");
              }}
            >
              <FaPlay className="text-sm transition-transform group-hover:scale-110" />
              Watch Farm Video →
            </button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={itemVariants}
            className="mt-16 hidden md:block"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Scroll to explore
              </span>
              <div className="h-10 w-5 rounded-full border-2 border-gray-300 p-1">
                <div className="h-2 w-1 mx-auto rounded-full bg-amber-500 animate-scroll-bounce"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Section1;