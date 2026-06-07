import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, Plus, Minus, ChevronRight, Share2 } from 'lucide-react';
import { productAPI, wishlistAPI } from '../api/services';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { Button, StarRating, Spinner, Badge } from '../components/ui';
import { formatPrice, formatDate } from '../utils/helpers';
import ProductCard from '../components/product/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getOne(id);
      setProduct(data.product);
      if (data.product.variants?.length) setSelectedVariant(data.product.variants[0]);
      const relRes = await productAPI.getAll({ category: data.product.category._id, limit: 4 });
      setRelated(relRes.data.products.filter(p => p._id !== id));
    } catch {}
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please login'); return; }
    if (user?.role !== 'customer') return;
    await addToCart(product._id, quantity, selectedVariant?.name || '');
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login'); return; }
    try {
      const { data } = await wishlistAPI.toggle(product._id);
      setWishlisted(data.added);
      toast.success(data.message);
    } catch {}
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) { toast.error('Please write a comment'); return; }
    setSubmittingReview(true);
    try {
      await productAPI.addReview(product._id, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewComment('');
      setReviewRating(5);
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
    setSubmittingReview(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><Spinner size="lg" /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center pt-20 text-gray-500">Product not found</div>;

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 py-4 mb-4">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/shop" className="hover:text-gray-900 transition-colors">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/shop?category=${product.category._id}`} className="hover:text-gray-900 transition-colors">{product.category.name}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
              <img src={product.images?.[selectedImage]?.url || 'https://via.placeholder.com/600x600?text=No+Image'}
                alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-primary-500 shadow-md' : 'border-gray-100 hover:border-gray-300'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="py-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <Link to={`/shop?category=${product.category._id}`} className="text-sm text-primary-600 font-medium hover:underline">{product.category.name}</Link>
                {product.brand && <span className="text-xs text-gray-400 ml-2">by {product.brand}</span>}
              </div>
              <button onClick={handleWishlist} className={`p-2 rounded-xl border transition-all ${wishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 hover:border-red-200 hover:text-red-500'}`}>
                <Heart className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={Math.round(product.rating)} size="md" />
              <span className="text-sm font-medium text-gray-700">{product.rating?.toFixed(1)}</span>
              <span className="text-sm text-gray-400">({product.numReviews} reviews)</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-400">{product.sold} sold</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-gray-900">{formatPrice(price)}</span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
                  <Badge color="red">{product.discountPercent}% OFF</Badge>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product.shortDescription || product.description?.substring(0, 200)}</p>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">Select Size/Variant</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button key={v._id} onClick={() => setSelectedVariant(v)}
                      disabled={v.stock === 0}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${selectedVariant?._id === v._id ? 'border-primary-500 bg-primary-50 text-primary-700' : v.stock === 0 ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-700 hover:border-primary-200'}`}>
                      {v.name} — {formatPrice(v.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-8">
                <p className="text-sm font-semibold text-gray-700">Quantity</p>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"><Minus className="w-4 h-4" /></button>
                  <span className="px-5 py-2 font-bold text-lg min-w-[3rem] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
                <span className="text-sm text-gray-500">{product.stock} available</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              {product.stock > 0 ? (
                <>
                  <Button onClick={handleAddToCart} size="lg" className="flex-1">
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </Button>
                  <Button variant="dark" size="lg" className="flex-1">Buy Now</Button>
                </>
              ) : (
                <div className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold text-center rounded-2xl">Out of Stock</div>
              )}
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
              {[
                { icon: Truck, text: 'Free delivery on orders above ₹500', sub: 'Estimated 3-5 days' },
                { icon: Shield, text: 'Secure payment', sub: 'SSL encrypted checkout' },
                { icon: RotateCcw, text: 'Easy 7-day returns', sub: 'No questions asked' },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-primary-600 shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-gray-800">{text}</span>
                    <span className="text-xs text-gray-500 ml-2">{sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description & Reviews Tabs */}
        <div className="mb-16">
          <div className="border-b border-gray-100 mb-8">
            <div className="flex gap-8">
              {['Description', `Reviews (${product.numReviews})`].map((tab, i) => (
                <button key={tab} className="pb-3 text-sm font-semibold border-b-2 transition-colors border-primary-600 text-primary-600">
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Description */}
            <div>
              <h3 className="font-display font-bold text-xl mb-4">Product Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {product.tags.map(tag => <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{tag}</span>)}
                </div>
              )}
            </div>

            {/* Reviews */}
            <div>
              <h3 className="font-display font-bold text-xl mb-4">Customer Reviews</h3>
              
              {/* Rating Summary */}
              <div className="flex items-center gap-6 bg-gray-50 rounded-2xl p-5 mb-6">
                <div className="text-center">
                  <div className="text-5xl font-black text-gray-900">{product.rating?.toFixed(1)}</div>
                  <StarRating rating={Math.round(product.rating)} size="md" />
                  <p className="text-xs text-gray-500 mt-1">{product.numReviews} reviews</p>
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {product.reviews?.slice(0, 5).map((review) => (
                  <div key={review._id} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {review.name?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{review.name}</p>
                        <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>

              {/* Add Review */}
              {isAuthenticated && user?.role === 'customer' && (
                <form onSubmit={handleReviewSubmit} className="bg-gray-50 rounded-2xl p-5">
                  <h4 className="font-semibold text-sm mb-3">Write a Review</h4>
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1.5">Your Rating</p>
                    <StarRating rating={reviewRating} size="lg" interactive onRate={setReviewRating} />
                  </div>
                  <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none mb-3" rows={3} />
                  <Button type="submit" loading={submittingReview} size="sm">Submit Review</Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
