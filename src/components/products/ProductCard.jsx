import { FaShoppingCart } from "react-icons/fa";

const ProductCard = ({ product }) => {
  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
      
      <div className="bg-yellow-50 p-6">
        <img
          src={product.image}
          alt={product.name}
          className="h-64 w-full object-cover"
        />
      </div>

      <div className="p-6">
        <p className="text-sm font-semibold uppercase text-yellow-700">
          {product.category}
        </p>

        <h3 className="mt-2 text-2xl font-bold">
          {product.name}
        </h3>

        <p className="mt-3 text-gray-600">
          {product.description}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <h4 className="text-2xl font-bold text-yellow-800">
            ₹{product.price}
          </h4>

          <button className="rounded-full bg-yellow-700 p-4 text-white">
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;