import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTruck,
  FaBoxOpen,
  FaCheckCircle,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaClock,
  FaCalendarAlt,
  FaRupeeSign,
  FaWhatsapp,
  FaDirections,
  FaStar,
  FaCheckDouble,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import MainLayout from "../../layouts/MainLayout";
import { fetchOrders } from "../../services/read/order.service";
import { updateOrderStatus } from "../../services/write/order.service";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [deliveryStats, setDeliveryStats] = useState({
    total: 0,
    outForDelivery: 0,
    delivered: 0,
    pending: 0,
  });

  const { user } = useAuth();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        const deliveryOrders = data.filter(
          (order) =>
            order.assignedTo === user?.email &&
            ["Packed", "Shipped", "Out for Delivery", "Delivered"].includes(order.status)
        );
        setOrders(deliveryOrders);
        updateStats(deliveryOrders);
      } catch (err) {
        console.error(err);
        setError("Unable to load delivery orders.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const updateStats = (ordersList) => {
    const total = ordersList.length;
    const outForDelivery = ordersList.filter(o => o.status === "Out for Delivery").length;
    const delivered = ordersList.filter(o => o.status === "Delivered").length;
    const pending = ordersList.filter(o => o.status !== "Delivered").length;
    
    setDeliveryStats({ total, outForDelivery, delivered, pending });
  };

  const filterOrders = () => {
    let filtered = [...orders];
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone?.includes(searchTerm) ||
        order.address?.toLowerCase().includes(searchTerm.toLowerCase())
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
      const updatedOrders = orders.map((order) =>
        order.orderId === id ? { ...order, status: nextStatus } : order
      );
      setOrders(updatedOrders);
      updateStats(updatedOrders);
      
      // Show success indicator
      const orderElement = document.getElementById(`delivery-order-${id}`);
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

  const getStatusColor = (status) => {
    const colors = {
      "Packed": "bg-blue-500",
      "Shipped": "bg-purple-500",
      "Out for Delivery": "bg-orange-500",
      "Delivered": "bg-green-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Packed": return <FaBoxOpen className="h-4 w-4" />;
      case "Shipped": return <FaTruck className="h-4 w-4" />;
      case "Out for Delivery": return <FaTruck className="h-4 w-4 animate-pulse" />;
      case "Delivered": return <FaCheckCircle className="h-4 w-4" />;
      default: return <FaSpinner className="h-4 w-4" />;
    }
  };

  const getNextAction = (status) => {
    switch(status) {
      case "Packed":
      case "Shipped":
        return { label: "Start Delivery", status: "Out for Delivery", color: "bg-orange-600" };
      case "Out for Delivery":
        return { label: "Complete Delivery", status: "Delivered", color: "bg-green-600" };
      default:
        return null;
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleWhatsApp = (phone, orderId) => {
    const message = `Hi! I'm your delivery partner for order #${orderId}. I'll be delivering your order shortly. Please be available.`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDirections = (address) => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MainLayout>
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 px-4 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-yellow-100 p-3">
                    <FaTruck className="h-6 w-6 text-yellow-700" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                      Delivery Dashboard
                    </h1>
                    <p className="mt-1 text-gray-600">
                      Welcome back, {user?.name || user?.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 px-3 py-1">
                  <span className="text-xs font-semibold text-green-700">
                    {deliveryStats.delivered} Completed
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4">
              <FaTruck className="h-5 w-5 text-blue-600" />
              <p className="mt-2 text-2xl font-bold text-blue-700">{deliveryStats.total}</p>
              <p className="text-xs text-gray-600">Total Orders</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-4">
              <FaTruck className="h-5 w-5 text-orange-600" />
              <p className="mt-2 text-2xl font-bold text-orange-700">{deliveryStats.outForDelivery}</p>
              <p className="text-xs text-gray-600">Out for Delivery</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-4">
              <FaCheckCircle className="h-5 w-5 text-green-600" />
              <p className="mt-2 text-2xl font-bold text-green-700">{deliveryStats.delivered}</p>
              <p className="text-xs text-gray-600">Delivered</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
              <FaClock className="h-5 w-5 text-yellow-600" />
              <p className="mt-2 text-2xl font-bold text-yellow-700">{deliveryStats.pending}</p>
              <p className="text-xs text-gray-600">In Progress</p>
            </div>
          </motion.div>

          {/* Filters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 rounded-xl bg-white p-4 shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer, Phone, or Address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-full border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </motion.div>

          {/* Main Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FaSpinner className="h-12 w-12 animate-spin text-yellow-600" />
              <p className="mt-4 text-gray-600">Loading delivery orders...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 p-6 text-center">
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-full bg-red-600 px-6 py-2 text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-gradient-to-br from-yellow-50 to-amber-50 p-12 text-center"
            >
              <FaTruck className="mx-auto h-16 w-16 text-yellow-600 opacity-50" />
              <h3 className="mt-4 text-xl font-semibold text-gray-800">No delivery orders found</h3>
              <p className="mt-2 text-gray-600">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Orders assigned to you will appear here"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence>
                {filteredOrders.map((order, index) => {
                  const nextAction = getNextAction(order.status);
                  const isDelivered = order.status === "Delivered";
                  
                  return (
                    <motion.div
                      key={order.orderId}
                      id={`delivery-order-${order.orderId}`}
                      variants={itemVariants}
                      layout
                      className={`rounded-2xl border transition-all duration-300 ${
                        isDelivered ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      {/* Order Header */}
                      <div 
                        className="p-6 cursor-pointer"
                        onClick={() => toggleExpand(order.orderId)}
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getStatusColor(order.status)} text-white`}>
                              {getStatusIcon(order.status)}
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Order ID</p>
                              <p className="font-mono font-semibold text-gray-900">#{order.orderId}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-6">
                            <div>
                              <p className="text-xs text-gray-500">Customer</p>
                              <p className="font-medium text-gray-900">{order.customerName || order.name || order.email}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Status</p>
                              <div className={`inline-flex items-center gap-2 rounded-full ${getStatusColor(order.status)} px-3 py-1 text-white`}>
                                {getStatusIcon(order.status)}
                                <span className="text-sm font-semibold">{order.status}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Total Amount</p>
                              <p className="text-lg font-bold text-yellow-700">₹{order.total?.toLocaleString() || "0"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions Bar */}
                        {nextAction && !isDelivered && (
                          <div className="mt-4 flex flex-wrap gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(order.orderId, nextAction.status);
                              }}
                              disabled={saving && updatingOrderId === order.orderId}
                              className={`rounded-full ${nextAction.color} px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50`}
                            >
                              {updatingOrderId === order.orderId ? (
                                <FaSpinner className="h-4 w-4 animate-spin" />
                              ) : (
                                nextAction.label
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWhatsApp(order.phone, order.orderId);
                              }}
                              className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                            >
                              <FaWhatsapp className="inline mr-2 h-4 w-4" />
                              Message Customer
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDirections(`${order.address}, ${order.city}`);
                              }}
                              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                              <FaDirections className="inline mr-2 h-4 w-4" />
                              Get Directions
                            </button>
                          </div>
                        )}
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
                                <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                                  <FaUser className="text-yellow-600" />
                                  Customer Details
                                </h3>
                                <div className="space-y-2 text-sm">
                                  <p><span className="text-gray-500">Name:</span> {order.customerName || order.name}</p>
                                  <p><span className="text-gray-500">Phone:</span> {order.phone}</p>
                                  <p><span className="text-gray-500">Email:</span> {order.email || "N/A"}</p>
                                </div>
                              </div>

                              {/* Delivery Address */}
                              <div className="rounded-xl bg-white p-4 shadow-sm">
                                <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                                  <FaMapMarkerAlt className="text-yellow-600" />
                                  Delivery Address
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {order.address}, {order.city} - {order.pincode}
                                </p>
                              </div>

                              {/* Order Items */}
                              <div className="rounded-xl bg-white p-4 shadow-sm">
                                <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                                  <FaBoxOpen className="text-yellow-600" />
                                  Order Items
                                </h3>
                                <p className="text-sm text-gray-600">{order.products || order.productSummary}</p>
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Total Items:</span>
                                    <span className="font-semibold">
                                      {order.products?.match(/x\d+/g)?.length || "N/A"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Timeline */}
                            {order.status !== "Delivered" && (
                              <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
                                <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                                  <FaClock className="text-yellow-600" />
                                  Delivery Timeline
                                </h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Order Ready:</span>
                                    <span className="font-medium text-green-600">✓ Ready for pickup</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Estimated Delivery:</span>
                                    <span>Within 24 hours</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Delivery Instructions */}
                            <div className="mt-4 rounded-xl bg-blue-50 p-4">
                              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-800">
                                <FaCheckDouble className="h-4 w-4" />
                                Delivery Tips
                              </h3>
                              <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                                <li>Call customer 15 minutes before arrival</li>
                                <li>Take a photo on delivery as proof</li>
                                <li>Get customer signature for high-value orders</li>
                                <li>Report any issues immediately</li>
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default DeliveryDashboard;