import { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaArrowUp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegClock,
  FaGem,
  FaLeaf,
  FaTrophy,
  FaShippingFast,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const navigate = useNavigate();

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate API call (preserve logic - no actual API change)
    setNewsletterStatus("loading");
    setTimeout(() => {
      setNewsletterStatus("success");
      setEmail("");
      setTimeout(() => setNewsletterStatus(null), 3000);
    }, 1000);
  };

  const handleNavigation = (path) => {
    navigate(path);
    scrollToTop();
  };

  return (
    <>
      <footer
        id="contact"
        className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white"
      >
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500"></div>

        {/* Newsletter Section */}
        <div className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-white/5 p-8 backdrop-blur-sm md:flex-row md:p-10">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-yellow-500">
                  Subscribe to our Newsletter
                </h3>
                <p className="mt-2 text-gray-400">
                  Get exclusive offers, recipes, and cashew updates!
                </p>
              </div>
              <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-full bg-white/10 px-11 py-3 text-white placeholder-gray-400 outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={newsletterStatus === "loading"}
                  className="rounded-full bg-yellow-600 px-6 py-3 font-semibold transition-all hover:bg-yellow-700 hover:shadow-lg disabled:opacity-50"
                >
                  {newsletterStatus === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
              {newsletterStatus === "success" && (
                <p className="text-sm text-green-400 animate-fade-in">
                  ✅ Subscribed successfully!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Column */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Vijay Cashews
              </h2>
              <p className="leading-relaxed text-gray-400">
                Bringing premium quality handpicked cashews since 1985 with trusted freshness and taste.
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FaLeaf className="text-green-500" />
                  <span>100% Natural</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FaTrophy className="text-yellow-500" />
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FaShippingFast className="text-blue-500" />
                  <span>Free Shipping*</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                <a
                  href="#"
                  className="group relative overflow-hidden rounded-full bg-white/10 p-3 transition-all hover:bg-yellow-600"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="relative z-10 text-sm transition-transform group-hover:scale-110" />
                </a>
                <a
                  href="#"
                  className="group relative overflow-hidden rounded-full bg-white/10 p-3 transition-all hover:bg-gradient-to-tr hover:from-pink-500 hover:to-orange-500"
                  aria-label="Instagram"
                >
                  <FaInstagram className="relative z-10 transition-transform group-hover:scale-110" />
                </a>
                <a
                  href="#"
                  className="group relative overflow-hidden rounded-full bg-white/10 p-3 transition-all hover:bg-sky-600"
                  aria-label="Twitter"
                >
                  <FaTwitter className="relative z-10 transition-transform group-hover:scale-110" />
                </a>
                <a
                  href="https://wa.me/919751694905"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-full bg-white/10 p-3 transition-all hover:bg-green-600"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp className="relative z-10 transition-transform group-hover:scale-110" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                <span className="h-1 w-8 rounded-full bg-yellow-500"></span>
                Quick Links
              </h3>
              <ul className="space-y-3">
                {["Home", "Products", "Quality", "Reviews"].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => handleNavigation(item === "Home" ? "/" : `/${item.toLowerCase()}`)}
                      className="group flex items-center gap-2 text-gray-400 transition-all hover:text-yellow-500"
                    >
                      <span className="h-1 w-1 rounded-full bg-gray-600 transition-all group-hover:bg-yellow-500"></span>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div>
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                <span className="h-1 w-8 rounded-full bg-yellow-500"></span>
                Products
              </h3>
              <ul className="space-y-3">
                {["Whole Cashews", "Roasted Cashews", "Gift Packs", "Bulk Orders"].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => handleNavigation(`/products?category=${item.toLowerCase().replace(" ", "-")}`)}
                      className="group flex items-center gap-2 text-gray-400 transition-all hover:text-yellow-500"
                    >
                      <FaGem className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                <span className="h-1 w-8 rounded-full bg-yellow-500"></span>
                Contact Us
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-400 transition-all hover:text-yellow-500">
                  <FaPhoneAlt className="mt-1 flex-shrink-0" />
                  <a href="tel:+919751694905" className="hover:underline">
                    +91 97516 94905
                  </a>
                </li>
                <li className="flex items-start gap-3 text-gray-400 transition-all hover:text-yellow-500">
                  <FaEnvelope className="mt-1 flex-shrink-0" />
                  <a href="mailto:hello@vijaycashews.com" className="hover:underline">
                    hello@vijaycashews.com
                  </a>
                </li>
                <li className="flex items-start gap-3 text-gray-400 transition-all hover:text-yellow-500">
                  <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                  <span>Mumbai, India</span>
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <FaRegClock className="mt-1 flex-shrink-0" />
                  <span>Mon-Sat: 9AM - 8PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/20">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-gray-500 md:flex-row md:text-left">
              <p>
                © {new Date().getFullYear()} Vijay Cashews. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="transition-colors hover:text-yellow-500">
                  Privacy Policy
                </a>
                <a href="#" className="transition-colors hover:text-yellow-500">
                  Terms of Service
                </a>
                <a href="#" className="transition-colors hover:text-yellow-500">
                  Shipping Policy
                </a>
              </div>
              <p className="flex items-center gap-1">
                Made with <span className="text-red-500 animate-pulse">❤️</span> in India
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 rounded-full bg-yellow-600 p-3 text-white shadow-lg transition-all hover:bg-yellow-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 animate-fade-in-up"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
};

export default Footer;