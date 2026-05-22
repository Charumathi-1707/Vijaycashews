import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-yellow-800">
          Vijay Cashews
        </h1>

        <div className="hidden gap-8 md:flex">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#quality">Quality</a>
          <a href="#reviews">Reviews</a>
        </div>

        <button className="relative">
          <FaShoppingCart className="text-2xl" />
          <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 text-xs text-white">
            2
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;