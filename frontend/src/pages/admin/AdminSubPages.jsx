import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, UserPlus, Power, X } from 'lucide-react';
import { adminAPI, categoryAPI } from '../../api/services';
import { Spinner, Pagination, Modal, Button } from '../../components/ui';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

// ===== USERS PAGE =====
export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('customer');

  useEffect(() => { fetchUsers(); }, [page, roleFilter]);
  useEffect(() => { const t = setTimeout(fetchUsers, 400); return () => clearTimeout(t); }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers({ page, limit: 15, role: roleFilter, search });
      setUsers(data.users); setTotal(data.total); setPages(data.pages);
    } catch {}
    setLoading(false);
  };

  const handleToggle = async (id) => {
    try {
      await adminAPI.toggleUser(id);
      toast.success('User status updated');
      fetchUsers();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 text-sm">{total} users</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none bg-white">
          <option value="customer">Customers</option>
          <option value="admin">Admins</option>
          <option value="deliveryman">Delivery</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Name', 'Email', 'Phone', 'Joined', 'Status', 'Action'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-xl flex items-center justify-center text-sm font-bold shrink-0">
                          {u.name?.[0]}
                        </div>
                        <span className="font-medium text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{u.email}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{u.phone || '—'}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.isActive ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleToggle(u._id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${u.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>
                        <Power className="w-3.5 h-3.5" /> {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </div>
  );
}

// ===== DELIVERYMEN PAGE =====
export function AdminDeliverymenPage() {
  const [deliverymen, setDeliverymen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', vehicleNumber: '', vehicleType: 'bike', role: 'deliveryman' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchDeliverymen(); }, []);

  const fetchDeliverymen = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getDeliverymen();
      setDeliverymen(data.deliverymen);
    } catch {}
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) { toast.error('Fill required fields'); return; }
    setSaving(true);
    try {
      await adminAPI.createStaff(form);
      toast.success('Delivery person created!');
      setCreateModal(false);
      setForm({ name: '', email: '', password: '', phone: '', vehicleNumber: '', vehicleType: 'bike', role: 'deliveryman' });
      fetchDeliverymen();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Create failed');
    }
    setSaving(false);
  };

  const handleToggle = async (id) => {
    try { await adminAPI.toggleUser(id); toast.success('Status updated'); fetchDeliverymen(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display font-bold text-gray-900">Delivery Team</h1>
          <p className="text-gray-500 text-sm">{deliverymen.length} members</p></div>
        <Button onClick={() => setCreateModal(true)}><UserPlus className="w-4 h-4" /> Add Member</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <div className="col-span-3 flex justify-center py-12"><Spinner /></div> :
          deliverymen.map(dm => (
            <div key={dm._id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-2xl flex items-center justify-center font-black text-lg">
                    {dm.name?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{dm.name}</p>
                    <p className="text-xs text-gray-400">{dm.email}</p>
                  </div>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full mt-1 ${dm.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="text-gray-900 font-medium">{dm.phone || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Vehicle</span><span className="text-gray-900 font-medium capitalize">{dm.vehicleType || '—'} {dm.vehicleNumber ? `· ${dm.vehicleNumber}` : ''}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Deliveries</span><span className="font-bold text-primary-600">{dm.totalDeliveries}</span></div>
              </div>
              <button onClick={() => handleToggle(dm._id)}
                className={`mt-4 w-full py-2 rounded-xl text-xs font-semibold transition-colors ${dm.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                {dm.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))
        }
        {!loading && deliverymen.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🚚</p>
            <p className="font-semibold">No delivery personnel yet</p>
          </div>
        )}
      </div>

      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Add Delivery Person">
        <div className="grid grid-cols-2 gap-4">
          {[['name', 'Full Name', 'text', 'col-span-2'], ['email', 'Email', 'email', 'col-span-1'], ['password', 'Password', 'password', 'col-span-1'], ['phone', 'Phone', 'tel', 'col-span-1'], ['vehicleNumber', 'Vehicle Number', 'text', 'col-span-1']].map(([key, label, type, span]) => (
            <div key={key} className={span}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
            <select value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white">
              {['bike', 'scooter', 'car', 'van'].map(v => <option key={v} value={v} className="capitalize">{v}</option>)}
            </select>
          </div>
          <div className="col-span-2 flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setCreateModal(false)} className="flex-1">Cancel</Button>
            <Button loading={saving} onClick={handleCreate} className="flex-1">Create Account</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ===== CATEGORIES PAGE =====
export function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', sortOrder: 0, isActive: true });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { fetchCats(); }, []);

  const fetchCats = async () => {
    setLoading(true);
    try { const { data } = await categoryAPI.getAllAdmin(); setCategories(data.categories); }
    catch {} setLoading(false);
  };

  const openCreate = () => { setEditCat(null); setForm({ name: '', description: '', sortOrder: 0, isActive: true }); setImageFile(null); setFormModal(true); };
  const openEdit = (cat) => { setEditCat(cat); setForm({ name: cat.name, description: cat.description || '', sortOrder: cat.sortOrder || 0, isActive: cat.isActive }); setImageFile(null); setFormModal(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (editCat) { await categoryAPI.update(editCat._id, fd); toast.success('Category updated!'); }
      else { await categoryAPI.create(fd); toast.success('Category created!'); }
      setFormModal(false); fetchCats();
    } catch (error) { toast.error(error.response?.data?.message || 'Save failed'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try { await categoryAPI.delete(id); toast.success('Deleted'); fetchCats(); }
    catch (error) { toast.error(error.response?.data?.message || 'Delete failed'); }
    setDeleting(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm">{categories.length} categories</p></div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Add Category</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? <div className="col-span-4 flex justify-center py-12"><Spinner /></div> :
          categories.map(cat => (
            <div key={cat._id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
                {cat.image ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-4xl">🗂️</div>}
              </div>
              <p className="font-bold text-gray-900 mb-0.5">{cat.name}</p>
              <p className="text-xs text-gray-400 line-clamp-2 mb-3">{cat.description || 'No description'}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {cat.isActive ? 'Active' : 'Hidden'}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(cat)} className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(cat._id)} disabled={deleting === cat._id} className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <Modal isOpen={formModal} onClose={() => setFormModal(false)} title={editCat ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
            <div className="flex items-center gap-3">
              {(imageFile ? URL.createObjectURL(imageFile) : editCat?.image) && (
                <img src={imageFile ? URL.createObjectURL(imageFile) : editCat.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
              )}
              <label className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-primary-400 cursor-pointer transition-colors">
                Choose Image <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files[0])} />
              </label>
            </div>
          </div>
          {[['name', 'Name', 'text'], ['description', 'Description', 'text'], ['sortOrder', 'Sort Order', 'number']].map(([key, label, type]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
          ))}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-primary-600 rounded" />
            <span className="text-sm font-medium text-gray-700">Active (visible in store)</span>
          </label>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setFormModal(false)} className="flex-1">Cancel</Button>
            <Button loading={saving} onClick={handleSave} className="flex-1">Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ===== COUPONS PAGE =====
export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [form, setForm] = useState({ code: '', description: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxDiscountAmount: '', usageLimit: '', expiresAt: '', isActive: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCoupons(); }, []);
  const fetchCoupons = async () => {
    setLoading(true);
    try { const { data } = await adminAPI.getCoupons(); setCoupons(data.coupons); }
    catch {} setLoading(false);
  };

  const openCreate = () => { setEditCoupon(null); setForm({ code: '', description: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxDiscountAmount: '', usageLimit: '', expiresAt: '', isActive: true }); setFormModal(true); };
  const openEdit = (c) => { setEditCoupon(c); setForm({ ...c, expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().split('T')[0] : '' }); setFormModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.expiresAt) delete payload.expiresAt;
      if (editCoupon) { await adminAPI.updateCoupon(editCoupon._id, payload); toast.success('Coupon updated!'); }
      else { await adminAPI.createCoupon(payload); toast.success('Coupon created!'); }
      setFormModal(false); fetchCoupons();
    } catch (error) { toast.error(error.response?.data?.message || 'Save failed'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try { await adminAPI.deleteCoupon(id); toast.success('Deleted'); fetchCoupons(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-500 text-sm">{coupons.length} coupons</p></div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Create Coupon</Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Code', 'Type', 'Value', 'Usage', 'Min Order', 'Expires', 'Status', 'Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {coupons.map(c => (
                  <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-gray-900">{c.code}</td>
                    <td className="px-5 py-4 text-gray-600 capitalize">{c.discountType}</td>
                    <td className="px-5 py-4 font-bold text-primary-600">{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                    <td className="px-5 py-4 text-gray-600">{c.usedCount}/{c.usageLimit || '∞'}</td>
                    <td className="px-5 py-4 text-gray-500">₹{c.minOrderAmount || 0}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{c.expiresAt ? formatDate(c.expiresAt) : 'No expiry'}</td>
                    <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(c._id)} className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={formModal} onClose={() => setFormModal(false)} title={editCoupon ? 'Edit Coupon' : 'Create Coupon'}>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none font-mono" placeholder="SAVE20" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white">
              <option value="percentage">Percentage</option><option value="fixed">Fixed Amount</option>
            </select></div>
          {[['discountValue', `Value (${form.discountType === 'percentage' ? '%' : '₹'})`, '0'], ['minOrderAmount', 'Min Order (₹)', '0'], ['maxDiscountAmount', 'Max Discount (₹)', '0'], ['usageLimit', 'Usage Limit', '0']].map(([key, label, ph]) => (
            <div key={key}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type="number" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder={ph} /></div>
          ))}
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Expires On</label>
            <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
          <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. 20% off on orders above ₹500" /></div>
          <div className="col-span-2"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-primary-600 rounded" /><span className="text-sm font-medium text-gray-700">Active</span></label></div>
          <div className="col-span-2 flex gap-3">
            <Button variant="secondary" onClick={() => setFormModal(false)} className="flex-1">Cancel</Button>
            <Button loading={saving} onClick={handleSave} className="flex-1">Save Coupon</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
