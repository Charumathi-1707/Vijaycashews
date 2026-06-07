import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag, Truck,
  BarChart2, Settings, LogOut, Menu, X, ChevronRight, Bell, Ticket
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { getInitials } from '../../utils/helpers';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/categories', label: 'Categories', icon: Tag },
  { path: '/admin/users', label: 'Customers', icon: Users },
  { path: '/admin/deliverymen', label: 'Delivery Team', icon: Truck },
  { path: '/admin/coupons', label: 'Coupons', icon: Ticket },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'w-full' : sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 min-h-screen flex flex-col transition-all duration-300`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-gray-800 h-16 ${!sidebarOpen && !mobile ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shrink-0">
          <span className="text-white font-display font-black text-sm">S</span>
        </div>
        {(sidebarOpen || mobile) && <span className="font-display font-bold text-white text-lg">ShopEase</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ path, label, icon: Icon, end }) => (
          <NavLink key={path} to={path} end={end}
            onClick={() => mobile && setMobileSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'} ${!sidebarOpen && !mobile ? 'justify-center' : ''}`
            }>
            <Icon className="w-5 h-5 shrink-0" />
            {(sidebarOpen || mobile) && <span className="text-sm font-medium">{label}</span>}
            {!sidebarOpen && !mobile && (
              <div className="absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 ml-2">
                {label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className={`p-3 border-t border-gray-800 ${!sidebarOpen && !mobile ? 'flex justify-center' : ''}`}>
        {(sidebarOpen || mobile) ? (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 relative">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-64 animate-slide-up">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-400 hidden sm:block">Manage your store</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
