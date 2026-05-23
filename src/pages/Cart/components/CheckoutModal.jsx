import { useState } from "react";

import { FaTimes } from "react-icons/fa";

import useCart from "../../../hooks/useCart";

const CheckoutModal = ({ closeModal }) => {
  const { cartItems, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 999 ? 0 : 99;

  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let message =
      `🛒 *NEW ORDER* %0A%0A`;

    cartItems.forEach((item) => {
      message +=
        `📦 ${item.name} x ${item.quantity} - ₹${item.price * item.quantity}%0A`;
    });

    message += `%0A`;
    message += `💰 *Total:* ₹${total}%0A%0A`;

    message += `👤 *Customer Details* %0A`;
    message += `Name: ${formData.name}%0A`;
    message += `Phone: ${formData.phone}%0A`;
    message += `Address: ${formData.address}%0A`;
    message += `City: ${formData.city}%0A`;
    message += `Pincode: ${formData.pincode}%0A`;

    const whatsappNumber =
      "919751694905";

    const whatsappURL =
      `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(
      whatsappURL,
      "_blank"
    );

    clearCart();

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-6">

      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-10">

        {/* Close */}
        <button
          onClick={closeModal}
          className="absolute right-5 top-5 rounded-full bg-gray-100 p-3 transition hover:bg-red-500 hover:text-white"
        >
          <FaTimes />
        </button>

        <h2 className="text-4xl font-bold">
          Checkout
        </h2>

        {/* Summary */}
        <div className="mt-8 rounded-2xl bg-yellow-50 p-6">

          <h3 className="text-2xl font-bold">
            Order Summary
          </h3>

          <div className="mt-6 space-y-4">

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>

                <span>
                  ₹
                  {item.price *
                    item.quantity}
                </span>
              </div>
            ))}

            <div className="border-t pt-4">

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0
                    ? "Free"
                    : `₹${shipping}`}
                </span>
              </div>

              <div className="mt-4 flex justify-between text-xl font-bold">

                <span>Total</span>

                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-6"
        >

          <input
            type="text"
            name="name"
            required
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="rounded-2xl border p-4 outline-none focus:border-yellow-700"
          />

          <input
            type="tel"
            name="phone"
            required
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="rounded-2xl border p-4 outline-none focus:border-yellow-700"
          />

          <textarea
            name="address"
            required
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="rounded-2xl border p-4 outline-none focus:border-yellow-700"
          />

          <div className="grid gap-6 md:grid-cols-2">

            <input
              type="text"
              name="city"
              required
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="rounded-2xl border p-4 outline-none focus:border-yellow-700"
            />

            <input
              type="text"
              name="pincode"
              required
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="rounded-2xl border p-4 outline-none focus:border-yellow-700"
            />
          </div>

          <button
            type="submit"
            className="rounded-full bg-yellow-700 py-5 text-lg font-bold text-white transition hover:bg-yellow-800"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;