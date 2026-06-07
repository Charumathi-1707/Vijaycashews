import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ShoppingBag } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { Button, Input } from '../components/ui';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { role } = await login(form);
      toast.success('Welcome back!');
      if (role === 'admin') navigate('/admin');
      else if (role === 'deliveryman') navigate('/delivery');
      else navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 to-primary-800 items-center justify-center p-12">
        <div className="text-white text-center">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-display font-black mb-4">Welcome Back!</h2>
          <p className="text-primary-100 text-lg max-w-sm mx-auto">Sign in to access your account, track orders, and more.</p>
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            {['1000+ Products', '50K+ Orders', '4.9★ Rating'].map(s => (
              <div key={s} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-white font-bold text-sm">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-black text-sm">S</span>
              </div>
              <span className="font-display font-bold text-xl text-gray-900">ShopEase</span>
            </Link>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-500">Don't have an account? <Link to="/register" className="text-primary-600 font-semibold hover:underline">Sign up free</Link></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">Sign In</Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 text-center font-medium mb-2">Demo Accounts</p>
            <div className="space-y-1.5">
              {[['Admin', 'admin@shopease.com', 'admin123'], ['Customer', 'customer@shopease.com', 'customer123'], ['Delivery', 'delivery@shopease.com', 'delivery123']].map(([role, email, pass]) => (
                <button key={role} onClick={() => setForm({ email, password: pass })}
                  className="w-full text-left text-xs px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors">
                  <span className="font-semibold text-gray-700">{role}:</span> <span className="text-gray-500">{email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPass, setShowPass] = useState(false);
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    try {
      await register(form);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-900 to-gray-800 items-center justify-center p-12">
        <div className="text-white text-center">
          <div className="text-8xl mb-6">🛍️</div>
          <h2 className="text-4xl font-display font-black mb-4">Join ShopEase</h2>
          <p className="text-gray-400 text-lg max-w-sm mx-auto">Create your account and start shopping with exclusive deals and fast delivery.</p>
          <div className="mt-10 space-y-3">
            {['✅ Free delivery on first order', '✅ Exclusive member discounts', '✅ Easy order tracking', '✅ 24/7 customer support'].map(f => (
              <p key={f} className="text-gray-300 text-sm">{f}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-black text-sm">S</span>
              </div>
              <span className="font-display font-bold text-xl text-gray-900">ShopEase</span>
            </Link>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500">Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'John Doe' },
              { key: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'you@example.com' },
              { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '+91 98765 43210' },
            ].map(({ key, label, icon: Icon, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={type} placeholder={placeholder} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={key !== 'phone'}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400">By creating an account, you agree to our <a href="#" className="text-primary-600 hover:underline">Terms</a> and <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>.</p>
            <Button type="submit" loading={loading} className="w-full" size="lg">Create Account</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
