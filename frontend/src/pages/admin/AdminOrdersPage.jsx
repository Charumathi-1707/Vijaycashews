import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, UserCheck, ChevronDown, Truck, RefreshCcw, Package } from 'lucide-react';
import { orderAPI, adminAPI, paymentAPI } from '../../api/services';
import { Spinner, Pagination, Modal, Button, Badge } from '../../components/ui';
import { formatPrice, formatDate, formatDateTime, getOrderStatusColor, getOrderStatusLabel } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];

const COURIER_SERVICES = ['DTDC', 'BlueDart', 'Delhivery', 'Ecom Express', 'XpressBees', 'India Post', 'FedEx', 'DHL', 'Amazon Logistics', 'Other'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [courierModal, setCourierModal] = useState(false);
  const [refundModal, setRefundModal] = useState(false);
  const [deliverymen, setDeliverymen] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedDeliveryman, setSelectedDeliveryman] = useState('');
  const [updating, setUpdating] = useState(false);
  const [courierForm, setCourierForm] = useState({ courierName: '', trackingId: '', trackingUrl: '' });
  const [refundForm, setRefundForm] = useState({ amount: '', reason: '' });

  useEffect(() => { fetchOrders(); }, [page, filterStatus]);
  useEffect(() => {
    const timer = setTimeout(() => { if (page === 1) fetchOrders(); else setPage(1); }, 600);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await orderAPI.adminGetAll({ page, limit: 15, status: filterStatus, search });
      setOrders(data.orders);
      setTotal(data.total);
      setPages(data.pages);
    } catch {}
    setLoading(false);
  };

  const fetchDeliverymen = async () => {
    try {
      const { data } = await adminAPI.getDeliverymen();
      setDeliverymen(data.deliverymen);
    } catch {}
  };

  const openCourier = (order) => {
    setSelectedOrder(order);
    setCourierForm({
      courierName: order.shipping?.courierName || '',
      trackingId: order.shipping?.trackingId || '',
      trackingUrl: order.shipping?.trackingUrl || '',
    });
    setCourierModal(true);
  };

  const handleCourierSubmit = async () => {
    if (!courierForm.courierName || !courierForm.trackingId) {
      toast.error('Courier name and tracking ID are required'); return;
    }
    setUpdating(true);
    try {
      await paymentAPI.updateCourierTracking(selectedOrder._id, courierForm);
      toast.success('Courier tracking updated! Order marked as Shipped.');
      setCourierModal(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update tracking');
    }
    setUpdating(false);
  };

  const openRefund = (order) => {
    setSelectedOrder(order);
    setRefundForm({ amount: order.pricing?.total || '', reason: '' });
    setRefundModal(true);
  };

  const handleRefund = async () => {
    setUpdating(true);
    try {
      await paymentAPI.initiateRefund(selectedOrder._id, refundForm);
      toast.success('Refund initiated successfully');
      setRefundModal(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Refund failed');
    }
    setUpdating(false);
  };

  const openDetail = async (order) => {
    try {
      const { data } = await orderAPI.getOne(order._id);
      setSelectedOrder(data.order);
      setDetailModal(true);
    } catch {}
  };

  const openStatusUpdate = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusMessage('');
    setStatusModal(true);
  };

  const openAssign = async (order) => {
    setSelectedOrder(order);
    setSelectedDeliveryman(order.deliveryman?._id || '');
    await fetchDeliverymen();
    setAssignModal(true);
  };

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      await orderAPI.adminUpdateStatus(selectedOrder._id, { status: newStatus, message: statusMessage });
      toast.success('Order status updated');
      setStatusModal(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
    setUpdating(false);
  };

  const handleAssign = async () => {
    if (!selectedDeliveryman) { toast.error('Select a delivery person'); return; }
    setUpdating(true);
    try {
      await orderAPI.adminAssign(selectedOrder._id, selectedDeliveryman);
      toast.success('Delivery person assigned');
      setAssignModal(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Assignment failed');
    }
    setUpdating(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Order ID..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
          <option value="">All Status</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{getOrderStatusLabel(s)}</option>)}
        </select>
      </div>

      {/* Status Quick Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['', ...ORDER_STATUSES].map(s => (
          <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filterStatus === s ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'}`}>
            {s ? getOrderStatusLabel(s) : 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-bold text-gray-900">{order.orderId}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900 text-sm">{order.customer?.name}</p>
                      <p className="text-xs text-gray-400">{order.customer?.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-xs">{order.items.length} items</td>
                    <td className="px-5 py-4 font-bold text-gray-900">{formatPrice(order.pricing.total)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${order.payment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.payment.method.toUpperCase()} · {order.payment.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openDetail(order)} title="View Details" className="p-1.5 hover:bg-primary-50 text-gray-500 hover:text-primary-600 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openStatusUpdate(order)} title="Update Status" className="p-1.5 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-lg transition-colors">
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        {['confirmed', 'processing'].includes(order.status) && (
                          <button onClick={() => openAssign(order)} title="Assign Delivery Person" className="p-1.5 hover:bg-green-50 text-gray-500 hover:text-green-600 rounded-lg transition-colors">
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => openCourier(order)} title="Set Courier Tracking" className="p-1.5 hover:bg-orange-50 text-gray-500 hover:text-orange-500 rounded-lg transition-colors">
                          <Truck className="w-4 h-4" />
                        </button>
                        {order.payment?.status === 'paid' && order.payment?.razorpayPaymentId && (
                          <button onClick={() => openRefund(order)} title="Initiate Refund" className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg transition-colors">
                            <RefreshCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">📦</div>
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Pagination page={page} pages={pages} onPageChange={setPage} />

      {/* Detail Modal */}
      <Modal isOpen={detailModal} onClose={() => setDetailModal(false)} title={`Order ${selectedOrder?.orderId}`} size="xl">
        {selectedOrder && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Customer</p>
                <p className="font-bold text-gray-900">{selectedOrder.customer?.name}</p>
                <p className="text-gray-500">{selectedOrder.customer?.email}</p>
                <p className="text-gray-500">{selectedOrder.customer?.phone}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Delivery Address</p>
                <p className="font-bold text-gray-900">{selectedOrder.shippingAddress?.name}</p>
                <p className="text-gray-500">{selectedOrder.shippingAddress?.street}</p>
                <p className="text-gray-500">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                <p className="text-gray-500">{selectedOrder.shippingAddress?.pincode}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Payment</p>
                <p className="font-bold text-gray-900">{selectedOrder.payment?.method?.toUpperCase()}</p>
                <span className={`text-xs font-semibold ${selectedOrder.payment?.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{selectedOrder.payment?.status}</span>
                <p className="text-gray-500 mt-1">Total: {formatPrice(selectedOrder.pricing?.total)}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Items</h4>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-sm">
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Status History</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedOrder.statusHistory?.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 bg-gray-50 rounded-xl text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-semibold capitalize">{getOrderStatusLabel(h.status)}</span>
                      {h.message && <span className="text-gray-500 ml-2">— {h.message}</span>}
                      <p className="text-xs text-gray-400">{formatDateTime(h.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Courier tracking info */}
            {selectedOrder.shipping?.trackingId && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <h4 className="font-semibold text-sm text-orange-800 mb-2 flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Courier Shipping Details
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Courier</span><span className="font-bold text-gray-900">{selectedOrder.shipping.courierName}</span></div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tracking ID</span>
                    <span className="font-mono font-bold text-primary-700 bg-white px-2 py-0.5 rounded border">{selectedOrder.shipping.trackingId}</span>
                  </div>
                  {selectedOrder.shipping.trackingUrl && (
                    <div className="pt-1">
                      <a href={selectedOrder.shipping.trackingUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                        🔗 Track Package
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Razorpay payment info */}
            {selectedOrder.payment?.razorpayPaymentId && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h4 className="font-semibold text-sm text-blue-800 mb-2">💳 Razorpay Payment</h4>
                <div className="space-y-1 text-xs text-blue-700 font-mono">
                  <p>Payment ID: {selectedOrder.payment.razorpayPaymentId}</p>
                  <p>Order ID: {selectedOrder.payment.razorpayOrderId}</p>
                  <p>Status: <span className={`font-bold ${selectedOrder.payment.status === 'paid' ? 'text-green-700' : 'text-red-600'}`}>{selectedOrder.payment.status?.toUpperCase()}</span></p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Courier Tracking Modal */}
      <Modal isOpen={courierModal} onClose={() => setCourierModal(false)} title="📦 Set Courier Tracking">
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-sm text-orange-700">
            Use this when shipping through a third-party courier service instead of your own delivery team.
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Courier Service *</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {COURIER_SERVICES.slice(0, 6).map(name => (
                <button key={name} onClick={() => setCourierForm({ ...courierForm, courierName: name })}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border-2 transition-all ${courierForm.courierName === name ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {name}
                </button>
              ))}
            </div>
            <input value={courierForm.courierName} onChange={(e) => setCourierForm({ ...courierForm, courierName: e.target.value })}
              placeholder="Or type courier name..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none mt-1" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tracking ID / AWB Number *</label>
            <input value={courierForm.trackingId} onChange={(e) => setCourierForm({ ...courierForm, trackingId: e.target.value })}
              placeholder="e.g. 1234567890"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none font-mono" />
            <p className="text-xs text-gray-400 mt-1">This will be visible to the customer to track their package</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tracking URL <span className="text-gray-400 font-normal">(optional)</span></label>
            <input value={courierForm.trackingUrl} onChange={(e) => setCourierForm({ ...courierForm, trackingUrl: e.target.value })}
              placeholder="https://www.dtdc.in/tracking/..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
            <p>✅ Order status will automatically be updated to <strong>Shipped</strong></p>
            <p>✅ Customer will see the courier name and tracking ID in their order details</p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setCourierModal(false)} className="flex-1">Cancel</Button>
            <Button loading={updating} onClick={handleCourierSubmit} className="flex-1">
              <Truck className="w-4 h-4" /> Save & Ship
            </Button>
          </div>
        </div>
      </Modal>

      {/* Refund Modal */}
      <Modal isOpen={refundModal} onClose={() => setRefundModal(false)} title="💸 Initiate Refund">
        <div className="space-y-4">
          {selectedOrder && (
            <div className="bg-gray-50 rounded-xl p-4 text-sm">
              <p className="font-bold text-gray-900">{selectedOrder.orderId}</p>
              <p className="text-gray-600">Payment ID: <span className="font-mono text-xs">{selectedOrder.payment?.razorpayPaymentId}</span></p>
              <p className="text-gray-600 mt-1">Total Paid: <span className="font-bold text-gray-900">{formatPrice(selectedOrder.pricing?.total)}</span></p>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Refund Amount (₹)</label>
            <input type="number" value={refundForm.amount} onChange={(e) => setRefundForm({ ...refundForm, amount: e.target.value })}
              placeholder="Leave empty for full refund"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
            <p className="text-xs text-gray-400 mt-1">Leave blank to refund the full amount</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason</label>
            <textarea value={refundForm.reason} onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })} rows={3}
              placeholder="Reason for refund..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none" />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setRefundModal(false)} className="flex-1">Cancel</Button>
            <Button variant="danger" loading={updating} onClick={handleRefund} className="flex-1">Initiate Refund</Button>
          </div>
        </div>
      </Modal>

      {/* Status Update Modal */}
      <Modal isOpen={statusModal} onClose={() => setStatusModal(false)} title="Update Order Status">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
            <div className="grid grid-cols-2 gap-2">
              {ORDER_STATUSES.map(s => (
                <button key={s} onClick={() => setNewStatus(s)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all text-left ${newStatus === s ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-100 text-gray-600 hover:border-gray-200'}`}>
                  {getOrderStatusLabel(s)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Message (optional)</label>
            <input value={statusMessage} onChange={(e) => setStatusMessage(e.target.value)} placeholder="Add a note..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStatusModal(false)} className="flex-1">Cancel</Button>
            <Button loading={updating} onClick={handleStatusUpdate} className="flex-1">Update Status</Button>
          </div>
        </div>
      </Modal>

      {/* Assign Deliveryman Modal */}
      <Modal isOpen={assignModal} onClose={() => setAssignModal(false)} title="Assign Delivery Person">
        <div className="space-y-4">
          <div className="space-y-2">
            {deliverymen.filter(d => d.isActive).map(dm => (
              <label key={dm._id} className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${selectedDeliveryman === dm._id ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <input type="radio" value={dm._id} checked={selectedDeliveryman === dm._id} onChange={() => setSelectedDeliveryman(dm._id)} className="accent-primary-600" />
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-700 text-sm">
                  {dm.name?.[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{dm.name}</p>
                  <p className="text-xs text-gray-400">{dm.phone} · {dm.vehicleType || 'Vehicle not set'}</p>
                  <p className="text-xs text-gray-400">{dm.totalDeliveries} deliveries completed</p>
                </div>
                <span className={`w-2 h-2 rounded-full ${dm.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`} />
              </label>
            ))}
            {deliverymen.length === 0 && <p className="text-center text-gray-500 text-sm py-4">No delivery personnel available</p>}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setAssignModal(false)} className="flex-1">Cancel</Button>
            <Button loading={updating} onClick={handleAssign} className="flex-1">Assign & Ship</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
