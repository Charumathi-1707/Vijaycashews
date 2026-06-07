import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, CheckCircle, LogOut, Menu, X, Truck } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { orderAPI } from '../../api/services';
import { Spinner, Button, Modal } from '../../components/ui';
import { formatPrice, formatDate, formatDateTime, getOrderStatusColor, getOrderStatusLabel } from '../../utils/helpers';
import { getInitials } from '../../utils/helpers';
import toast from 'react-hot-toast';

// ===== DELIVERY LAYOUT =====
export function DeliveryLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const navItems = [
    { path: '/delivery', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/delivery/orders', label: 'My Deliveries', icon: Package },
    { path: '/delivery/completed', label: 'Completed', icon: CheckCircle },
  ];

  const Nav = () => (
    <nav className="flex lg:flex-col gap-1 p-3">
      {navItems.map(({ path, label, icon: Icon, end }) => (
        <NavLink key={path} to={path} end={end} onClick={() => setMobileOpen(false)}
          className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:text-gray-400 lg:hover:text-white lg:hover:bg-gray-800'}`}>
          <Icon className="w-4 h-4 shrink-0" /> {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-56 bg-gray-900 flex-col shrink-0 min-h-screen">
        <div className="flex items-center gap-2 p-4 h-16 border-b border-gray-800">
          <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-white">DeliveryApp</span>
        </div>
        <Nav />
        <div className="mt-auto p-3 border-t border-gray-800">
          <div className="flex items-center gap-2 px-3 py-2 mb-1">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">{getInitials(user?.name)}</div>
            <div className="flex-1 min-w-0"><p className="text-white text-xs font-semibold truncate">{user?.name}</p><p className="text-gray-400 text-[10px]">Delivery Partner</p></div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-gray-400 hover:text-red-400 text-sm transition-colors"><LogOut className="w-4 h-4" /> Logout</button>
        </div>
      </aside>

      {/* Mobile header + sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-gray-900 h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <span className="font-display font-bold text-white">DeliveryApp</span>
              <button onClick={() => setMobileOpen(false)} className="text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <Nav />
            <div className="mt-auto p-4 border-t border-gray-800">
              <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm transition-colors"><LogOut className="w-4 h-4" /> Logout</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <header className="lg:hidden bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="p-2 hover:bg-gray-100 rounded-xl"><Menu className="w-5 h-5 text-gray-600" /></button>
          <span className="font-display font-bold text-gray-900">DeliveryApp</span>
          <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-xl flex items-center justify-center text-sm font-bold">{getInitials(user?.name)}</div>
        </header>
        <main className="flex-1 p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  );
}

// ===== DELIVERY DASHBOARD =====
export function DeliveryDashboard() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModal, setStatusModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await orderAPI.deliveryGetMy({ status: 'shipped,out_for_delivery' });
      setOrders(data.orders);
    } catch {}
    setLoading(false);
  };

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      await orderAPI.deliveryUpdateStatus(selectedOrder._id, { status });
      toast.success(`Order marked as ${getOrderStatusLabel(status)}`);
      setStatusModal(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
    setUpdating(false);
  };

  const activeOrders = orders.filter(o => ['shipped', 'out_for_delivery'].includes(o.status));

  const stats = [
    { label: 'Active Deliveries', value: activeOrders.length, icon: '🚚', color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Completed', value: user?.totalDeliveries || 0, icon: '✅', color: 'bg-green-50 text-green-600' },
    { label: 'Rating', value: user?.rating ? `${user.rating.toFixed(1)}★` : '—', icon: '⭐', color: 'bg-yellow-50 text-yellow-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here are your active deliveries</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
            <div><p className="text-2xl font-black text-gray-900">{value}</p><p className="text-xs text-gray-500">{label}</p></div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-display font-bold text-gray-900 mb-4">Active Deliveries</h2>
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : activeOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <p className="font-semibold text-gray-700">No active deliveries!</p>
            <p className="text-sm text-gray-400 mt-1">New deliveries will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeOrders.map(order => (
              <DeliveryOrderCard key={order._id} order={order}
                onUpdate={() => { setSelectedOrder(order); setStatusModal(true); }} />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={statusModal} onClose={() => setStatusModal(false)} title="Update Delivery Status">
        <div className="space-y-3">
          {selectedOrder && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm">
              <p className="font-bold text-gray-900">{selectedOrder.orderId}</p>
              <p className="text-gray-600">{selectedOrder.shippingAddress?.name} · {selectedOrder.shippingAddress?.city}</p>
              <p className="text-gray-500 text-xs mt-1 font-mono">📍 {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.pincode}</p>
            </div>
          )}
          <p className="text-sm font-medium text-gray-700">Update to:</p>
          {selectedOrder?.status === 'shipped' && (
            <Button className="w-full" onClick={() => handleStatusUpdate('out_for_delivery')} loading={updating} size="lg">
              🚚 Mark as Out for Delivery
            </Button>
          )}
          {['shipped', 'out_for_delivery'].includes(selectedOrder?.status) && (
            <Button variant="success" className="w-full" onClick={() => handleStatusUpdate('delivered')} loading={updating} size="lg">
              ✅ Mark as Delivered
            </Button>
          )}
          <Button variant="secondary" className="w-full" onClick={() => setStatusModal(false)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}

// ===== DELIVERY ALL ORDERS PAGE =====
export function DeliveryOrdersPage({ completed = false }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModal, setStatusModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchOrders(); }, [completed]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = completed ? { status: 'delivered' } : {};
      const { data } = await orderAPI.deliveryGetMy(params);
      setOrders(completed ? data.orders.filter(o => o.status === 'delivered') : data.orders);
    } catch {}
    setLoading(false);
  };

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      await orderAPI.deliveryUpdateStatus(selectedOrder._id, { status });
      toast.success('Updated!');
      setStatusModal(false);
      fetchOrders();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
    setUpdating(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-2xl font-display font-bold text-gray-900">{completed ? 'Completed Deliveries' : 'All My Deliveries'}</h1>
      {loading ? <div className="flex justify-center py-12"><Spinner /></div> : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p>No {completed ? 'completed' : ''} deliveries</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <DeliveryOrderCard key={order._id} order={order} completed={completed}
              onUpdate={!completed ? () => { setSelectedOrder(order); setStatusModal(true); } : null} />
          ))}
        </div>
      )}

      <Modal isOpen={statusModal} onClose={() => setStatusModal(false)} title="Update Status">
        <div className="space-y-3">
          {['out_for_delivery', 'delivered'].map(s => (
            <Button key={s} className="w-full" variant={s === 'delivered' ? 'success' : 'primary'}
              onClick={() => handleStatusUpdate(s)} loading={updating}>
              {getOrderStatusLabel(s)}
            </Button>
          ))}
          <Button variant="secondary" className="w-full" onClick={() => setStatusModal(false)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}

// ===== SHARED ORDER CARD FOR DELIVERY =====
function DeliveryOrderCard({ order, onUpdate, completed }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between p-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-bold text-gray-900">{order.orderId}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getOrderStatusColor(order.status)}`}>{getOrderStatusLabel(order.status)}</span>
          </div>
          <p className="text-sm text-gray-700 font-medium">{order.customer?.name}</p>
          <p className="text-xs text-gray-400">📞 {order.customer?.phone}</p>
          <p className="text-xs text-gray-500 mt-1">📍 {order.shippingAddress?.street}, {order.shippingAddress?.city} — {order.shippingAddress?.pincode}</p>
        </div>
        <div className="text-right shrink-0 ml-4">
          <p className="font-bold text-gray-900">{formatPrice(order.pricing?.total)}</p>
          <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
          <p className="text-xs text-gray-400">{order.items?.length} items</p>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-4 border-t border-gray-50 pt-3 animate-slide-down">
          <div className="space-y-2">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                <span className="flex-1 text-gray-700">{item.name}</span>
                <span className="text-gray-500 text-xs">×{item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 bg-yellow-50 rounded-xl text-xs text-yellow-700">
            <p className="font-semibold mb-0.5">Payment: {order.payment?.method?.toUpperCase()}</p>
            <p>{order.payment?.method === 'cod' ? `Collect ₹${formatPrice(order.pricing?.total)} on delivery` : 'Payment already done'}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-gray-500 hover:text-gray-700 font-medium">
          {expanded ? 'Show less ↑' : 'Show items ↓'}
        </button>
        {onUpdate && !completed && (
          <Button size="sm" onClick={onUpdate}>Update Status</Button>
        )}
        {completed && <span className="text-xs text-green-600 font-semibold">✅ Delivered {order.deliveredAt ? formatDate(order.deliveredAt) : ''}</span>}
      </div>
    </div>
  );
}
