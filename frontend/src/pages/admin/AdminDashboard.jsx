import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, ShoppingBag, Users, Package, AlertTriangle, 
  DollarSign, Clock, CheckCircle, ArrowUpRight, ArrowDownRight, 
  Eye, Filter 
} from 'lucide-react';
import { orderAPI } from '../../api/services';
import { Spinner } from '../../components/ui';
import { formatPrice, formatDate, getOrderStatusColor, getOrderStatusLabel } from '../../utils/helpers';

const StatCard = ({ title, value, icon: Icon, color, change, sub }) => (
  <div className="group card p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full">
    <div className="flex items-start justify-between mb-6">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} transition-transform group-hover:scale-110`}>
        <Icon className="w-6 h-6" />
      </div>
      
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-2xl ${change >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
          {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      )}
    </div>
    
    <div className="mt-auto">
      <p className="text-3xl font-bold tracking-tighter text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  </div>
);

const SimpleBarChart = ({ data }) => {
  if (!data?.length) return <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>;
  
  const max = Math.max(...data.map(d => d.revenue || 0));
  const recentData = data.slice(-14);

  return (
    <div className="h-64 relative pt-2">
      <div className="absolute inset-0 flex items-end gap-3 px-2">
        {recentData.map((d, i) => {
          const height = max > 0 ? Math.max((d.revenue / max) * 100, 12) : 12;
          const dateLabel = d._id ? new Date(d._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              <div className="relative w-full flex justify-center">
                <div 
                  style={{ height: `${height}%` }}
                  className="bg-gradient-to-t from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 w-full rounded-t-2xl transition-all duration-300 cursor-pointer min-h-[24px]"
                >
                  <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-20 shadow-xl whitespace-nowrap">
                    {formatPrice(d.revenue)}
                    <div className="text-[10px] text-gray-400 mt-0.5">{dateLabel}</div>
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 mt-4 font-medium tracking-wider">
                {dateLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatusProgress = ({ statusDist }) => {
  const total = statusDist.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <div className="space-y-6">
      {statusDist.map(({ _id: status, count }) => {
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={status} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full ${statusColors[status] || 'bg-gray-400'}`} />
                <span className="font-medium text-gray-700 capitalize">
                  {getOrderStatusLabel(status)}
                </span>
              </div>
              <div className="font-semibold text-gray-900">{count} <span className="text-xs text-gray-400 font-normal">({pct}%)</span></div>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${statusColors[status] || 'bg-gray-400'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Professional & Consistent Status Colors
const statusColors = {
  pending: 'bg-amber-500',
  confirmed: 'bg-blue-600',
  processing: 'bg-indigo-600',
  shipped: 'bg-violet-600',
  out_for_delivery: 'bg-orange-500',
  delivered: 'bg-emerald-600',
  cancelled: 'bg-rose-600'
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [revenueChart, setRevenueChart] = useState([]);
  const [statusDist, setStatusDist] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          orderAPI.adminGetStats(),
          orderAPI.adminGetAll({ limit: 8, page: 1 }),
        ]);
        
        setStats(statsRes.data.stats);
        setRevenueChart(statsRes.data.revenueChart || []);
        setStatusDist(statsRes.data.statusDist || []);
        setRecentOrders(ordersRes.data.orders || []);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div className="min-h-[70vh] flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="section-title text-4xl">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Real-time overview of your store • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.location.reload()} 
            className="btn-ghost flex items-center gap-2"
          >
            <Clock className="w-4 h-4" /> Refresh
          </button>
          <Link 
            to="/admin/orders" 
            className="btn-primary flex items-center gap-2"
          >
            View All Orders <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Revenue" value={formatPrice(stats?.totalRevenue || 0)} icon={DollarSign} color="bg-emerald-100 text-emerald-700" change={18} sub="All time" />
        <StatCard title="This Month" value={formatPrice(stats?.monthRevenue || 0)} icon={TrendingUp} color="bg-primary-100 text-primary-700" change={12} />
        <StatCard title="Total Orders" value={stats?.totalOrders || 0} icon={ShoppingBag} color="bg-slate-100 text-slate-700" sub={`${stats?.todayOrders || 0} today`} />
        <StatCard title="Pending Orders" value={stats?.pendingOrders || 0} icon={Clock} color="bg-amber-100 text-amber-700" sub="Requires action" />
        <StatCard title="Total Customers" value={stats?.totalUsers || 0} icon={Users} color="bg-blue-100 text-blue-700" />
        <StatCard title="Active Products" value={stats?.totalProducts || 0} icon={Package} color="bg-teal-100 text-teal-700" />
        <StatCard title="Low Stock" value={stats?.lowStockProducts || 0} icon={AlertTriangle} color="bg-rose-100 text-rose-700" sub="≤ 10 units" />
        <StatCard title="Month Orders" value={stats?.monthOrders || 0} icon={CheckCircle} color="bg-emerald-100 text-emerald-700" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Revenue Trend */}
        <div className="card xl:col-span-8 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900">Revenue Trend</h2>
              <p className="text-sm text-gray-500">Last 14 days performance</p>
            </div>
            <div className="text-xs px-4 py-2 bg-gray-100 rounded-2xl text-gray-500 flex items-center gap-1.5 mt-3 sm:mt-0">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" /> LIVE
            </div>
          </div>
          <SimpleBarChart data={revenueChart} />
        </div>

        {/* Status Distribution */}
        <div className="card xl:col-span-4 p-6">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Order Status</h2>
          <StatusProgress statusDist={statusDist} />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-display font-bold text-gray-900">Recent Orders</h2>
            <span className="badge bg-gray-100 text-gray-500">{recentOrders.length} orders</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="btn-ghost flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <Link to="/admin/orders" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm">
              View all <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden lg:block">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 font-mono font-semibold text-gray-900">{order.orderId}</td>
                  <td className="px-6 py-5">
                    <p className="font-medium text-gray-900">{order.customer?.name}</p>
                    <p className="text-xs text-gray-400">{order.customer?.email}</p>
                  </td>
                  <td className="px-6 py-5 text-gray-600">{order.items?.length || 0} items</td>
                  <td className="px-6 py-5 font-semibold text-gray-900">{formatPrice(order.pricing?.total || 0)}</td>
                  <td className="px-6 py-5">
                    <span className={`badge ${getOrderStatusColor(order.status)}`}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-5 text-right">
                    <Link to={`/admin/orders/${order._id}`} className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 justify-end">
                      Manage <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden p-4 space-y-4">
          {recentOrders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="font-mono font-bold text-gray-900">{order.orderId}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`badge ${getOrderStatusColor(order.status)}`}>
                  {getOrderStatusLabel(order.status)}
                </span>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-gray-100">
                <div>
                  <p className="text-gray-700">{order.customer?.name}</p>
                  <p className="text-xs text-gray-400">{order.items?.length || 0} items</p>
                </div>
                <p className="font-bold text-xl text-gray-900">{formatPrice(order.pricing?.total || 0)}</p>
              </div>

              <Link 
                to={`/admin/orders/${order._id}`}
                className="btn-primary w-full flex justify-center mt-2"
              >
                Manage Order
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}