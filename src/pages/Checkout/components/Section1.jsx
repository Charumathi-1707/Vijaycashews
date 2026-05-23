import { useState } from "react";

import useCart from "../../../hooks/useCart";

import {
  saveOrder,
} from "../../../services/order.service";

import generateOrderId from "../../../utils/generateOrderId";

const Section1 = () => {

  const {
    cartItems,
    clearCart,
  } = useCart();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",
    });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal =
    cartItems.reduce(
      (acc, item) =>
        acc +
        item.price *
          item.quantity,
      0
    );

  const deliveryCharge = 99;

  const total =
    subtotal + deliveryCharge;

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // SUBMIT
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (isSubmitting) {
        return;
      }

      setIsSubmitting(true);

      try {

        const orderId =
          generateOrderId();

        const orderData = {
          orderId,

          date:
            new Date().toLocaleString(),

          customerName:
            formData.name,

          phone:
            formData.phone,

          address:
            formData.address,

          city:
            formData.city,

          pincode:
            formData.pincode,

          products:
            cartItems
              .map(
                (item) =>
                  `${item.name} x${item.quantity}`
              )
              .join(", "),

          subtotal,

          delivery:
            deliveryCharge,

          total,
        };

        console.log(
          "ORDER DATA:",
          orderData
        );

        // SAVE TO SHEET
        await saveOrder(orderData);

        // WHATSAPP
        let message =
          `🛒 *NEW ORDER* %0A%0A`;

        message +=
          `🆔 Order ID: ${orderId}%0A%0A`;

        cartItems.forEach(
          (item) => {
            message +=
              `📦 ${item.name} x ${item.quantity} - ₹${item.price * item.quantity}%0A`;
          }
        );

        message += `%0A`;

        message +=
          `💰 *Total:* ₹${total}%0A%0A`;

        message +=
          `👤 *Customer Details* %0A`;

        message +=
          `Name: ${formData.name}%0A`;

        message +=
          `Phone: ${formData.phone}%0A`;

        message +=
          `Address: ${formData.address}%0A`;

        message +=
          `City: ${formData.city}%0A`;

        message +=
          `Pincode: ${formData.pincode}%0A`;

        const whatsappNumber =
          "919751694905";

        const whatsappURL =
          `https://wa.me/${whatsappNumber}?text=${message}`;

        window.open(
          whatsappURL,
          "_blank"
        );

        clearCart();

        alert(
          "Order placed successfully!"
        );

      } catch (error) {

        console.error(error);

        alert(
          "Failed to place order"
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="text-3xl font-bold">

        Billing Details
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-2xl border p-4 outline-none focus:border-yellow-700"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-2xl border p-4 outline-none focus:border-yellow-700"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full rounded-2xl border p-4 outline-none focus:border-yellow-700"
          required
        />

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full rounded-2xl border p-4 outline-none focus:border-yellow-700"
          rows="5"
          required
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="w-full rounded-2xl border p-4 outline-none focus:border-yellow-700"
          required
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          className="w-full rounded-2xl border p-4 outline-none focus:border-yellow-700"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full rounded-full py-5 text-lg font-bold text-white transition ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-700 hover:bg-yellow-800"}`}
        >
          {isSubmitting ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default Section1;