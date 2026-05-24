import { createContext, useEffect, useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import { fetchWishlists } from "../services/read/wishlist.service";
import { saveWishlist as apiSaveWishlist } from "../services/write/wishlist.service";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (!user) {
      setWishlistItems([]);
    }
  }, [user]);

  // Load wishlist from sheet for authenticated users
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!user) return;

      try {
        const lists = await fetchWishlists();
        const my = lists.find((l) => l.email?.toLowerCase() === user.email.toLowerCase());
        if (mounted && my) {
          try {
            const items = JSON.parse(my.items || "[]");
            setWishlistItems(items);
          } catch (e) {
            setWishlistItems([]);
          }
        }
      } catch (err) {
        console.error("Failed to load wishlists:", err);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [user]);

  // Persist wishlist to sheet when user is present
  useEffect(() => {
    if (!user) return;

    const persist = async () => {
      try {
        await apiSaveWishlist(user.email, wishlistItems);
      } catch (err) {
        console.error("Failed to save wishlist:", err);
      }
    };

    persist();
  }, [user, wishlistItems]);

  const addToWishlist = (product) => {
    if (!user) return;

    const exists = wishlistItems.find(
      (item) => item.id === product.id
    );

    if (!exists) {
      setWishlistItems([...wishlistItems, product]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(
      wishlistItems.filter((item) => item.id !== id)
    );
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const value = useMemo(
    () => ({
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [wishlistItems]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
