import { FaShoppingCart, FaEye } from "react-icons/fa";
import useCart from "../../../hooks/useCart";

const ProductCard = ({ product, openModal }) => {
  const { addToCart } = useCart();

  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl">

      {/* Image */}
      <div className="relative overflow-hidden bg-yellow-50">

        {product.badge && (
          <span className="absolute right-4 top-4 z-10 rounded-full bg-yellow-700 px-4 py-1 text-xs font-semibold text-white">
            {product.badge}
          </span>
        )}

        <img
          src={product.image}
          alt={product.name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
        />

        {/* Actions */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3 opacity-0 transition duration-300 group-hover:opacity-100">

          <button
            onClick={() => openModal(product)}
            className="rounded-full bg-white p-4 shadow-lg transition hover:bg-yellow-700 hover:text-white"
          >
            <FaEye />
          </button>

          <button
            onClick={() => addToCart(product)}
            className="rounded-full bg-yellow-700 p-4 text-white shadow-lg transition hover:bg-yellow-800"
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">

        <p className="text-sm font-semibold uppercase tracking-wide text-yellow-700">
          {product.category}
        </p>

        <h3 className="mt-2 text-2xl font-bold text-gray-900">
          {product.name}
        </h3>

        <p className="mt-4 line-clamp-3 text-gray-600">
          {product.description}
        </p>

        <div className="mt-6 flex items-center justify-between">

          <div>
            <span className="text-3xl font-bold text-yellow-800">
              ₹{product.price}
            </span>

            {product.originalPrice && (
              <span className="ml-3 text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="rounded-full bg-yellow-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-800"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;