import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, List } from 'lucide-react';
import { productAPI, categoryAPI } from '../api/services';
import ProductCard from '../components/product/ProductCard';
import { Spinner, Pagination } from '../components/ui';
import { debounce } from '../utils/helpers';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
    featured: searchParams.get('featured') || '',
    page: Number(searchParams.get('page')) || 1,
  };

  useEffect(() => { categoryAPI.getAll().then(r => setCategories(r.data.categories)); }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams.toString()]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getAll({ ...filters, limit: 12 });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch {}
    setLoading(false);
  };

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});

  const sortOptions = [
    { value: '', label: 'Latest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.featured || filters.search;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="py-8 border-b border-gray-100 mb-6">
          <h1 className="text-4xl font-display font-bold text-gray-900">
            {filters.search ? `Results for "${filters.search}"` : filters.featured ? '⚡ Featured Products' : 'Shop All Products'}
          </h1>
          <p className="text-gray-500 mt-1">{pagination.total || 0} products found</p>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className={`shrink-0 w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-gray-900">Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-3">Category</h4>
                <div className="space-y-1.5">
                  <button onClick={() => updateFilter('category', '')}
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${!filters.category ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button key={cat._id} onClick={() => updateFilter('category', cat._id)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${filters.category === cat._id ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-3">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                  <span className="text-gray-400 text-sm">—</span>
                  <input type="number" placeholder="Max" value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
              </div>

              {/* Featured */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={!!filters.featured}
                    onChange={(e) => updateFilter('featured', e.target.checked ? 'true' : '')}
                    className="w-4 h-4 rounded accent-primary-600" />
                  <span className="text-sm font-medium text-gray-700">Featured Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
              <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>

              <div className="flex items-center gap-3 ml-auto">
                {/* View Mode */}
                <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-xl p-1">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort */}
                <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Active Filter Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.search && <span className="flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">Search: {filters.search} <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('search', '')} /></span>}
                {filters.category && <span className="flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">{categories.find(c => c._id === filters.category)?.name} <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('category', '')} /></span>}
                {filters.featured && <span className="flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">Featured <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('featured', '')} /></span>}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5' : 'space-y-4'}>
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
                <Pagination page={pagination.page} pages={pagination.pages} onPageChange={(p) => updateFilter('page', p)} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
