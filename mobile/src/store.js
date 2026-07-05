import { createContext, useContext, useMemo, useReducer } from 'react';

const Ctx = createContext(null);

function reducer(cart, action) {
  switch (action.type) {
    case 'add': {
      const found = cart.find((i) => i._id === action.item._id);
      return found
        ? cart.map((i) => (i._id === action.item._id ? { ...i, qty: i.qty + 1 } : i))
        : [...cart, { ...action.item, qty: 1 }];
    }
    case 'qty': return cart.map((i) => (i._id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i));
    case 'remove': return cart.filter((i) => i._id !== action.id);
    case 'clear': return [];
    default: return cart;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(reducer, []);
  const value = useMemo(() => ({
    cart,
    dispatch,
    count: cart.reduce((n, i) => n + i.qty, 0),
    total: cart.reduce((n, i) => n + i.qty * i.price, 0),
  }), [cart]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => useContext(Ctx);
