import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from './api';
import fallback from './data';

// Debouncing — wait for the user to stop typing before reacting
export function useDebouncedValue(value, ms = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

// Throttling — run at most once every `ms` (trailing call kept)
export function useThrottledCallback(fn, ms = 200) {
  const last = useRef(0);
  const timer = useRef();
  const fnRef = useRef(fn);
  fnRef.current = fn;
  return useMemo(() => (...args) => {
    const now = Date.now();
    const run = () => { last.current = Date.now(); fnRef.current(...args); };
    if (now - last.current >= ms) run();
    else {
      clearTimeout(timer.current);
      timer.current = setTimeout(run, ms - (now - last.current));
    }
  }, [ms]);
}

// Products from the API, with a local demo catalogue as offline fallback
export function useProducts() {
  const [products, setProducts] = useState(null); // null = loading
  useEffect(() => {
    let on = true;
    api.get('/item/getallproducts')
      .then((r) => on && setProducts(Array.isArray(r.data) && r.data.length ? r.data : fallback))
      .catch(() => on && setProducts(fallback));
    return () => { on = false; };
  }, []);
  return products;
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  useEffect(() => {
    let on = true;
    setProduct(null);
    api.get(`/item/getproductbyid/${id}`)
      .then((r) => on && setProduct(r.data))
      .catch(() => on && setProduct(fallback.find((p) => p._id === id) || 'missing'));
    return () => { on = false; };
  }, [id]);
  return product;
}
