import CartSummary from "../../Cart/components/CartSummary";

const Section2 = () => {
  return (
    <div className="rounded-3xl bg-yellow-50 p-6">
      <h2 className="text-3xl font-bold text-gray-900">Order Summary</h2>
      <div className="mt-6">
        <CartSummary />
      </div>
    </div>
  );
};

export default Section2;
