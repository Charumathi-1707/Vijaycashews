import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <MainLayout>
      <section className="min-h-[calc(100vh-6rem)] bg-gray-50 py-24 px-6">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-md text-center">
          <h1 className="text-5xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-6 text-gray-600">
            You do not have permission to view this page.
          </p>
          <Link
            to="/products"
            className="mt-10 inline-block rounded-full bg-yellow-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-yellow-800"
          >
            Back to products
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Unauthorized;
