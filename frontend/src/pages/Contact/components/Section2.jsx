import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaLinkedin,
  FaCopy,
  FaCheckCircle,
  FaDirections,
  FaStore,
  FaTruck,
} from "react-icons/fa";

const Section2 = () => {
  const [copiedField, setCopiedField] = useState(null);

  const contactInfo = {
    email: "support@vijaycashew.com",
    phone: "+91 98765 43210",
    alternatePhone: "+91 98765 43211",
    address: "123 Cashew Lane, Quality Estate, Mumbai - 400001, India",
    businessHours: [
      { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
      { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    socialMedia: [
      { name: "Facebook", icon: FaFacebook, url: "#", color: "hover:bg-blue-600" },
      { name: "Instagram", icon: FaInstagram, url: "#", color: "hover:bg-pink-600" },
      { name: "Twitter", icon: FaTwitter, url: "#", color: "hover:bg-sky-500" },
      { name: "WhatsApp", icon: FaWhatsapp, url: "https://wa.me/919876543210", color: "hover:bg-green-500" },
    ],
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const openMaps = () => {
    const encodedAddress = encodeURIComponent(contactInfo.address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

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

  const cardVariants = {
    hover: {
      scale: 1.02,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="sticky top-24"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-50 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl sm:p-8 md:p-10">
        
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow-200 opacity-20 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-200 opacity-20 blur-2xl" />

        {/* Header */}
        <motion.div variants={itemVariants} className="relative border-b border-yellow-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-100 p-3 shadow-md">
              <FaStore className="h-6 w-6 text-yellow-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Contact Information
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                We'd love to hear from you
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Cards Grid */}
        <div className="relative mt-6 space-y-4">
          {/* Email */}
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            variants={cardVariants}
            className="group rounded-2xl bg-white p-5 shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-gradient-to-br from-red-100 to-red-200 p-3">
                  <FaEnvelope className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Email Us
                  </h3>
                  <p className="mt-1 text-lg font-medium text-gray-800">
                    {contactInfo.email}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Response within 24 hours
                  </p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(contactInfo.email, "email")}
                className="rounded-full p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-yellow-600"
                aria-label="Copy email"
              >
                {copiedField === "email" ? (
                  <FaCheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <FaCopy className="h-5 w-5" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            variants={cardVariants}
            className="group rounded-2xl bg-white p-5 shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-gradient-to-br from-green-100 to-green-200 p-3">
                  <FaPhone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Call Us
                  </h3>
                  <p className="mt-1 text-lg font-medium text-gray-800">
                    {contactInfo.phone}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {contactInfo.alternatePhone} (Alternate)
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Mon-Sat, 9 AM - 8 PM
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.location.href = `tel:${contactInfo.phone}`}
                  className="rounded-full bg-green-100 p-2 text-green-600 transition-all hover:bg-green-600 hover:text-white"
                  aria-label="Call now"
                >
                  <FaPhone className="h-4 w-4" />
                </button>
                <button
                  onClick={() => copyToClipboard(contactInfo.phone, "phone")}
                  className="rounded-full p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-yellow-600"
                  aria-label="Copy phone"
                >
                  {copiedField === "phone" ? (
                    <FaCheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <FaCopy className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Address */}
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            variants={cardVariants}
            className="rounded-2xl bg-white p-5 shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 p-3">
                  <FaMapMarkerAlt className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Visit Us
                  </h3>
                  <p className="mt-1 text-base text-gray-800">
                    {contactInfo.address}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={openMaps}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-all hover:bg-blue-100"
                    >
                      <FaDirections className="h-3 w-3" />
                      Get Directions
                    </button>
                    <button
                      onClick={() => copyToClipboard(contactInfo.address, "address")}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:bg-gray-100"
                    >
                      {copiedField === "address" ? (
                        <FaCheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <FaCopy className="h-3 w-3" />
                      )}
                      Copy Address
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Business Hours */}
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            variants={cardVariants}
            className="rounded-2xl bg-white p-5 shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 p-3">
                <FaClock className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Business Hours
                </h3>
                <div className="mt-2 space-y-1">
                  {contactInfo.businessHours.map((schedule) => (
                    <div key={schedule.day} className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{schedule.day}</span>
                      <span className={`text-gray-600 ${schedule.hours === "Closed" ? "text-red-500" : ""}`}>
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Social Media Links */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-white p-5 shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-gradient-to-br from-yellow-100 to-amber-200 p-3">
                <FaStore className="h-5 w-5 text-yellow-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Connect With Us
                </h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  {contactInfo.socialMedia.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`rounded-full bg-gray-100 p-3 text-gray-600 transition-all duration-300 hover:scale-110 hover:text-white ${social.color}`}
                        aria-label={social.name}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Support Options */}
          <motion.div
            variants={itemVariants}
            className="grid gap-3 sm:grid-cols-2"
          >
            <div className="rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 text-center">
              <FaWhatsapp className="mx-auto h-6 w-6 text-green-600" />
              <p className="mt-2 text-sm font-semibold text-gray-800">WhatsApp Support</p>
              <p className="text-xs text-gray-600">Quick replies on WhatsApp</p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-medium text-green-700 hover:underline"
              >
                Chat Now →
              </a>
            </div>
            <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-4 text-center">
              <FaTruck className="mx-auto h-6 w-6 text-blue-600" />
              <p className="mt-2 text-sm font-semibold text-gray-800">Bulk Orders</p>
              <p className="text-xs text-gray-600">Special pricing for bulk</p>
              <a
                href="mailto:bulk@vijaycashew.com"
                className="mt-2 inline-block text-xs font-medium text-blue-700 hover:underline"
              >
                Enquire Now →
              </a>
            </div>
          </motion.div>
        </div>

        {/* Map Preview (Optional) */}
        <motion.div
          variants={itemVariants}
          className="mt-6 overflow-hidden rounded-2xl shadow-md"
        >
          <div className="h-48 w-full bg-gray-200">
            <iframe
              title="Store Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.567890123456!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMzLjYiTiA3MsKwNTInMzkuNyJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="bg-white p-3 text-center">
            <p className="text-xs text-gray-500">
              📍 Located in the heart of Mumbai
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Section2;