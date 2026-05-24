import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import useAuth from "../../hooks/useAuth";
import { fetchOrders } from "../../services/read/order.service";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        const filtered = data.filter((order) =>
          order.email?.toLowerCase() === user.email.toLowerCase()
        );
        setOrders(filtered);
      } catch (err) {
        console.error(err);
        setError("Unable to load your orders at this time.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user.email]);

  return (
    <MainLayout>
      <section className="min-h-[calc(100vh-6rem)] bg-gray-50 py-24 px-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-10 shadow-md">
          <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-3 text-gray-600">
            Track the current status of all your orders from this page.
          </p>

          {loading ? (
            <div className="mt-10 text-gray-500">Loading orders...</div>
          ) : error ? (
            <div className="mt-10 rounded-2xl bg-red-100 p-4 text-red-700">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-10 rounded-2xl bg-yellow-50 p-8 text-gray-700">
              No orders found yet. Browse the products and request delivery from the guest checkout.
            </div>
          ) : (
            <div className="mt-10 space-y-6">
              {orders.map((order, index) => (
                <div
                  key={`${order.orderId}-${index}`}
                  className="rounded-3xl border border-gray-200 bg-gray-50 p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-yellow-700">
                        Order ID
                      </p>
                      <p className="text-xl font-bold text-gray-900">{order.orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                        Status
                      </p>
                      <p className="text-xl font-semibold text-gray-900">{order.status || "Pending"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                        Total
                      </p>
                      <p className="text-xl font-bold text-yellow-800">₹{order.total || "0"}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="font-semibold text-gray-700">Products</p>
                      <p className="mt-2 text-gray-600">{order.products}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Delivery Address</p>
                      <p className="mt-2 text-gray-600">
                        {order.address}, {order.city} - {order.pincode}
                      </p>
                    </div>
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

export default MyOrders;
