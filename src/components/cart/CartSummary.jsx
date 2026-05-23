import useCart from "../../hooks/useCart";

const CartSummary = () => {
  const { cartItems } = useCart();

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 999 ? 0 : 99;

  const total = subtotal + shipping;

  return (
    <div className="rounded-3xl bg-yellow-50 p-6">

      <h3 className="text-2xl font-bold">
        Order Summary
      </h3>

      <div className="mt-8 space-y-4">

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? "Free" : `₹${shipping}`}
          </span>
        </div>

        <div className="border-t pt-4 text-xl font-bold">

          <div className="flex justify-between">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;