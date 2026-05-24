import { FaShoppingCart, FaEye, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useCart from "../../../hooks/useCart";
import useAuth from "../../../hooks/useAuth";
import useWishlist from "../../../hooks/useWishlist";

const ProductCard = ({ product, openModal }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product);
  };

  const handleToggleWishlist = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
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

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3 opacity-0 transition duration-300 group-hover:opacity-100">
          <button
            onClick={() => openModal(product)}
            className="rounded-full bg-white p-4 shadow-lg transition hover:bg-yellow-700 hover:text-white"
          >
            <FaEye />
          </button>

          <button
            onClick={handleAddToCart}
            className="rounded-full bg-yellow-700 p-4 text-white shadow-lg transition hover:bg-yellow-800"
          >
            <FaShoppingCart />
          </button>

          {user ? (
            <button
              onClick={handleToggleWishlist}
              className="rounded-full bg-white p-4 text-yellow-700 shadow-lg transition hover:bg-yellow-700 hover:text-white"
            >
              {isWishlisted ? <FaRegHeart /> : <FaHeart />}
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="rounded-full bg-white p-4 text-yellow-700 shadow-lg transition hover:bg-yellow-700 hover:text-white"
            >
              <FaHeart />
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-700">
            {product.category || "Premium"}
          </p>
          {product.rating && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              {product.rating} ★
            </span>
          )}
        </div>

        <h3 className="mt-3 text-2xl font-semibold text-gray-900">
          {product.name}
        </h3>

        <p className="mt-4 line-clamp-3 text-gray-600 min-h-[4.5rem]">
          {product.description}
        </p>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div>
            <span className="text-3xl font-bold text-yellow-800">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="ml-3 text-sm text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-800"
            >
              <FaShoppingCart /> {user ? "Add to Cart" : "Login to Buy"}
            </button>
            {user ? (
              <button
                onClick={handleToggleWishlist}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${isWishlisted ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-white text-yellow-700 shadow-sm hover:bg-yellow-50"}`}
              >
                {isWishlisted ? "Saved" : "Save"}
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-yellow-700 shadow-sm transition hover:bg-yellow-50"
              >
                <FaHeart /> Login to Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
