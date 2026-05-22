import { useState, useEffect } from 'react';

export default function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts([]);
  }, []);

  return products;
}
