import {
  FaTrash,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

import useCart from "../../../hooks/useCart";

const CartItem = ({ item }) => {
  const {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  return (
    <div className="flex gap-4 border-b border-gray-200 py-5">

      {/* Image */}
      <img
        src={item.image}
        alt={item.name}
        className="h-24 w-24 rounded-2xl object-cover"
      />

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between">

        <div>
          <h3 className="text-lg font-bold">
            {item.name}
          </h3>

          <p className="mt-1 text-yellow-700">
            ₹{item.price}
          </p>
        </div>

        {/* Quantity */}
        <div className="mt-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              onClick={() => decreaseQuantity(item.id)}
              className="rounded-full bg-gray-100 p-2 transition hover:bg-yellow-700 hover:text-white"
            >
              <FaMinus />
            </button>

            <span className="font-semibold">
              {item.quantity}
            </span>

            <button
              onClick={() => increaseQuantity(item.id)}
              className="rounded-full bg-gray-100 p-2 transition hover:bg-yellow-700 hover:text-white"
            >
              <FaPlus />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500 transition hover:text-red-700"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;