import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Search, Image, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { productAPI, categoryAPI } from '../../api/services';
import { Spinner, Pagination, Modal, Button, Badge } from '../../components/ui';
import { formatPrice, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', description: '', shortDescription: '', price: '', discountPrice: '', stock: '', sku: '', brand: '', category: '', tags: '', isFeatured: false, isActive: true };

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [formModal, setFormModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data.categories));
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
  }, [page, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getAdminAll({ page, limit: 12, search });
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch {}
    setLoading(false);
  };

  const openCreate = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setImageFiles([]);
    setImagePreviews([]);
    setFormModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name, description: product.description, shortDescription: product.shortDescription || '',
      price: product.price, discountPrice: product.discountPrice || '',
      stock: product.stock, sku: product.sku || '', brand: product.brand || '',
      category: product.category?._id || '', tags: product.tags?.join(', ') || '',
      isFeatured: product.isFeatured, isActive: product.isActive,
    });
    setImageFiles([]);
    setImagePreviews(product.images || []);
    setFormModal(true);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(f => ({ url: URL.createObjectURL(f), isNew: true, file: f }));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreviewImage = async (idx) => {
    const img = imagePreviews[idx];
    if (!img.isNew && img.publicId && editProduct) {
      try { await productAPI.deleteImage(editProduct._id, img.publicId); } catch {}
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    setImageFiles(prev => prev.filter((_, i) => {
      const newImgs = imagePreviews.filter(p => p.isNew);
      return i !== newImgs.findIndex((n, ni) => ni === idx - imagePreviews.filter(p => !p.isNew).length);
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock || !form.category) {
      toast.error('Please fill all required fields'); return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      imageFiles.forEach(f => fd.append('images', f));

      if (editProduct) {
        await productAPI.update(editProduct._id, fd);
        toast.success('Product updated!');
      } else {
        await productAPI.create(fd);
        toast.success('Product created!');
      }
      setFormModal(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productAPI.delete(deleteModal._id);
      toast.success('Product deleted');
      setDeleteModal(null);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
    setDeleting(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">{total} products total</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Add Product</Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]?.url || 'https://via.placeholder.com/40'} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1 max-w-[180px]">{p.name}</p>
                          {p.isFeatured && <span className="text-[10px] text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded-full font-semibold">Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-xs">{p.category?.name}</td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900">{formatPrice(p.discountPrice || p.price)}</div>
                      {p.discountPrice && <div className="text-xs text-gray-400 line-through">{formatPrice(p.price)}</div>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-bold text-sm ${p.stock <= 10 ? 'text-red-600' : p.stock <= 50 ? 'text-orange-600' : 'text-green-600'}`}>{p.stock}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-sm">⭐ {p.rating?.toFixed(1)} ({p.numReviews})</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteModal(p)} className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No products found</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Pagination page={page} pages={pages} onPageChange={setPage} />

      {/* Product Form Modal */}
      <Modal isOpen={formModal} onClose={() => setFormModal(false)} title={editProduct ? 'Edit Product' : 'Add New Product'} size="xl">
        <div className="space-y-5">
          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Images</label>
            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((img, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={img.url} alt="" className="w-full h-full object-cover rounded-xl border border-gray-200" />
                  <button onClick={() => removePreviewImage(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-400 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-primary-500 transition-colors">
                <Image className="w-5 h-5" />
                <span className="text-[10px]">Add</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Enter product name" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Brand name" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="0" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
              <input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="0" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="0" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="SKU code" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Brief description" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="Detailed product description" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="tag1, tag2, tag3" />
            </div>

            <div className="flex items-center gap-6 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 accent-primary-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Featured Product</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-primary-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setFormModal(false)} className="flex-1">Cancel</Button>
            <Button loading={saving} onClick={handleSave} className="flex-1">{editProduct ? 'Update Product' : 'Create Product'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Product">
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete <span className="font-bold text-gray-900">"{deleteModal?.name}"</span>? This action cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteModal(null)} className="flex-1">Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete} className="flex-1">Delete Product</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Missing import fix
function Package({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" /></svg>; }
