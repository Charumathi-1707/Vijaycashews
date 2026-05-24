import {
  createContext,
  useEffect,
  useState,
} from "react";
import useAuth from "../hooks/useAuth";
import { fetchCarts } from "../services/read/cart.service";
import { saveCart as apiSaveCart } from "../services/write/cart.service";

export const CartContext = createContext();

export const CartProvider = ({
  children,
}) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // NEW
  const [cartOpen, setCartOpen] =
    useState(false);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setCartOpen(false);
    }
  }, [user]);

  // Persist cart to sheet for authenticated users
  useEffect(() => {
    if (!user) return;

    const persist = async () => {
      try {
        await apiSaveCart(user.email, cartItems);
      } catch (err) {
        console.error("Failed to save cart:", err);
      }
    };

    persist();
  }, [user, cartItems]);

  // Load cart for authenticated users
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!user) return;

      try {
        const carts = await fetchCarts();
        const mine = carts.find((c) => c.email?.toLowerCase() === user.email.toLowerCase());
        if (mounted && mine) {
          try {
            const items = JSON.parse(mine.items || "[]");
            setCartItems(items);
          } catch (e) {
            setCartItems([]);
          }
        }
      } catch (err) {
        console.error("Failed to load carts:", err);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [user]);

  // ADD TO CART
  const addToCart = (product) => {
    if (!user) return;

    const exists = cartItems.find(
      (item) => item.id === product.id
    );

    if (exists) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }

    // AUTO OPEN CART
    setCartOpen(true);
  };

  // REMOVE
  const removeFromCart = (id) => {
    setCartItems(
      cartItems.filter(
        (item) => item.id !== id
      )
    );
  };

  // INCREASE
  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  // DECREASE
  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // CLEAR
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,

        // NEW
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};