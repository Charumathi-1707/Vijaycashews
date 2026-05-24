import MainLayout from "../../layouts/MainLayout";
import useWishlist from "../../hooks/useWishlist";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <MainLayout>
      <section className="min-h-[calc(100vh-6rem)] bg-gray-50 py-24 px-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-10 shadow-md">
          <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
          <p className="mt-3 text-gray-600">
            Your saved favorites are stored here for easy browsing later.
          </p>

          {wishlistItems.length === 0 ? (
            <div className="mt-10 rounded-3xl bg-yellow-50 p-8 text-gray-700">
              <p className="text-lg font-semibold">Your wishlist is empty.</p>
              <p className="mt-2">
                Browse products and add favorites to save them for later.
              </p>
              <Link
                to="/products"
                className="mt-6 inline-block rounded-full bg-yellow-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-yellow-800"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishlistItems.map((product) => (
                <div key={product.id} className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-52 w-full rounded-3xl object-cover"
                  />
                  <h2 className="mt-4 text-2xl font-bold text-gray-900">{product.name}</h2>
                  <p className="mt-2 text-gray-600 line-clamp-3">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold text-yellow-800">₹{product.price}</span>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Wishlist;
