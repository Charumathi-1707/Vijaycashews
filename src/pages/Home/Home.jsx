import MainLayout from "../../layouts/MainLayout";

import Section1 from "./components/Section1";
import Section2 from "./components/Section2";
import Section3 from "./components/Section2";
import Section4 from "./components/Section3";
import Section5 from "./components/Section4";
import CartSidebar from "../Cart/components/CartSidebar";

const Home = () => {
  return (
    <MainLayout>
      
      <Section1 />
      <Section3 />
      <Section4 />
      <CartSidebar />
    </MainLayout>
  );
};

export default Home;