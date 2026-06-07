import { useState } from 'react';
import { User, Lock, MapPin, Plus, Trash2, Camera, Edit2, Check, X } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { authAPI } from '../../api/services';
import { Button, Input, Modal } from '../../components/ui';
import { getInitials } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const { user, updateUser } = useAuthStore();
  const [tab, setTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({ label: 'Home', street: '', city: '', state: '', pincode: '', country: 'India', isDefault: false });

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(profileForm).forEach(([k, v]) => fd.append(k, v));
      const { data } = await authAPI.updateProfile(fd);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
    setSaving(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    fd.append('name', user.name);
    try {
      const { data } = await authAPI.updateProfile(fd);
      updateUser(data.user);
      toast.success('Avatar updated!');
    } catch { toast.error('Failed to update avatar'); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwordForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSavingPass(true);
    try {
      await authAPI.changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      toast.success('Password changed!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
    setSavingPass(false);
  };

  const handleAddressSubmit = async () => {
    try {
      let data;
      if (editAddress) {
        ({ data } = await authAPI.updateAddress(editAddress._id, addressForm));
      } else {
        ({ data } = await authAPI.addAddress(addressForm));
      }
      updateUser({ ...user, addresses: data.addresses });
      toast.success(editAddress ? 'Address updated' : 'Address added');
      setAddressModal(false);
      setEditAddress(null);
      setAddressForm({ label: 'Home', street: '', city: '', state: '', pincode: '', country: 'India', isDefault: false });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const { data } = await authAPI.deleteAddress(id);
      updateUser({ ...user, addresses: data.addresses });
      toast.success('Address deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const openEditAddress = (addr) => {
    setEditAddress(addr);
    setAddressForm({ label: addr.label, street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode, country: addr.country, isDefault: addr.isDefault });
    setAddressModal(true);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 h-fit">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl object-cover" />
                ) : (
                  <div className="w-20 h-20 bg-primary-100 text-primary-700 rounded-2xl flex items-center justify-center text-2xl font-black">
                    {getInitials(user?.name)}
                  </div>
                )}
                <label className="absolute -bottom-2 -right-2 w-7 h-7 bg-primary-600 text-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors shadow-md">
                  <Camera className="w-3.5 h-3.5" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <p className="font-bold text-gray-900 mt-3 text-center">{user?.name}</p>
              <p className="text-xs text-gray-400 text-center truncate max-w-full">{user?.email}</p>
              <span className="mt-2 px-2.5 py-0.5 bg-primary-50 text-primary-600 text-xs font-semibold rounded-full capitalize">{user?.role}</span>
            </div>

            {/* Tabs */}
            <nav className="space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {tab === 'profile' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-fade-in">
                <h2 className="font-display font-bold text-xl mb-5">Personal Information</h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <input value={user?.email} disabled className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Role</label>
                    <input value={user?.role} disabled className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed capitalize" />
                  </div>
                </div>
                <Button loading={saving} onClick={handleProfileSave}>Save Changes</Button>
              </div>
            )}

            {/* Security Tab */}
            {tab === 'security' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-fade-in">
                <h2 className="font-display font-bold text-xl mb-5">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirmPassword', 'Confirm New Password']].map(([key, label]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                      <input type="password" value={passwordForm[key]} onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" required />
                    </div>
                  ))}
                  <Button type="submit" loading={savingPass}>Update Password</Button>
                </form>
              </div>
            )}

            {/* Addresses Tab */}
            {tab === 'addresses' && (
              <div className="animate-fade-in space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-xl text-gray-900">Saved Addresses</h2>
                  <Button size="sm" onClick={() => { setEditAddress(null); setAddressForm({ label: 'Home', street: '', city: '', state: '', pincode: '', country: 'India', isDefault: false }); setAddressModal(true); }}>
                    <Plus className="w-4 h-4" /> Add New
                  </Button>
                </div>
                {user?.addresses?.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <div className="text-5xl mb-4">📍</div>
                    <p className="font-semibold text-gray-900 mb-1">No addresses saved</p>
                    <p className="text-sm text-gray-500">Add an address for faster checkout</p>
                  </div>
                ) : (
                  user.addresses.map((addr) => (
                    <div key={addr._id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start justify-between hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900 text-sm">{addr.label}</span>
                            {addr.isDefault && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Default</span>}
                          </div>
                          <p className="text-sm text-gray-600">{addr.street}</p>
                          <p className="text-sm text-gray-500">{addr.city}, {addr.state} — {addr.pincode}</p>
                          <p className="text-sm text-gray-400">{addr.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditAddress(addr)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-700">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteAddress(addr._id)} className="p-2 hover:bg-red-50 rounded-xl transition-colors text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <Modal isOpen={addressModal} onClose={() => setAddressModal(false)} title={editAddress ? 'Edit Address' : 'Add New Address'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <div className="flex gap-2">
                {['Home', 'Work', 'Other'].map(l => (
                  <button key={l} onClick={() => setAddressForm({ ...addressForm, label: l })}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all ${addressForm.label === l ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            {[['street', 'Street Address', 'col-span-2'], ['city', 'City', 'col-span-1'], ['state', 'State', 'col-span-1'], ['pincode', 'Pincode', 'col-span-1'], ['country', 'Country', 'col-span-1']].map(([key, label, span]) => (
              <div key={key} className={span}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input value={addressForm[key]} onChange={(e) => setAddressForm({ ...addressForm, [key]: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            ))}
            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="w-4 h-4 accent-primary-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Set as default address</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setAddressModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleAddressSubmit} className="flex-1">Save Address</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
