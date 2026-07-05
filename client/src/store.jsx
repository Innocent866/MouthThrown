import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const Ctx = createContext(null);

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};

function reducer(state, action) {
  switch (action.type) {
    case 'login': return { ...state, user: action.user };
    case 'logout': return { ...state, user: null };
    case 'add': {
      const found = state.cart.find((i) => i._id === action.item._id);
      const cart = found
        ? state.cart.map((i) => (i._id === action.item._id ? { ...i, qty: i.qty + (action.qty || 1) } : i))
        : [...state.cart, { ...action.item, qty: action.qty || 1 }];
      return { ...state, cart };
    }
    case 'qty': return { ...state, cart: state.cart.map((i) => (i._id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i)) };
    case 'remove': return { ...state, cart: state.cart.filter((i) => i._id !== action.id) };
    case 'clear': return { ...state, cart: [] };
    default: return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => ({
    user: load('mt-user', null),
    cart: load('mt-cart', []),
  }));

  useEffect(() => localStorage.setItem('mt-cart', JSON.stringify(state.cart)), [state.cart]);
  useEffect(() => {
    if (state.user) localStorage.setItem('mt-user', JSON.stringify(state.user));
    else localStorage.removeItem('mt-user');
  }, [state.user]);

  // memoized so consumers don't recompute totals on unrelated renders
  const value = useMemo(() => ({
    ...state,
    dispatch,
    count: state.cart.reduce((n, i) => n + i.qty, 0),
    total: state.cart.reduce((n, i) => n + i.qty * i.price, 0),
  }), [state]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
