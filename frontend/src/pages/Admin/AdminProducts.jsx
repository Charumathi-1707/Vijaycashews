import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaImage, FaCloudUploadAlt } from "react-icons/fa";
import MainLayout from "../../layouts/MainLayout";
import FALLBACK_IMAGE from "../../utils/imageFallback";
import { fetchProducts } from "../../services/read/product.service";
import { uploadProductImage, createProduct, updateProduct, deleteProduct } from "../../services/write/product.service";

const initialForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  originalPrice: "",
  stock: "",
  image: "",
  imagePublicId: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await uploadProductImage(formData);
      setForm((current) => ({ ...current, image: response.url, imagePublicId: response.publicId }));
      setSuccess("Image uploaded successfully.");
      setError("");
    } catch (err) {
      setError("Unable to upload image. Please try again.");
      console.error(err);
    } finally {
      setImageLoading(false);
    }
  };

  const populateForm = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      stock: product.stock || "",
      image: product.image || "",
      imagePublicId: product.imagePublicId || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingProduct(null);
    setForm(initialForm);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice) || Number(form.price),
      stock: Number(form.stock),
      image: form.image,
      imagePublicId: form.imagePublicId,
    };

    if (!payload.name || !payload.price || !payload.image) {
      setError("Name, price, and image are required.");
      setSaving(false);
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id || editingProduct.id, payload);
        setSuccess("Product updated successfully.");
      } else {
        await createProduct(payload);
        setSuccess("Product created successfully.");
      }
      resetForm();
      loadProducts();
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product permanently?")) {
      return;
    }

    try {
      setSaving(true);
      await deleteProduct(productId);
      setSuccess("Product deleted successfully.");
      loadProducts();
    } catch (err) {
      console.error(err);
      setError("Unable to delete product.");
    } finally {
      setSaving(false);
    }
  };

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((product) => product.isActive !== false).length;
    return { total, active };
  }, [products]);

  return (
    <MainLayout>
      <section className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-yellow-700">Admin Dashboard</p>
              <h1 className="mt-4 text-4xl font-bold text-gray-900">Product Management</h1>
              <p className="mt-2 text-gray-600">Create, edit, and delete products with Cloudinary image support.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-yellow-50 p-6">
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="mt-3 text-3xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <div className="rounded-3xl bg-emerald-50 p-6">
                <p className="text-sm text-gray-500">Active Products</p>
                <p className="mt-3 text-3xl font-semibold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="mb-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {editingProduct ? "Edit Product" : "Create New Product"}
                  </h2>
                  <p className="mt-2 text-gray-500">Upload a product image and save the product details.</p>
                </div>
                <button
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <FaPlus /> New
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Name</span>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                      placeholder="Cashew Nuts"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Category</span>
                    <input
                      name="category"
                      value={form.category}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                      placeholder="Dry Fruits"
                    />
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Price</span>
                    <input
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                      placeholder="499"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Original Price</span>
                    <input
                      name="originalPrice"
                      type="number"
                      value={form.originalPrice}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                      placeholder="599"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Stock</span>
                    <input
                      name="stock"
                      type="number"
                      value={form.stock}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                      placeholder="10"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Description</span>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="mt-2 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                    placeholder="Write a product description..."
                  />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Product Image</span>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex flex-1 items-center gap-3 rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                        <FaCloudUploadAlt className="h-5 w-5 text-yellow-700" />
                        <span>{form.image ? "Image uploaded" : "Upload JPG/PNG"}</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="product-image-upload"
                      />
                      <label htmlFor="product-image-upload" className="inline-flex cursor-pointer items-center justify-center rounded-full bg-yellow-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-800">
                        {imageLoading ? <FaSpinner className="animate-spin" /> : "Choose Image"}
                      </label>
                    </div>
                  </label>
                  {form.image && (
                    <div className="col-span-full rounded-3xl border border-gray-200 bg-gray-100 p-4">
                      <p className="text-sm font-medium text-gray-700">Preview</p>
                      <img src={form.image} alt="Preview" className="mt-3 h-48 w-full rounded-3xl object-cover" onError={(e)=>{e.target.onerror=null; e.target.src = FALLBACK_IMAGE}} />
                    </div>
                  )}
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
                {success && <p className="text-sm text-emerald-700">{success}</p>}

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-3xl bg-yellow-700 px-6 py-4 text-sm font-semibold text-white transition hover:bg-yellow-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? <FaSpinner className="animate-spin" /> : editingProduct ? "Update Product" : "Create Product"}
                </button>
              </form>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Product Catalog</h2>
                  <p className="mt-2 text-gray-500">Manage published items and keep product data up to date.</p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <FaSpinner className="h-10 w-10 animate-spin text-yellow-700" />
                </div>
              ) : (
                <div className="space-y-4">
                  {products.length === 0 ? (
                    <p className="text-gray-500">No products available.</p>
                  ) : (
                    products.map((product) => (
                      <div key={product._id || product.id} className="rounded-3xl border border-gray-200 p-4">
                        <div className="flex items-start gap-4">
                          <img src={product.image} alt={product.name} className="h-24 w-24 rounded-3xl object-cover" onError={(e)=>{e.target.onerror=null; e.target.src = FALLBACK_IMAGE}} />
                          <div className="flex-1">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                                <p className="text-sm text-gray-500">{product.category || "Uncategorized"}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => populateForm(product)}
                                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                  <FaEdit /> Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(product._id || product.id)}
                                  className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                                >
                                  <FaTrash /> Delete
                                </button>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                              <span>₹{product.price}</span>
                              {product.originalPrice && <span className="line-through">₹{product.originalPrice}</span>}
                              <span>{product.stock} in stock</span>
                              <span>{product.rating?.toFixed(1) || 0} ★</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AdminProducts;
