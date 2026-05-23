const Section1 = () => {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-3xl font-bold">Billing Details</h2>
      <form className="mt-8 space-y-6">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full rounded-2xl border p-4 outline-none focus:border-yellow-700"
        />
        <input
          type="email"
          placeholder="Email Address"
          className="w-full rounded-2xl border p-4 outline-none focus:border-yellow-700"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full rounded-2xl border p-4 outline-none focus:border-yellow-700"
        />
        <textarea
          placeholder="Address"
          className="w-full rounded-2xl border p-4 outline-none focus:border-yellow-700"
          rows="5"
        />
        <button
          type="submit"
          className="w-full rounded-full bg-yellow-700 py-5 text-lg font-bold text-white transition hover:bg-yellow-800"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Section1;
