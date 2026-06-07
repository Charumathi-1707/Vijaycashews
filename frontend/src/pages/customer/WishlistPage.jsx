import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { wishlistAPI } from '../../api/services';
import useCartStore from '../../store/cartStore';
import { Spinner, Button } from '../../components/ui';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartStore();

  useEffect(() => { fetchWishlist(); }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await wishlistAPI.get();
      setWishlist(data.wishlist.products || []);
    } catch {}
    setLoading(false);
  };

  const handleRemove = async (productId) => {
    try {
      await wishlistAPI.toggle(productId);
      setWishlist(prev => prev.filter(p => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch {}
  };

  const handleMoveToCart = async (product) => {
    await addToCart(product._id);
    await handleRemove(product._id);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-500 text-sm">{wishlist.length} items saved</p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-xl font-display font-bold mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Save products you love to buy later</p>
            <Link to="/shop"><Button size="lg">Explore Products</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {wishlist.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <Link to={`/product/${product._id}`} className="block aspect-square overflow-hidden relative">
                  <img src={product.images?.[0]?.url || 'https://via.placeholder.com/300'} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                  )}
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product._id}`} className="font-semibold text-sm text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 block mb-2">{product.name}</Link>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-bold text-gray-900">{formatPrice(product.discountPrice || product.price)}</span>
                    {product.discountPrice && <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleMoveToCart(product)} disabled={product.stock === 0}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-100 disabled:text-gray-400 text-white text-xs font-semibold rounded-xl transition-colors">
                      <ShoppingCart className="w-3.5 h-3.5" /> {product.stock === 0 ? 'Unavailable' : 'Add to Cart'}
                    </button>
                    <button onClick={() => handleRemove(product._id)}
                      className="p-2 border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
