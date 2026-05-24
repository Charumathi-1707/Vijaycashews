import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { fetchOrders } from "../../services/read/order.service";
import { updateOrderStatus } from "../../services/write/order.service";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        const deliveryOrders = data.filter((order) =>
          ["Packed", "Shipped", "Out for Delivery"].includes(order.status)
        );
        setOrders(deliveryOrders);
      } catch (err) {
        console.error(err);
        setError("Unable to load delivery orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const updateStatus = async (id, nextStatus) => {
    setSaving(true);
    setError("");

    try {
      await updateOrderStatus(id, nextStatus);
      setOrders((current) =>
        current.map((order) =>
          order.orderId === id ? { ...order, status: nextStatus } : order
        )
      );
    } catch (err) {
      console.error(err);
      setError("Unable to update order status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <section className="min-h-[calc(100vh-6rem)] bg-gray-50 py-24 px-6">
        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-10 shadow-md">
          <h1 className="text-4xl font-bold text-gray-900">Delivery Dashboard</h1>
          <p className="mt-3 text-gray-600">
            View and update the orders that are ready for delivery.
          </p>

          {loading ? (
            <div className="mt-10 text-gray-500">Loading delivery orders...</div>
          ) : error ? (
            <div className="mt-10 rounded-2xl bg-red-100 p-4 text-red-700">{error}</div>
          ) : orders.length === 0 ? (
            <div className="mt-10 rounded-3xl bg-yellow-50 p-8 text-gray-700">
              No delivery orders are currently assigned. Check back later.
            </div>
          ) : (
            <div className="mt-10 space-y-6">
              {orders.map((order) => (
                <div key={order.orderId} className="rounded-3xl border border-gray-200 p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-yellow-700">Order ID</p>
                      <p className="text-xl font-bold text-gray-900">{order.orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-wide text-gray-700">Status</p>
                      <p className="text-xl font-semibold text-gray-900">{order.status || "Pending"}</p>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-wide text-gray-700">Customer</p>
                      <p className="text-xl font-semibold text-gray-900">{order.customerName || order.name || order.email}</p>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="font-semibold text-gray-700">Phone</p>
                      <p className="mt-2 text-gray-600">{order.phone}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Delivery Address</p>
                      <p className="mt-2 text-gray-600">{order.address}, {order.city} - {order.pincode}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Order Items</p>
                      <p className="mt-2 text-gray-600">{order.products}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => updateStatus(order.orderId, "Out for Delivery")}
                      disabled={saving || order.status === "Out for Delivery" || order.status === "Delivered"}
                      className="rounded-full bg-yellow-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-yellow-800 disabled:bg-gray-300"
                    >
                      Mark Out for Delivery
                    </button>
                    <button
                      onClick={() => updateStatus(order.orderId, "Delivered")}
                      disabled={saving || order.status === "Delivered"}
                      className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:bg-gray-300"
                    >
                      Mark Delivered
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default DeliveryDashboard;
