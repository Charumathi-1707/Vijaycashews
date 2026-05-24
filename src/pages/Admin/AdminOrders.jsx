import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { fetchOrders } from "../../services/read/order.service";
import { updateOrderStatus } from "../../services/write/order.service";

const statusOptions = [
  "Pending",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load orders.");
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
          <h1 className="text-4xl font-bold text-gray-900">Admin Orders</h1>
          <p className="mt-3 text-gray-600">Update order status across the entire store.</p>

          {loading ? (
            <div className="mt-10 text-gray-500">Loading orders...</div>
          ) : error ? (
            <div className="mt-10 rounded-2xl bg-red-100 p-4 text-red-700">{error}</div>
          ) : orders.length === 0 ? (
            <div className="mt-10 rounded-3xl bg-yellow-50 p-8 text-gray-700">
              No orders were found.
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
                      <p className="text-sm uppercase tracking-wide text-gray-700">Current Status</p>
                      <p className="text-xl font-semibold text-gray-900">{order.status || "Pending"}</p>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-wide text-gray-700">Total</p>
                      <p className="text-xl font-bold text-yellow-800">₹{order.total || "0"}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="font-semibold text-gray-700">Customer</p>
                      <p className="mt-2 text-gray-600">{order.customerName || order.name || order.email}</p>
                      <p className="mt-1 text-gray-600">{order.email}</p>
                      <p className="mt-1 text-gray-600">{order.phone}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Delivery Address</p>
                      <p className="mt-2 text-gray-600">{order.address}, {order.city} - {order.pincode}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(order.orderId, status)}
                        disabled={saving || order.status === status}
                        className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 disabled:bg-gray-300"
                      >
                        {status}
                      </button>
                    ))}
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

export default AdminOrders;
