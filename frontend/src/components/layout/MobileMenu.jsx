import { useEffect, useRef } from "react";
import { FaTimes, FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

const MobileMenu = ({
  navigation,
  open,
  onClose,
  user = null,
  onLogout = null,
}) => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const startY = useRef(0);

  // Close menu on route change
  useEffect(() => {
    if (open && onClose) {
      onClose();
    }
  }, [location.pathname]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open && onClose) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Handle swipe to close
  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!menuRef.current) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    if (diff > 50) {
      if (onClose) onClose();
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    if (onClose) onClose();
    navigate("/");
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        ref={menuRef}
        className="fixed right-0 top-0 z-50 h-full w-full max-w-[85vw] bg-white shadow-2xl md:hidden animate-slide-in-right"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        role="dialog"
        aria-label="Mobile navigation menu"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-white p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-700 to-yellow-800 bg-clip-text text-transparent">
              Menu
            </span>
            <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
              {navigation.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-600 transition-all hover:bg-gray-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            aria-label="Close menu"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* User Section (if logged in) */}
        {user && (
          <div className="border-b border-gray-100 bg-gradient-to-r from-yellow-50/50 to-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-600 to-yellow-700 text-white shadow-md">
                <FaUserCircle className="text-2xl" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {user.name || "User"}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <span className="mt-1 inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium capitalize text-yellow-800">
                  {user.role || "customer"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {navigation.map((item, index) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left
                    transition-all duration-200
                    ${isActive 
                      ? "bg-yellow-50 text-yellow-800 font-semibold" 
                      : "text-gray-700 hover:bg-gray-50"
                    }
                    animate-fade-in-up
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {Icon && (
                    <Icon className={`text-lg ${isActive ? "text-yellow-700" : "text-gray-500"} transition-transform group-hover:scale-110`} />
                  )}
                  <span className="flex-1 text-base">
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-yellow-600 animate-pulse" />
                  )}
                  <span className="absolute right-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Auth Actions Section */}
        <div className="border-t border-gray-100 bg-gray-50/50 p-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 font-medium text-red-600 transition-all hover:bg-red-100 active:scale-95"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition-all hover:border-yellow-300 hover:bg-yellow-50 active:scale-95"
              >
                <FaSignInAlt />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-700 px-4 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg hover:from-yellow-700 hover:to-yellow-800 active:scale-95"
              >
                <FaUserPlus />
                <span>Create Account</span>
              </Link>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="border-t border-gray-100 bg-white p-3 text-center">
          <p className="text-xs text-gray-400">
            Vijay Cashews © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;