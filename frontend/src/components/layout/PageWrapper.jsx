// src/components/layout/PageWrapper.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Section2 from "../common/Section2";
import Navbar from "../common/Navbar";

const PageWrapper = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null);
  const mainRef = useRef(null);
  const location = useLocation();

  // Update header height with debounce for performance
  const updateHeaderHeight = useCallback(() => {
    if (headerRef.current) {
      const newHeight = headerRef.current.offsetHeight;
      if (newHeight !== headerHeight) {
        setHeaderHeight(newHeight);
      }
    }
  }, [headerHeight]);

  // Handle scroll detection for nav styling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Optimized resize handler with debounce
  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateHeaderHeight();
      }, 150);
    };
    
    updateHeaderHeight();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [updateHeaderHeight]);

  // Page transition effect on route change
  useEffect(() => {
    setIsPageTransitioning(true);
    const timer = setTimeout(() => {
      setIsPageTransitioning(false);
      // Scroll to top with smooth behavior on route change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Intersection Observer for lazy loading content below the fold
  useEffect(() => {
    if (!mainRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('content-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    
    const contentElements = mainRef.current.querySelectorAll('.lazy-content');
    contentElements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, [children]);

  // Handle keyboard navigation for skip to content
  const handleSkipToContent = (e) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        onClick={handleSkipToContent}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-yellow-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        Skip to main content
      </a>

      {/* Header Section with scroll shadow effect */}
      <div 
        ref={headerRef} 
        className={`sticky top-0 z-40 transition-shadow duration-300 ${
          isScrolled ? 'shadow-lg' : ''
        }`}
      >
        <Section2 />
        <Navbar />
      </div>

      {/* Main Content with smooth transitions */}
      <main
        ref={mainRef}
        id="main-content"
        tabIndex="-1"
        className="focus:outline-none"
        style={{ 
          paddingTop: `${headerHeight}px`,
          minHeight: 'calc(100vh - 100px)'
        }}
      >
        <div className={`overflow-hidden transition-opacity duration-300 ${
          isPageTransitioning ? 'opacity-50' : 'opacity-100'
        }`}>
          {/* Page transition overlay */}
          {isPageTransitioning && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm pointer-events-none">
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-200 border-t-yellow-600"></div>
                <p className="text-sm font-medium text-gray-600 animate-pulse">Loading...</p>
              </div>
            </div>
          )}
          
          {/* Children with fade-in animation */}
          <div className="animate-fade-in-up">
            {children}
          </div>
        </div>
      </main>

      {/* Optional: Scroll progress indicator */}
      <div className="fixed top-0 left-0 z-50 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-150"
        style={{ 
          width: `${(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`,
          opacity: isScrolled ? 1 : 0
        }}
      />
    </>
  );
};

export default PageWrapper;