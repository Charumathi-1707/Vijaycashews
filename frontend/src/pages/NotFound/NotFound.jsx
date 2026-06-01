import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">

      <h1 className="text-8xl font-black text-yellow-700">
        404
      </h1>

      <h2 className="mt-6 text-4xl font-bold">
        Page Not Found
      </h2>

      <p className="mt-4 max-w-xl text-lg text-gray-600">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-10 rounded-full bg-yellow-700 px-8 py-4 font-semibold text-white transition hover:bg-yellow-800"
      >
        Go Back Home
      </Link>
    </section>
  );
};

export default NotFound;