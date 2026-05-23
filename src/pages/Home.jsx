import MainLayout from "../layouts/MainLayout";

import HeroSection from "../components/sections/HeroSection";
import OffersBanner from "../components/sections/OffersBanner";
import ProductGrid from "../components/products/ProductGrid";
import QualitySection from "../components/sections/QualitySection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import NewsletterSection from "../components/sections/NewsletterSection";

import CartSidebar from "../components/cart/CartSidebar";

const Home = () => {
  return (
    <MainLayout>
      <OffersBanner />
      <HeroSection />
      <ProductGrid />
      <QualitySection />
      <TestimonialsSection />
      <NewsletterSection />
      <CartSidebar />
    </MainLayout>
  );
};

export default Home;