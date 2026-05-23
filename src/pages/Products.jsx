import MainLayout from "../layouts/MainLayout";

import ProductGrid from "../components/products/ProductGrid";

const Products = () => {
  return (
    <MainLayout>
      <div className="pt-28">
        <ProductGrid />
      </div>
    </MainLayout>
  );
};

export default Products;