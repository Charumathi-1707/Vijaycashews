import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaSpinner,
  FaUserTie,
} from "react-icons/fa";
import MainLayout from "../../layouts/MainLayout";
import { fetchUsers } from "../../services/read/user.service";
import { createUser, updateUser, deleteUser } from "../../services/write/user.service";

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  address: "",
};

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editingDriver, setEditingDriver] = useState(null);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers("delivery");
      setDrivers(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load delivery drivers.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingDriver(null);
    setForm(initialForm);
    setError("");
    setSuccess("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setForm({
      name: driver.name || "",
      email: driver.email || "",
      password: "",
      phone: driver.phone || "",
      address: driver.address || "",
    });
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    if (!form.name || !form.email || (!editingDriver && !form.password)) {
      setError("Name, email and password are required for new drivers.");
      setSaving(false);
      return;
    }

    try {
      if (editingDriver) {
        const updates = {
          name: form.name,
          phone: form.phone,
          address: form.address,
        };
        await updateUser(editingDriver._id || editingDriver.id, updates);
        setSuccess("Driver updated successfully.");
      } else {
        await createUser({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: form.address,
        });
        setSuccess("Driver created successfully.");
      }
      resetForm();
      loadDrivers();
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to save driver.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (driverId) => {
    if (!window.confirm("Deactivate this driver?")) return;

    try {
      setSaving(true);
      await deleteUser(driverId);
      setSuccess("Driver deactivated successfully.");
      loadDrivers();
    } catch (err) {
      console.error(err);
      setError("Unable to deactivate driver.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <section className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 rounded-3xl bg-white p-8 shadow-lg">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-yellow-700">Admin Dashboard</p>
                <h1 className="mt-4 text-4xl font-bold text-gray-900">Driver Management</h1>
                <p className="mt-2 text-gray-600">
                  Add, edit and deactivate delivery drivers for order assignment.
                </p>
              </div>
              <div className="rounded-3xl bg-yellow-50 p-6 text-right">
                <p className="text-sm text-gray-500">Delivery drivers</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{drivers.length}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {editingDriver ? "Edit Driver" : "Create New Driver"}
                  </h2>
                  <p className="mt-2 text-gray-500">
                    {editingDriver ? "Update driver details." : "Add a new delivery partner."}
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <FaPlus /> New
                </button>
              </div>

              {(error || success) && (
                <div className={`rounded-2xl p-4 text-sm ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {error || success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Name</span>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                      placeholder="Driver name"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Email</span>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleInputChange}
                      disabled={Boolean(editingDriver)}
                      className="mt-2 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 disabled:cursor-not-allowed disabled:opacity-60"
                      placeholder="driver@example.com"
                    />
                  </label>
                </div>

                {!editingDriver && (
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Password</span>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                      placeholder="Choose a strong password"
                    />
                  </label>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Phone</span>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                      placeholder="+91 98765 43210"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Address</span>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                      placeholder="Delivery partner address"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-3 rounded-full bg-yellow-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  {editingDriver ? "Update Driver" : "Create Driver"}
                </button>
              </form>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center gap-3">
                <FaUserTie className="text-2xl text-yellow-600" />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Driver List</h2>
                  <p className="mt-1 text-gray-500">Manage all delivery users assigned to your orders.</p>
                </div>
              </div>

              {loading ? (
                <div className="text-gray-500">Loading drivers...</div>
              ) : drivers.length === 0 ? (
                <div className="rounded-3xl bg-yellow-50 p-6 text-gray-700">No drivers found yet.</div>
              ) : (
                <div className="space-y-4">
                  {drivers.map((driver) => (
                    <div key={driver._id || driver.id} className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{driver.name || driver.email}</p>
                          <p className="text-sm text-gray-600">{driver.email}</p>
                          <p className="text-sm text-gray-600">{driver.phone || "No phone"}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(driver)}
                            className="rounded-full bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-700"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(driver._id || driver.id)}
                            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                          >
                            <FaTrash /> Deactivate
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AdminDrivers;
