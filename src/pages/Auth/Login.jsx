import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login, authLoading, authError } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);

    if (result.success) {
      navigate("/products");
      return;
    }

    setError(result.error || "Unable to login.");
  };

  return (
    <MainLayout>
      <section className="min-h-[calc(100vh-6rem)] bg-gray-50 py-24 px-6">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 shadow-md">
          <h1 className="text-4xl font-bold text-gray-900">Login</h1>
          <p className="mt-3 text-gray-600">
            Sign in to manage your cart, track orders, and view your account.
          </p>

          {(error || authError) && (
            <div className="mt-6 rounded-2xl bg-red-100 p-4 text-red-700">
              {error || authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border p-4 outline-none focus:border-yellow-700"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border p-4 outline-none focus:border-yellow-700"
            />
            <button
              type="submit"
              disabled={authLoading}
              className={`w-full rounded-full py-5 text-lg font-bold text-white transition ${authLoading ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-700 hover:bg-yellow-800"}`}
            >
              {authLoading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            New here?{' '}
            <Link to="/register" className="font-semibold text-yellow-700 underline">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </MainLayout>
  );
};

export default Login;
