import { Link } from "react-router-dom";

const Section1 = () => {
  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-16 text-center shadow-xl">
        <h1 className="text-6xl font-black text-yellow-700">Success!</h1>
        <p className="mt-6 text-xl text-gray-600">
          Your order has been placed successfully. Thank you for choosing our premium cashews.
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex rounded-full bg-yellow-700 px-8 py-4 text-white transition hover:bg-yellow-800"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
};

export default Section1;
