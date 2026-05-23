import { useEffect, useState } from "react";

import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import ProductModal from "./ProductModal";

import {
  fetchProducts,
} from "../../services/googleSheets.service";

const ProductGrid = () => {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedFilter, setSelectedFilter] =
    useState("all");

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  // FETCH PRODUCTS
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data =
          await fetchProducts();

        // Convert prices to numbers
        const formattedData =
          data.map((item) => ({
            ...item,

            price: Number(item.price),

            originalPrice: Number(
              item.originalPrice
            ),
          }));

        setProducts(formattedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // FILTER PRODUCTS
  const filteredProducts =
    selectedFilter === "all"
      ? products
      : products.filter(
          (product) =>
            product.filter ===
            selectedFilter
        );

  // LOADING
  if (loading) {
    return (
      <section className="py-32 text-center">

        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-yellow-700 border-t-transparent" />

        <p className="mt-6 text-lg text-gray-500">
          Loading Products...
        </p>
      </section>
    );
  }

  return (
    <section
      id="products"
      className="bg-white px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-16 text-center">

          <p className="font-semibold uppercase tracking-[4px] text-yellow-700">
            Our Products
          </p>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">
            Premium Cashew Collection
          </h2>
        </div>

        {/* Filters */}
        <ProductFilters
          selectedFilter={selectedFilter}
          setSelectedFilter={
            setSelectedFilter
          }
        />

        {/* Products */}
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {filteredProducts.length >
          0 ? (
            filteredProducts.map(
              (product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                  openModal={
                    setSelectedProduct
                  }
                />
              )
            )
          ) : (
            <div className="col-span-full text-center text-gray-500">

              No products found.
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          closeModal={() =>
            setSelectedProduct(null)
          }
        />
      )}
    </section>
  );
};

export default ProductGrid;