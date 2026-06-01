import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeadset,
  FaEnvelope,
  FaPhoneAlt,
  FaClock,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaTrophy,
  FaShieldAlt,
  FaWhatsapp,
  FaArrowRight,
} from "react-icons/fa";
import MainLayout from "../../layouts/MainLayout";
import Section1 from "./components/Section1";
import Section2 from "./components/Section2";

const Contact = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const faqs = [
    {
      id: 1,
      question: "What are your business hours?",
      answer: "We are open Monday to Friday from 9:00 AM to 8:00 PM, and Saturday from 10:00 AM to 6:00 PM. We remain closed on Sundays and public holidays.",
    },
    {
      id: 2,
      question: "How quickly do you respond to inquiries?",
      answer: "Our customer support team typically responds within 2-4 hours during business hours. For urgent matters, please call us directly.",
    },
    {
      id: 3,
      question: "Do you offer bulk order discounts?",
      answer: "Yes! We offer special pricing for bulk orders. Please contact our bulk order team at bulk@vijaycashew.com for a customized quote.",
    },
    {
      id: 4,
      question: "Can I return or exchange products?",
      answer: "We have a 7-day return policy for damaged or defective products. Please contact our support team with your order details for assistance.",
    },
    {
      id: 5,
      question: "Do you ship internationally?",
      answer: "Currently, we ship only within India. We're working on expanding our international shipping capabilities soon.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Happy Customers", icon: FaStar },
    { value: "39+", label: "Years of Excellence", icon: FaTrophy },
    { value: "100%", label: "Quality Guaranteed", icon: FaShieldAlt },
    { value: "24/7", label: "Customer Support", icon: FaHeadset },
  ];

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

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

  return (
    <MainLayout>
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-yellow-600 to-yellow-700 px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white blur-3xl" />
          </div>
          
          <div className="relative mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                <FaHeadset className="h-4 w-4 text-white" />
                <span className="text-sm font-semibold text-white">We're Here to Help</span>
              </div>
              <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                Get in Touch
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
                Have questions about our products or need assistance? Our team is ready to help you.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mx-auto max-w-7xl px-4 -mt-8 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <div className="rounded-full bg-yellow-100 p-3">
                    <Icon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Main Contact Section */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-10 lg:grid-cols-2"
          >
            {/* Contact Form Section */}
            <motion.div variants={itemVariants}>
              <div className="sticky top-24">
                {/* Quick Contact Banner */}
                <div className="mb-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                  <div className="flex items-center gap-3">
                    <FaWhatsapp className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        Quick Response on WhatsApp
                      </p>
                      <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-700 hover:underline"
                      >
                        Chat with us →
                      </a>
                    </div>
                  </div>
                </div>
                <Section1 />
              </div>
            </motion.div>

            {/* Contact Information Section */}
            <motion.div variants={itemVariants}>
              <Section2 />
            </motion.div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-20"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2">
                <FaHeadset className="h-4 w-4 text-yellow-700" />
                <span className="text-sm font-semibold text-yellow-800">FAQ</span>
              </div>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-gray-600">
                Find quick answers to common questions
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="mb-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-center justify-between p-5 text-left"
                  >
                    <span className="font-semibold text-gray-800">
                      {faq.question}
                    </span>
                    {activeFaq === faq.id ? (
                      <FaChevronUp className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <FaChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <AnimatePresence>
                    {activeFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100"
                      >
                        <p className="p-5 text-gray-600">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Support Options Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 rounded-3xl bg-gradient-to-r from-yellow-600 to-yellow-700 p-8 text-center text-white shadow-xl"
          >
            <h3 className="text-2xl font-bold">Still have questions?</h3>
            <p className="mt-2 text-yellow-100">
              Our support team is available 24/7 to assist you
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-yellow-700 transition-all hover:scale-105 hover:shadow-lg"
              >
                <FaPhoneAlt />
                Call Now
              </a>
              <a
                href="mailto:support@vijaycashew.com"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white px-6 py-3 font-semibold text-white transition-all hover:bg-white hover:text-yellow-700"
              >
                <FaEnvelope />
                Email Us
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
              >
                <FaWhatsapp />
                WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-center text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <FaCheckCircle className="h-4 w-4 text-green-500" />
              <span>100% Secure Communication</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="h-4 w-4 text-yellow-600" />
              <span>24/7 Customer Support</span>
            </div>
            <div className="flex items-center gap-2">
              <FaShieldAlt className="h-4 w-4 text-green-500" />
              <span>Privacy Protected</span>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;