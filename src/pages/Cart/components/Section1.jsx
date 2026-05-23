import { Link } from "react-router-dom";
import useCart from "../../../hooks/useCart";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyState from "../../../components/common/EmptyState";

const Section1 = () => {
  const { cartItems } = useCart();

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-5xl font-bold text-gray-900">Your Cart</h1>

        {cartItems.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            description="Add a few premium cashew products to continue."
            actionText="Continue Shopping"
            actionLink="/products"
          />
        ) : (
          <div className="mt-12 grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <CartSummary />
          </div>
        )}

        <div className="mt-12">
          <Link
            to="/products"
            className="inline-flex rounded-full bg-yellow-700 px-8 py-4 text-white transition hover:bg-yellow-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Section1;
