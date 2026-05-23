import { FaTimes, FaShoppingCart } from "react-icons/fa";
import useCart from "../../hooks/useCart";

const ProductModal = ({ product, closeModal }) => {
  const { addToCart } = useCart();

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-6">

      <div className="relative grid max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">

        {/* Close */}
        <button
          onClick={closeModal}
          className="absolute right-5 top-5 z-10 rounded-full bg-gray-100 p-3 transition hover:bg-red-500 hover:text-white"
        >
          <FaTimes />
        </button>

        {/* Image */}
        <div className="bg-yellow-50 p-10">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full rounded-2xl object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-10">

          <p className="font-semibold uppercase tracking-wide text-yellow-700">
            {product.category}
          </p>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">
            {product.name}
          </h2>

          <div className="mt-6 flex items-center gap-4">

            <span className="text-4xl font-bold text-yellow-800">
              ₹{product.price}
            </span>

            <span className="text-xl text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
          </div>

          <p className="mt-8 leading-8 text-gray-600">
            {product.description}
          </p>

          <button
            onClick={() => {
              addToCart(product);
              closeModal();
            }}
            className="mt-10 flex items-center gap-3 rounded-full bg-yellow-700 px-8 py-4 font-semibold text-white transition hover:bg-yellow-800"
          >
            <FaShoppingCart />
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;