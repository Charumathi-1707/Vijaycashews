import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaTruck, 
  FaBoxOpen, 
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaUserCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaRupeeSign,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaSyncAlt
} from "react-icons/fa";
import MainLayout from "../../layouts/MainLayout";
import { fetchOrders } from "../../services/read/order.service";
import {
  updateOrderStatus,
  assignDeliveryPerson,
} from "../../services/write/order.service";

const statusOptions = [
  { value: "Pending", label: "Pending", color: "bg-yellow-500", icon: FaClock },
  { value: "Packed", label: "Packed", color: "bg-blue-500", icon: FaBoxOpen },
  { value: "Shipped", label: "Shipped", color: "bg-purple-500", icon: FaTruck },
  { value: "Out for Delivery", label: "Out for Delivery", color: "bg-orange-500", icon: FaTruck },
  { value: "Delivered", label: "Delivered", color: "bg-green-500", icon: FaCheckCircle },
];

const statusFlow = {
  Pending: "Packed",
  Packed: "Shipped",
  Shipped: "Out for Delivery",
  "Out for Delivery": "Delivered",
  Delivered: null,
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load orders. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone?.includes(searchTerm)
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  };

  const updateStatus = async (id, nextStatus) => {
    if (saving || updatingOrderId) return;
    
    setUpdatingOrderId(id);
    setSaving(true);
    setError("");

    try {
      await updateOrderStatus(id, nextStatus);
      setOrders((current) =>
        current.map((order) =>
          order.orderId === id ? { ...order, status: nextStatus } : order
        )
      );
      
      // Show success indicator (optional)
      const orderElement = document.getElementById(`order-${id}`);
      if (orderElement) {
        orderElement.classList.add("bg-green-50");
        setTimeout(() => orderElement.classList.remove("bg-green-50"), 1000);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to update order status. Please try again.");
    } finally {
      setSaving(false);
      setUpdatingOrderId(null);
    }
  };

  const assignToDelivery = async (id) => {
    if (saving || updatingOrderId) return;
    
    setUpdatingOrderId(id);
    setSaving(true);
    setError("");

    try {
      await assignDeliveryPerson(id, "delivery@cashew.com");
      setOrders((current) =>
        current.map((order) =>
          order.orderId === id
            ? { ...order, assignedTo: "delivery@cashew.com" }
            : order
        )
      );
    } catch (err) {
      console.error(err);
      setError("Unable to assign delivery. Please try again.");
    } finally {
      setSaving(false);
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj?.color || "bg-gray-500";
  };

  const getStatusIcon = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    const Icon = statusObj?.icon || FaClock;
    return <Icon className="h-4 w-4" />;
  };

  const getNextStatus = (currentStatus) => {
    return statusFlow[currentStatus];
  };

  const getStatusProgress = (currentStatus) => {
    const index = statusOptions.findIndex(s => s.value === currentStatus);
    return ((index + 1) / statusOptions.length) * 100;
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const exportToCSV = () => {
    const headers = ["Order ID", "Customer", "Email", "Phone", "Status", "Total", "Date"];
    const csvData = filteredOrders.map(order => [
      order.orderId,
      order.customerName || order.name || order.email,
      order.email,
      order.phone,
      order.status,
      order.total,
      new Date(order.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === "Pending").length;
    const shipped = orders.filter(o => o.status === "Shipped" || o.status === "Out for Delivery").length;
    const delivered = orders.filter(o => o.status === "Delivered").length;
    const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    return { total, pending, shipped, delivered, revenue };
  }, [orders]);

  return (
    <MainLayout>
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 px-4 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  Order Management
                </h1>
                <p className="mt-2 text-gray-600">
                  Track and manage all customer orders from one dashboard
                </p>
              </div>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:shadow-md"
              >
                <FaDownload />
                Export CSV
              </button>
            </div>

            {/* Stats Cards */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-purple-700">{stats.shipped}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-4">
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-green-700">₹{stats.revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="mb-6 rounded-xl bg-white p-4 shadow-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer, Email, or Phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-full border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <button
                  onClick={loadOrders}
                  disabled={loading}
                  className="rounded-full bg-gray-100 px-4 py-2 transition hover:bg-gray-200 disabled:opacity-50"
                >
                  <FaSyncAlt className={loading ? "animate-spin" : ""} />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FaSpinner className="h-12 w-12 animate-spin text-yellow-600" />
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 p-6 text-center">
              <p className="text-red-700">{error}</p>
              <button
                onClick={loadOrders}
                className="mt-4 rounded-full bg-red-600 px-6 py-2 text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-3xl bg-gradient-to-br from-yellow-50 to-amber-50 p-12 text-center">
              <FaBoxOpen className="mx-auto h-16 w-16 text-yellow-600 opacity-50" />
              <h3 className="mt-4 text-xl font-semibold text-gray-800">No orders found</h3>
              <p className="mt-2 text-gray-600">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Orders will appear here once customers place them"}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-4">
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={order.orderId}
                    id={`order-${order.orderId}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-2xl border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg"
                  >
                    {/* Order Header */}
                    <div className="p-6 cursor-pointer" onClick={() => toggleExpand(order.orderId)}>
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 text-white">
                            <span className="font-bold">#{order.orderId?.slice(-4)}</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="font-mono font-semibold text-gray-900">{order.orderId}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-sm text-gray-500">Customer</p>
                            <p className="font-medium text-gray-900">
                              {order.customerName || order.name || order.email?.split("@")[0]}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-xl font-bold text-yellow-700">
                              ₹{order.total?.toLocaleString() || "0"}
                            </p>
                          </div>
                          <div>
                            <div className={`flex items-center gap-2 rounded-full ${getStatusColor(order.status)} px-3 py-1 text-white`}>
                              {getStatusIcon(order.status)}
                              <span className="text-sm font-semibold">{order.status || "Pending"}</span>
                            </div>
                          </div>
                          <div className="text-gray-400">
                            {expandedOrder === order.orderId ? <FaChevronUp /> : <FaChevronDown />}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          {statusOptions.map(opt => (
                            <span key={opt.value} className={order.status === opt.value ? "font-bold text-yellow-600" : ""}>
                              {opt.label}
                            </span>
                          ))}
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                          <motion.div
                            className={`h-full ${getStatusColor(order.status)}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${getStatusProgress(order.status)}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedOrder === order.orderId && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-100 bg-gray-50 p-6"
                        >
                          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Customer Info */}
                            <div className="rounded-xl bg-white p-4 shadow-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <FaUserCircle className="text-yellow-600" />
                                <h3 className="font-semibold text-gray-800">Customer Details</h3>
                              </div>
                              <div className="space-y-2 text-sm">
                                <p className="flex items-center gap-2">
                                  <FaUserCircle className="text-gray-400" />
                                  {order.customerName || order.name || "N/A"}
                                </p>
                                <p className="flex items-center gap-2">
                                  <FaEnvelope className="text-gray-400" />
                                  {order.email}
                                </p>
                                <p className="flex items-center gap-2">
                                  <FaPhoneAlt className="text-gray-400" />
                                  {order.phone || "N/A"}
                                </p>
                              </div>
                            </div>

                            {/* Delivery Info */}
                            <div className="rounded-xl bg-white p-4 shadow-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <FaMapMarkerAlt className="text-yellow-600" />
                                <h3 className="font-semibold text-gray-800">Delivery Address</h3>
                              </div>
                              <p className="text-sm text-gray-600">
                                {order.address}, {order.city} - {order.pincode}
                              </p>
                              {order.assignedTo && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <p className="text-xs text-gray-500">Delivery Partner</p>
                                  <p className="text-sm font-medium text-gray-700">{order.assignedTo}</p>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="rounded-xl bg-white p-4 shadow-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <FaTruck className="text-yellow-600" />
                                <h3 className="font-semibold text-gray-800">Actions</h3>
                              </div>
                              <div className="space-y-3">
                                {!order.assignedTo && order.status !== "Delivered" && (
                                  <button
                                    onClick={() => assignToDelivery(order.orderId)}
                                    disabled={saving && updatingOrderId === order.orderId}
                                    className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                                  >
                                    {updatingOrderId === order.orderId ? (
                                      <FaSpinner className="mx-auto animate-spin" />
                                    ) : (
                                      "Assign to Delivery"
                                    )}
                                  </button>
                                )}
                                {getNextStatus(order.status) && (
                                  <button
                                    onClick={() => updateStatus(order.orderId, getNextStatus(order.status))}
                                    disabled={saving && updatingOrderId === order.orderId}
                                    className="w-full rounded-full bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-700 disabled:opacity-50"
                                  >
                                    {updatingOrderId === order.orderId ? (
                                      <FaSpinner className="mx-auto animate-spin" />
                                    ) : (
                                      `Mark as ${getNextStatus(order.status)}`
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default AdminOrders;