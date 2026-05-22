import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Whole Cashews W320",
    category: "Premium",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1601302074001-9b1c3a6e6da4?w=600",
    description: "Premium export quality whole cashews.",
  },
];

const ProductGrid = () => {
  return (
    <section id="products" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        
        <div className="mb-14 text-center">
          <p className="font-semibold uppercase tracking-widest text-yellow-700">
            Our Products
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            Premium Collection
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
