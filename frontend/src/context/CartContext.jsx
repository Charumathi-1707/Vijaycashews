import {
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import useAuth from "../hooks/useAuth";
import { fetchCart } from "../services/read/cart.service";
import {
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
  updateCartQuantity as apiUpdateCartQuantity,
  clearCart as apiClearCart,
} from "../services/write/cart.service";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const normalizeCartItem = (item) => {
    const product = item.productId || {};
    const productId = typeof product === 'object' ? product._id || product.id : product;
    const id = item.id || item._id || productId;

    return {
      ...item,
      id,
      productId,
      name: item.productName || product.name || item.name || '',
      image: item.image || product.image || '',
      price:
        item.price != null
          ? item.price
          : product.price != null
          ? product.price
          : 0,
      originalPrice:
        item.originalPrice != null
          ? item.originalPrice
          : product.originalPrice,
      category: item.category || product.category || '',
      quantity: item.quantity ?? 1,
    };
  };

  const normalizeCartItems = (items) => items.map(normalizeCartItem);

  // Clear cart when user logs out
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setCartOpen(false);
    }
  }, [user]);

  // Load cart for authenticated users
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const items = await fetchCart();
        if (mounted && Array.isArray(items)) {
          setCartItems(normalizeCartItems(items));
        }
      } catch (err) {
        console.error("Failed to load cart:", err);
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [user]);

  // ADD TO CART
  const addToCart = useCallback(
    async (product) => {
      if (!user) return;

      const productId = product.id || product._id || product.productId;
      if (!productId) return;

      try {
        const exists = cartItems.find((item) => item.id === productId);

        if (exists) {
          // Update quantity in backend
          await apiUpdateCartQuantity(productId, exists.quantity + 1);
          setCartItems(
            cartItems.map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          );
        } else {
          // Add new item to backend
          await apiAddToCart(productId, 1);
          const newItem = normalizeCartItem({
            ...product,
            productId,
            quantity: 1,
          });
          setCartItems([...cartItems, newItem]);
        }

        setCartOpen(true);
      } catch (err) {
        console.error("Failed to add to cart:", err);
      }
    },
    [user, cartItems]
  );

  // REMOVE FROM CART
  const removeFromCart = useCallback(
    async (id) => {
      try {
        await apiRemoveFromCart(id);
        setCartItems(cartItems.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Failed to remove from cart:", err);
      }
    },
    [cartItems]
  );

  // INCREASE QUANTITY
  const increaseQuantity = useCallback(
    async (id) => {
      try {
        const item = cartItems.find((item) => item.id === id);
        if (item) {
          const newQuantity = item.quantity + 1;
          await apiUpdateCartQuantity(id, newQuantity);
          setCartItems(
            cartItems.map((item) =>
              item.id === id ? { ...item, quantity: newQuantity } : item
            )
          );
        }
      } catch (err) {
        console.error("Failed to update quantity:", err);
      }
    },
    [cartItems]
  );

  // DECREASE QUANTITY
  const decreaseQuantity = useCallback(
    async (id) => {
      try {
        const item = cartItems.find((item) => item.id === id);
        if (item) {
          if (item.quantity <= 1) {
            await apiRemoveFromCart(id);
            setCartItems(cartItems.filter((item) => item.id !== id));
          } else {
            const newQuantity = item.quantity - 1;
            await apiUpdateCartQuantity(id, newQuantity);
            setCartItems(
              cartItems.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
              )
            );
          }
        }
      } catch (err) {
        console.error("Failed to update quantity:", err);
      }
    },
    [cartItems]
  );

  // CLEAR CART
  const clearCart = useCallback(async () => {
    try {
      await apiClearCart();
      setCartItems([]);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  }, []);

  const isInCart = useCallback(
    (id) => cartItems.some((item) => item.id === id || item.productId === id),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isInCart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartOpen,
        setCartOpen,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};