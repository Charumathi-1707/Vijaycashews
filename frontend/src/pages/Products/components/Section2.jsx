import { useMemo, useState } from "react";
import { FaTimes, FaShoppingCart, FaHeart, FaRegHeart, FaStar, FaPaperPlane, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useCart from "../../../hooks/useCart";
import useAuth from "../../../hooks/useAuth";
import useWishlist from "../../../hooks/useWishlist";
import { addProductReview } from "../../../services/read/product.service";
import FALLBACK_IMAGE from "../../../utils/imageFallback";

const Section2 = ({ product, closeModal }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviews, setReviews] = useState(product.reviews || []);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const productId = product.id || product._id;
  const isWishlisted = wishlistItems.some((item) => item.id === productId);
  const { isInCart } = useCart();
  const inCart = isInCart(productId);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!inCart) addToCart(product);
    closeModal();
  };

  const handleToggleWishlist = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
    closeModal();
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError("Please enter your review comment.");
      return;
    }

    setReviewLoading(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      const response = await addProductReview(product._id || product.id, {
        rating: reviewRating,
        comment: reviewComment,
        name: user.name || user.email,
      });

      setReviews(response.product.reviews || []);
      setReviewSuccess("Review submitted successfully.");
      setReviewComment("");
    } catch (err) {
      setReviewError(err.message || "Unable to submit review.");
      console.error(err);
    } finally {
      setReviewLoading(false);
    }
  };

  const avgRating = useMemo(() => {
    const total = reviews.reduce((sum, item) => sum + (item.rating || 0), 0);
    return reviews.length ? (total / reviews.length).toFixed(1) : 0;
  }, [reviews]);

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
            onError={(e)=>{e.target.onerror=null; e.target.src = FALLBACK_IMAGE}}
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

          <div className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Customer Reviews</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{avgRating} ★</p>
              </div>
              <p className="text-sm text-gray-500">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            </div>

            {reviews.length > 0 ? (
              <div className="mt-6 space-y-4">
                {reviews.slice(0, 4).map((review, index) => (
                  <div key={index} className="rounded-3xl bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">{review.name || 'Customer'}</p>
                        <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-600">
                        {Array.from({ length: 5 }, (_, starIndex) => (
                          <FaStar
                            key={starIndex}
                            className={starIndex < Math.round(review.rating) ? 'h-4 w-4' : 'h-4 w-4 text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-gray-500">Be the first to review this product.</p>
            )}

            <form onSubmit={handleSubmitReview} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Rating</span>
                  <select
                    value={reviewRating}
                    onChange={(event) => setReviewRating(Number(event.target.value))}
                    className="mt-2 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>{value} stars</option>
                    ))}
                  </select>
                </label>
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-yellow-700 px-6 py-4 text-sm font-semibold text-white transition hover:bg-yellow-800 disabled:opacity-60"
                >
                  {reviewLoading ? <FaSpinner className="animate-spin" /> : <><FaPaperPlane /> Submit Review</>}
                </button>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Your Review</span>
                <textarea
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  placeholder="Share your experience with this product..."
                />
              </label>
              {reviewError && <p className="text-sm text-red-600">{reviewError}</p>}
              {reviewSuccess && <p className="text-sm text-emerald-700">{reviewSuccess}</p>}
            </form>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-3 rounded-full bg-yellow-700 px-8 py-4 font-semibold text-white transition hover:bg-yellow-800"
            >
              <FaShoppingCart /> {user ? "Add To Cart" : "Login to Buy"}
            </button>

            {user ? (
              <button
                onClick={handleToggleWishlist}
                className={`flex items-center justify-center gap-3 rounded-full px-8 py-4 font-semibold transition ${isWishlisted ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-white text-yellow-700 shadow-sm hover:bg-yellow-50"}`}
              >
                {isWishlisted ? (
                  <>
                    <FaRegHeart /> Remove from Wishlist
                  </>
                ) : (
                  <>
                    <FaHeart /> Save to Wishlist
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-yellow-700 shadow-sm transition hover:bg-yellow-50"
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

export default Section2;