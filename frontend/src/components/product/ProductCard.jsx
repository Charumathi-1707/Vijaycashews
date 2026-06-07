import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import { wishlistAPI } from '../../api/services';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [wishlisted, setWishlisted] = useState(false);
  const [addingCart, setAddingCart] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return; }
    if (user?.role !== 'customer') return;
    setAddingCart(true);
    await addToCart(product._id);
    setAddingCart(false);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login'); return; }
    try {
      const { data } = await wishlistAPI.toggle(product._id);
      setWishlisted(data.added);
      toast.success(data.message);
    } catch {}
  };

  const img = product.images?.[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image';
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <Link to={`/product/${product._id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img src={img} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{product.discountPercent}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-bold text-sm px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <button onClick={handleWishlist}
            className={`w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition-colors ${wishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'}`}>
            <Heart className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <Link to={`/product/${product._id}`} onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary-600 transition-colors">
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Add */}
        {product.stock > 0 && user?.role === 'customer' && (
          <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
            <button onClick={handleAddToCart} disabled={addingCart}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
              <ShoppingCart className="w-4 h-4" />
              {addingCart ? 'Adding...' : 'Quick Add'}
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-primary-600 font-medium mb-1">{product.category?.name}</p>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors flex-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.numReviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-gray-900">{formatPrice(hasDiscount ? product.discountPrice : product.price)}</span>
            {hasDiscount && <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>}
          </div>
          {product.stock <= 10 && product.stock > 0 && (
            <span className="text-xs text-orange-600 font-medium">Only {product.stock} left</span>
          )}
        </div>
      </div>
    </Link>
  );
}
