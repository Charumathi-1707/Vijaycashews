import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, X, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { orderAPI } from '../../api/services';
import { Spinner, Pagination, Modal, Button } from '../../components/ui';
import { formatPrice, formatDate, getOrderStatusColor, getOrderStatusLabel } from '../../utils/helpers';
import toast from 'react-hot-toast';

const statusIcons = {
  pending: Clock, confirmed: CheckCircle, processing: Package,
  shipped: Truck, out_for_delivery: Truck, delivered: CheckCircle,
  cancelled: X, returned: AlertCircle,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => { fetchOrders(); }, [page, filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await orderAPI.getMy({ page, limit: 8, status: filterStatus });
      setOrders(data.orders);
      setTotal(data.total);
      setPages(data.pages);
    } catch {}
    setLoading(false);
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await orderAPI.cancel(cancelModal._id, cancelReason);
      toast.success('Order cancelled');
      setCancelModal(null);
      setCancelReason('');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel');
    }
    setCancelling(false);
  };

  const statusFilters = ['', 'pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-1">{total} orders total</p>
          </div>
          <Link to="/shop" className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
            Shop More
          </Link>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {statusFilters.map((s) => (
            <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterStatus === s ? 'bg-primary-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'}`}>
              {s ? getOrderStatusLabel(s) : 'All Orders'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-display font-bold mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet</p>
            <Link to="/shop"><Button>Start Shopping</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.status] || Package;
              return (
                <div key={order._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-sm font-bold text-gray-900">{order.orderId}</div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(order.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                      <p className="font-bold text-gray-900">{formatPrice(order.pricing.total)}</p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, i) => (
                          <img key={i} src={item.image || 'https://via.placeholder.com/40'} alt={item.name}
                            className="w-12 h-12 rounded-xl border-2 border-white object-cover" />
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-12 h-12 rounded-xl border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">{order.items.map(i => i.name).join(', ')}</p>
                        <p className="text-xs text-gray-400">{order.items.reduce((a, i) => a + i.quantity, 0)} items · {order.payment.method.toUpperCase()}</p>
                      </div>
                    </div>

                    {/* Delivery person */}
                    {order.deliveryman && ['shipped', 'out_for_delivery'].includes(order.status) && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-xl flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">
                          {order.deliveryman.name?.[0]}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-blue-800">Your delivery partner</p>
                          <p className="text-xs text-blue-600">{order.deliveryman.name} · {order.deliveryman.phone}</p>
                        </div>
                      </div>
                    )}

                    {/* Courier tracking */}
                    {order.shipping?.trackingId && (
                      <div className="mt-3 p-3 bg-orange-50 border border-orange-100 rounded-xl">
                        <p className="text-xs font-semibold text-orange-800 mb-1.5">📦 Shipped via {order.shipping.courierName}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500">Tracking ID</p>
                            <p className="font-mono font-bold text-gray-900 text-sm">{order.shipping.trackingId}</p>
                          </div>
                          {order.shipping.trackingUrl && (
                            <a href={order.shipping.trackingUrl} target="_blank" rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-colors">
                              Track →
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <button onClick={() => setSelectedOrder(order)}
                      className="text-sm text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">
                      View Details <ChevronRight className="w-4 h-4" />
                    </button>
                    {['pending', 'confirmed'].includes(order.status) && (
                      <button onClick={() => setCancelModal(order)}
                        className="text-sm text-red-500 font-semibold hover:text-red-600 transition-colors">
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </div>

      {/* Order Detail Modal */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order ${selectedOrder?.orderId}`} size="lg">
        {selectedOrder && (
          <div className="space-y-5">
            {/* Status Timeline */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-3">Order Timeline</h4>
              <div className="space-y-3">
                {selectedOrder.statusHistory?.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-primary-500 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold capitalize">{getOrderStatusLabel(h.status)}</p>
                      {h.message && <p className="text-xs text-gray-500">{h.message}</p>}
                      <p className="text-xs text-gray-400">{formatDate(h.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-3">Items Ordered</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <img src={item.image || ''} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(selectedOrder.pricing.subtotal)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{selectedOrder.pricing.shippingCost === 0 ? 'FREE' : formatPrice(selectedOrder.pricing.shippingCost)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax</span><span>{formatPrice(selectedOrder.pricing.tax)}</span></div>
              {selectedOrder.pricing.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(selectedOrder.pricing.discount)}</span></div>}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200"><span>Total</span><span>{formatPrice(selectedOrder.pricing.total)}</span></div>
            </div>

            {/* Address */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Delivery Address</h4>
              <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.name} · {selectedOrder.shippingAddress?.phone}</p>
              <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.pincode}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Modal */}
      <Modal isOpen={!!cancelModal} onClose={() => setCancelModal(null)} title="Cancel Order">
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">Are you sure you want to cancel order <span className="font-bold">{cancelModal?.orderId}</span>?</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason (optional)</label>
            <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} rows={3}
              placeholder="Tell us why you're cancelling..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none" />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setCancelModal(null)} className="flex-1">Keep Order</Button>
            <Button variant="danger" loading={cancelling} onClick={handleCancel} className="flex-1">Cancel Order</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
