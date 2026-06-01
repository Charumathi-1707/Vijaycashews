import { createContext, useEffect, useMemo, useState, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import { fetchWishlist } from "../services/read/wishlist.service";
import {
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
} from "../services/write/wishlist.service";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const normalizeWishlistItem = (item) => {
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
      category: item.category || product.category || '',
      description: item.description || product.description || '',
    };
  };

  const normalizeWishlistItems = (items) => items.map(normalizeWishlistItem);

  // Clear wishlist when user logs out
  useEffect(() => {
    if (!user) {
      setWishlistItems([]);
    }
  }, [user]);

  // Load wishlist for authenticated users
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const wishlist = await fetchWishlist();
        if (mounted && Array.isArray(wishlist)) {
          setWishlistItems(normalizeWishlistItems(wishlist));
        }
      } catch (err) {
        console.error("Failed to load wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [user]);

  const addToWishlist = useCallback(
    async (product) => {
      if (!user) return;

      const productId = product.id || product._id || product.productId;
      if (!productId) return;

      try {
        const exists = wishlistItems.find((item) => item.id === productId);

        if (!exists) {
          await apiAddToWishlist(productId);
          const newItem = normalizeWishlistItem({
            ...product,
            productId,
          });
          setWishlistItems([...wishlistItems, newItem]);
        }
      } catch (err) {
        console.error("Failed to add to wishlist:", err);
      }
    },
    [user, wishlistItems]
  );

  const removeFromWishlist = useCallback(
    async (id) => {
      try {
        await apiRemoveFromWishlist(id);
        setWishlistItems(wishlistItems.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Failed to remove from wishlist:", err);
      }
    },
    [wishlistItems]
  );

  const clearWishlist = useCallback(async () => {
    // Clear wishlist by removing all items
    try {
      for (const item of wishlistItems) {
        await apiRemoveFromWishlist(item.id);
      }
      setWishlistItems([]);
    } catch (err) {
      console.error("Failed to clear wishlist:", err);
    }
  }, [wishlistItems]);

  const isInWishlist = useCallback(
    (id) => wishlistItems.some((item) => item.id === id || item.productId === id),
    [wishlistItems]
  );

  const value = useMemo(
    () => ({
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      loading,
    }),
    [wishlistItems, addToWishlist, removeFromWishlist, clearWishlist, loading]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
