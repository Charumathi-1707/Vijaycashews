import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShoppingBag, Users, Package, AlertTriangle, DollarSign, Clock, CheckCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { orderAPI } from '../../api/services';
import { Spinner } from '../../components/ui';
import { formatPrice, formatDate, getOrderStatusColor, getOrderStatusLabel } from '../../utils/helpers';

const StatCard = ({ title, value, icon: Icon, color, change, sub }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      {change !== undefined && (
        <span className={`flex items-center gap-0.5 text-xs font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(change)}%
        </span>
      )}
    </div>
    <p className="text-2xl font-black text-gray-900 mb-1">{value}</p>
    <p className="text-sm text-gray-500">{title}</p>
    {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
  </div>
);

const SimpleBarChart = ({ data }) => {
  if (!data?.length) return null;
  const max = Math.max(...data.map(d => d.revenue));
  return (
    <div className="flex items-end gap-1 h-40">
      {data.slice(-14).map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="relative w-full">
            <div style={{ height: `${max > 0 ? (d.revenue / max) * 120 : 0}px` }}
              className="bg-primary-500 hover:bg-primary-600 rounded-t-md transition-all duration-300 cursor-pointer min-h-[2px] w-full" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
              {formatPrice(d.revenue)}
            </div>
          </div>
          <span className="text-[9px] text-gray-400 rotate-45 origin-left">{d._id?.slice(5)}</span>
        </div>
      ))}
    </div>
  );
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
        setRevenueChart(statsRes.data.revenueChart);
        setStatusDist(statsRes.data.statusDist);
        setRecentOrders(ordersRes.data.orders);
      } catch {}
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;

  const statusColors = { pending: 'bg-yellow-500', confirmed: 'bg-blue-500', processing: 'bg-indigo-500', shipped: 'bg-purple-500', out_for_delivery: 'bg-orange-500', delivered: 'bg-green-500', cancelled: 'bg-red-500' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatPrice(stats?.totalRevenue || 0)} icon={DollarSign} color="text-green-600 bg-green-50" change={12} sub="All time" />
        <StatCard title="Month Revenue" value={formatPrice(stats?.monthRevenue || 0)} icon={TrendingUp} color="text-blue-600 bg-blue-50" change={8} />
        <StatCard title="Total Orders" value={stats?.totalOrders || 0} icon={ShoppingBag} color="text-purple-600 bg-purple-50" sub={`${stats?.todayOrders || 0} today`} />
        <StatCard title="Pending Orders" value={stats?.pendingOrders || 0} icon={Clock} color="text-orange-600 bg-orange-50" sub="Need attention" />
        <StatCard title="Total Customers" value={stats?.totalUsers || 0} icon={Users} color="text-indigo-600 bg-indigo-50" />
        <StatCard title="Active Products" value={stats?.totalProducts || 0} icon={Package} color="text-teal-600 bg-teal-50" />
        <StatCard title="Low Stock" value={stats?.lowStockProducts || 0} icon={AlertTriangle} color="text-red-600 bg-red-50" sub="≤10 units" />
        <StatCard title="This Month Orders" value={stats?.monthOrders || 0} icon={CheckCircle} color="text-emerald-600 bg-emerald-50" />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-gray-900">Revenue (Last 14 Days)</h2>
              <p className="text-xs text-gray-400 mt-0.5">Daily revenue trend</p>
            </div>
          </div>
          <SimpleBarChart data={revenueChart} />
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-display font-bold text-gray-900 mb-5">Order Status</h2>
          <div className="space-y-3">
            {statusDist.map(({ _id: status, count }) => {
              const total = statusDist.reduce((a, s) => a + s.count, 0);
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 capitalize">{getOrderStatusLabel(status)}</span>
                    <span className="font-bold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div style={{ width: `${pct}%` }} className={`h-full ${statusColors[status] || 'bg-gray-400'} rounded-full transition-all duration-500`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-display font-bold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">
            View All <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{order.orderId}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{order.customer?.name}</p>
                    <p className="text-xs text-gray-400">{order.customer?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.items.length} items</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{formatPrice(order.pricing.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(order.status)}`}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4">
                    <Link to={`/admin/orders/${order._id}`} className="text-primary-600 hover:text-primary-700 font-semibold text-xs">
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
