import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, Shield, RotateCcw, Star, ChevronRight, Zap, TrendingUp, Award } from 'lucide-react';
import { productAPI, categoryAPI } from '../api/services';
import ProductCard from '../components/product/ProductCard';
import { Spinner } from '../components/ui';

const HeroSlider = () => {
  const slides = [
    { title: 'Fresh Products', subtitle: 'Delivered to Your Door', desc: 'Shop the finest selection with guaranteed freshness and quality.', bg: 'from-orange-50 to-amber-50', accent: 'text-primary-600', img: '🛍️' },
    { title: 'Big Sale', subtitle: 'Up to 50% Off', desc: 'Limited time deals on premium products. Don\'t miss out!', bg: 'from-blue-50 to-indigo-50', accent: 'text-blue-600', img: '⚡' },
    { title: 'New Arrivals', subtitle: 'Just In This Week', desc: 'Explore the latest additions to our ever-growing catalog.', bg: 'from-green-50 to-emerald-50', accent: 'text-green-600', img: '✨' },
  ];
  const [current, setCurrent] = useState(0);
  useEffect(() => { const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 4000); return () => clearInterval(t); }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl h-[420px] lg:h-[500px]">
      {slides.map((slide, i) => (
        <div key={i} className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-all duration-700 ${i === current ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
          <div className="h-full flex items-center">
            <div className="max-w-7xl mx-auto px-8 lg:px-16 w-full grid lg:grid-cols-2 gap-8 items-center">
              <div className="animate-fade-in">
                <span className={`text-sm font-semibold uppercase tracking-wider ${slide.accent} mb-3 block`}>{slide.subtitle}</span>
                <h1 className="text-5xl lg:text-6xl font-display font-black text-gray-900 leading-tight mb-4">{slide.title}</h1>
                <p className="text-gray-600 text-lg mb-8 max-w-md">{slide.desc}</p>
                <div className="flex items-center gap-4">
                  <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl transition-all duration-200 hover:shadow-xl active:scale-95">
                    Shop Now <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/shop?featured=true" className="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1 transition-colors">
                    View Deals <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex justify-center items-center text-[180px]">{slide.img}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2 bg-gray-900' : 'w-2 h-2 bg-gray-400'}`} />
        ))}
      </div>
    </div>
  );
};

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, featRes, newRes] = await Promise.all([
          categoryAPI.getAll(),
          productAPI.getAll({ featured: true, limit: 8 }),
          productAPI.getAll({ sort: 'newest', limit: 8 }),
        ]);
        setCategories(catRes.data.categories.slice(0, 8));
        setFeaturedProducts(featRes.data.products);
        setNewProducts(newRes.data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const features = [
    { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹500', color: 'text-blue-600 bg-blue-50' },
    { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions', color: 'text-green-600 bg-green-50' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '7-day hassle-free returns', color: 'text-orange-600 bg-orange-50' },
    { icon: Award, title: 'Best Quality', desc: 'Certified quality products', color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <HeroSlider />
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-500 mt-1">Explore our wide range of products</p>
            </div>
            <Link to="/categories" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 text-sm">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <Link key={cat._id} to={`/shop?category=${cat._id}`}
                className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center overflow-hidden">
                  {cat.image ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" /> : <ShoppingBag className="w-7 h-7 text-primary-500" />}
                </div>
                <span className="text-xs font-semibold text-gray-700 text-center group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 text-sm">Hand-picked favorites just for you</p>
            </div>
          </div>
          <Link to="/shop?featured=true" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 text-sm">
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary-400" />
              <span className="text-primary-400 font-semibold text-sm uppercase tracking-wider">Limited Offer</span>
            </div>
            <h2 className="text-4xl font-display font-black text-white mb-3">Get 20% Off Your<br />First Order</h2>
            <p className="text-gray-400 mb-6 max-w-md">Use code WELCOME20 at checkout. Valid for new customers only.</p>
            <div className="flex items-center gap-4">
              <code className="px-4 py-2 bg-white/10 text-white font-mono font-bold rounded-xl text-lg tracking-wider border border-white/20">WELCOME20</code>
              <Link to="/shop" className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-xl active:scale-95 flex items-center gap-2">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="text-[120px] hidden lg:block">🎁</div>
        </div>
      </section>

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900">New Arrivals</h2>
              <p className="text-gray-500 text-sm">The latest additions to our catalog</p>
            </div>
            <Link to="/shop?sort=newest" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 text-sm">
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {newProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-2">What Customers Say</h2>
          <p className="text-gray-500 text-center mb-10">Real reviews from real customers</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Priya S.', rating: 5, text: 'Amazing quality products and super fast delivery. Will definitely shop again!', avatar: 'PS' },
              { name: 'Rahul M.', rating: 5, text: 'The best online shopping experience I\'ve had. Great customer service too!', avatar: 'RM' },
              { name: 'Ananya K.', rating: 4, text: 'Great prices and nice packaging. The products arrived well before the estimated date.', avatar: 'AK' },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">{t.avatar}</div>
                  <span className="font-semibold text-sm text-gray-900">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
