import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/sections/HeroSection";
import OffersBanner from "../components/sections/OffersBanner";
import ProductGrid from "../components/products/ProductGrid";
import QualitySection from "../components/sections/QualitySection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import NewsletterSection from "../components/sections/NewsletterSection";
import Footer from "../components/layout/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <OffersBanner />
      <HeroSection />
      <ProductGrid />
      <QualitySection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </>
  );
};

export default Home;