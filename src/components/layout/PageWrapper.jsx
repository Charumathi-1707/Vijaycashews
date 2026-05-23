// src/components/layout/PageWrapper.jsx
import { useEffect, useState, useRef } from "react";
import Section2 from "../common/Section2";
import Navbar from "../common/Navbar";

const PageWrapper = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
    
    // Handle window resize
    const handleResize = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div ref={headerRef}>
        <Section2 />
        <Navbar />
      </div>
      <main style={{ paddingTop: `${headerHeight}px` }}>
        <div className="overflow-hidden">
          {children}
        </div>
      </main>
    </>
  );
};

export default PageWrapper;