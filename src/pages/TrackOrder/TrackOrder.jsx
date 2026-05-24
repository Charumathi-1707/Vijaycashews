import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { fetchOrders } from "../../services/read/order.service";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        console.error("Track order load error:", err);
        setError("Unable to load order data right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(null);
    setError("");

    const normalizedId = orderId.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedId && !normalizedEmail) {
      setError("Please enter an order ID or email address.");
      return;
    }

    const foundOrder = orders.find((order) => {
      const orderMatch = order.orderId?.toString().trim() === normalizedId;
      const emailMatch = order.email?.toLowerCase().trim() === normalizedEmail;
      return normalizedId && orderMatch ? true : normalizedEmail && emailMatch ? true : false;
    });

    if (!foundOrder) {
      setError("Order not found. Please verify your order ID or email.");
      return;
    }

    setResult(foundOrder);
  };

  return (
    <MainLayout>
      <section className="min-h-[calc(100vh-6rem)] bg-gray-50 py-24 px-6">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-md">
          <h1 className="text-4xl font-bold text-gray-900">Track Your Order</h1>
          <p className="mt-3 text-gray-600">
            Enter your order ID or email address to see the current delivery status.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Order ID"
              className="w-full rounded-2xl border p-4 outline-none focus:border-yellow-700"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-2xl border p-4 outline-none focus:border-yellow-700"
            />

            <button
              type="submit"
              className="w-full rounded-full bg-yellow-700 py-5 text-lg font-bold text-white transition hover:bg-yellow-800"
            >
              Track Order
            </button>
          </form>

          {loading && (
            <div className="mt-10 text-center text-gray-500">Loading orders...</div>
          )}

          {error && !loading && (
            <div className="mt-10 rounded-2xl bg-red-100 p-4 text-red-700">{error}</div>
          )}

          {result && (
            <div className="mt-10 rounded-3xl bg-yellow-50 p-8">
              <h2 className="text-2xl font-bold text-gray-900">Order Status</h2>
              <div className="mt-6 space-y-4 text-gray-700">
                <div>
                  <span className="font-semibold">Order ID:</span> {result.orderId}
                </div>
                <div>
                  <span className="font-semibold">Customer:</span> {result.customerName || result.name || result.email}
                </div>
                <div>
                  <span className="font-semibold">Email:</span> {result.email || "-"}
                </div>
                <div>
                  <span className="font-semibold">Status:</span> {result.status || result.orderStatus || "Pending"}
                </div>
                <div>
                  <span className="font-semibold">Shipment:</span> {result.shipment || result.deliveryStatus || "Preparing"}
                </div>
                <div>
                  <span className="font-semibold">Total:</span> ₹{result.total || result.amount || "0"}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default TrackOrder;
