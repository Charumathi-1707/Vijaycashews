import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { FaSeedling, FaHandsHelping, FaHeart, FaAward, FaQuoteLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Section2 = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const controls = useAnimation();
  const [activeStat, setActiveStat] = useState(null);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const milestones = [
    {
      year: "1985",
      title: "Humble Beginnings",
      description: "Started as a small family business in Mumbai",
      icon: FaSeedling,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      year: "2000",
      title: "Expansion Era",
      description: "Opened first processing facility",
      icon: FaHandsHelping,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      year: "2015",
      title: "National Recognition",
      description: "Awarded 'Best Cashew Brand'",
      icon: FaAward,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      year: "2024",
      title: "Global Reach",
      description: "Exporting to 15+ countries worldwide",
      icon: FaHeart,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  const stats = [
    { label: "Years of Excellence", value: "39+", suffix: "", icon: FaAward },
    { label: "Happy Customers", value: "100K", suffix: "+", icon: FaHeart },
    { label: "Tonnes Processed", value: "5K", suffix: "+", icon: FaSeedling },
    { label: "Global Partners", value: "25", suffix: "+", icon: FaHandsHelping },
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

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:py-28"
      aria-label="Our story section"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-yellow-100/50 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-100/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-200/20 blur-2xl" />
        
        {/* Pattern dots */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #92400e 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="rounded-3xl bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Header Section */}
            <div className="mb-12 text-center md:mb-16">
              <motion.div variants={itemVariants} className="mb-4 inline-block">
                <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2">
                  <FaQuoteLeft className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-amber-800">
                    Our Heritage
                  </span>
                </div>
              </motion.div>
              
              <motion.h2 
                variants={itemVariants}
                className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl"
              >
                <span className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                  Our Story
                </span>
              </motion.h2>
              
              <motion.div 
                variants={itemVariants}
                className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500"
              />
            </div>

            {/* Main Description */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="relative">
                <FaQuoteLeft className="absolute -left-3 -top-3 h-8 w-8 text-amber-200 opacity-50" />
                <p className="relative text-base leading-relaxed text-gray-700 sm:text-lg md:text-xl md:leading-relaxed">
                  From small beginnings to a trusted cashew brand, our journey focuses on{" "}
                  <span className="font-semibold text-amber-700">quality</span>,
                  <span className="font-semibold text-amber-700"> sustainability</span>, and the joy of 
                  sharing the best nuts with every household.
                </p>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
              variants={itemVariants}
              className="mb-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-4 text-center shadow-md transition-all duration-300 hover:shadow-lg sm:p-6"
                    onMouseEnter={() => setActiveStat(index)}
                    onMouseLeave={() => setActiveStat(null)}
                  >
                    <div className="absolute inset-0 -translate-y-full bg-gradient-to-b from-amber-50 to-transparent transition-transform duration-500 group-hover:translate-y-0" />
                    <div className="relative">
                      <Icon className="mx-auto h-6 w-6 text-amber-600 transition-transform duration-300 group-hover:scale-110 sm:h-8 sm:w-8" />
                      <div className="mt-2 text-2xl font-bold text-gray-900 sm:mt-3 sm:text-3xl md:text-4xl">
                        {stat.value}
                        <span className="text-base text-amber-600">{stat.suffix}</span>
                      </div>
                      <p className="mt-1 text-xs font-medium text-gray-600 sm:mt-2 sm:text-sm">
                        {stat.label}
                      </p>
                    </div>
                    {activeStat === index && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                );
              })}
            </motion.div>

            {/* Timeline/Milestones */}
            <motion.div variants={itemVariants} className="mb-12">
              <h3 className="mb-6 text-center text-xl font-bold text-gray-800 sm:text-2xl">
                Our Journey Through Time
              </h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-300" />
                
                <div className="space-y-8">
                  {milestones.map((milestone, index) => {
                    const Icon = milestone.icon;
                    const isLeft = index % 2 === 0;
                    
                    return (
                      <motion.div
                        key={milestone.year}
                        variants={itemVariants}
                        className={`relative flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-4 lg:gap-8`}
                      >
                        {/* Timeline node */}
                        <div className="absolute left-1/2 z-10 hidden -translate-x-1/2 lg:block">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg ring-4 ring-white">
                            <div className="h-2 w-2 rounded-full bg-white" />
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className={`w-full lg:w-1/2 ${isLeft ? 'lg:pr-12' : 'lg:pl-12'}`}>
                          <div className="group rounded-xl bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg sm:p-6">
                            <div className="flex items-center gap-3">
                              <div className={`rounded-full ${milestone.bg} p-2 transition-transform duration-300 group-hover:scale-110`}>
                                <Icon className={`h-5 w-5 ${milestone.color}`} />
                              </div>
                              <div>
                                <span className="text-lg font-bold text-amber-700 sm:text-xl">
                                  {milestone.year}
                                </span>
                                <h4 className="font-semibold text-gray-800">
                                  {milestone.title}
                                </h4>
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-600 sm:text-base">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants} className="text-center">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 active:scale-95 sm:px-8 sm:py-4"
              >
                <span>Learn More About Us</span>
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Section2;