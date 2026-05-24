import { useState, useEffect, useRef } from "react";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaStore,
  FaTruck,
  FaClipboardList,
  FaHeart,
  FaUserCog,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import navigation from "../../data/navigation";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";

const roleNavigation = {
  customer: [
    { label: "Products", path: "/products", icon: FaStore },
    { label: "Cart", path: "/cart", icon: FaShoppingCart },
    { label: "My Orders", path: "/my-orders", icon: FaClipboardList },
    { label: "Wishlist", path: "/wishlist", icon: FaHeart },
    { label: "Profile", path: "/profile", icon: FaUserCircle },
  ],
  delivery: [
    { label: "Delivery", path: "/delivery", icon: FaTruck },
    { label: "Profile", path: "/profile", icon: FaUserCircle },
  ],
  admin: [
    { label: "Products", path: "/products", icon: FaStore },
    { label: "Orders", path: "/admin/orders", icon: FaClipboardList },
    { label: "Profile", path: "/profile", icon: FaUserCog },
  ],
};

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems, setCartOpen } = useCart();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenu(false);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && mobileMenu) {
        setMobileMenu(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenu]);

  const navigationItems = user
    ? roleNavigation[user.role] || roleNavigation.customer
    : navigation;

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-yellow-200 bg-white/95 shadow-lg backdrop-blur-xl"
            : "border-b border-yellow-100 bg-white/90 backdrop-blur-lg"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* LOGO with hover animation */}
          <Link
            to="/"
            className="group relative text-2xl sm:text-3xl font-bold transition-all duration-300"
          >
            <span className="bg-gradient-to-r from-yellow-700 to-yellow-800 bg-clip-text text-transparent">
              Vijay Cashews
            </span>
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-yellow-600 to-yellow-800 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden items-center gap-1 lg:gap-2 md:flex">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`relative flex items-center gap-2 rounded-lg px-3 py-2 font-medium transition-all duration-200 ${
                    active
                      ? "bg-yellow-50 text-yellow-800"
                      : "text-gray-700 hover:bg-yellow-50/50 hover:text-yellow-700"
                  }`}
                >
                  {Icon && <Icon className="text-sm sm:text-base" />}
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-600 rounded-full"></span>
                  )}
                </Link>
              );
            })}

            {/* User Menu */}
            {user ? (
              <div className="relative ml-2">
                <button
                  onClick={() =>
                    setActiveDropdown(activeDropdown === "user" ? null : "user")
                  }
                  className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-gray-700 transition-all hover:bg-yellow-50/50 hover:text-yellow-700"
                >
                  <FaUserCircle className="text-xl" />
                  <span className="max-w-[120px] truncate">
                    Hi, {user.name || user.email?.split("@")[0]}
                  </span>
                </button>

                {activeDropdown === "user" && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5">
                    <div className="p-1">
                      <button
                        onClick={() => {
                          logout();
                          navigate("/");
                          setActiveDropdown(null);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 ml-2">
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-gray-700 transition-all hover:bg-yellow-50/50 hover:text-yellow-700"
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-700 px-4 py-2 font-medium text-white shadow-md transition-all hover:shadow-lg hover:from-yellow-700 hover:to-yellow-800"
                >
                  <FaUserPlus />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT SECTION - Cart & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user && user.role === "customer" && (
              <button
                onClick={() => setCartOpen(true)}
                className="group relative rounded-full p-2 transition-all duration-200 hover:bg-yellow-50"
                aria-label="Shopping cart"
              >
                <FaShoppingCart className="text-xl sm:text-2xl text-gray-700 transition-transform group-hover:scale-110" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 px-1.5 text-xs font-bold text-white shadow-md animate-pulse">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              className="relative h-10 w-10 rounded-lg text-2xl text-gray-700 transition-all hover:bg-yellow-50 md:hidden"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label={mobileMenu ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenu}
            >
              {mobileMenu ? <FaTimes className="mx-auto" /> : <FaBars className="mx-auto" />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden"
            onClick={() => setMobileMenu(false)}
          />
          
          {/* Menu Panel */}
          <div
            ref={mobileMenuRef}
            className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-2xl md:hidden animate-slide-in-right"
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <span className="text-xl font-bold text-yellow-800">Menu</span>
              <button
                onClick={() => setMobileMenu(false)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* User Info (if logged in) */}
            {user && (
              <div className="border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-white p-4">
                <div className="flex items-center gap-3">
                  <FaUserCircle className="text-3xl text-yellow-700" />
                  <div>
                    <p className="font-semibold text-gray-800">{user.name || "User"}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="flex flex-col p-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all ${
                      active
                        ? "bg-yellow-50 text-yellow-800"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {Icon && <Icon className="text-lg" />}
                    <span>{item.label}</span>
                    {active && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-yellow-600"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Auth Actions */}
            <div className="border-t border-gray-100 p-4 mt-auto">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenu(false);
                    navigate("/");
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 font-medium text-red-600 transition-all hover:bg-red-100"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50"
                  >
                    <FaSignInAlt />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-700 px-4 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg"
                  >
                    <FaUserPlus />
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;