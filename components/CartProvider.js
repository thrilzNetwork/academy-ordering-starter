"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { addItem, setQty } from "../lib/cart";

const CartContext = createContext(null);
const KEY = "cart-v1";

// Guarda el carrito en el navegador (localStorage) para que no se pierda al recargar.
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(saved)) setCart(saved);
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {}
  }, [cart, loaded]);

  const value = {
    cart,
    loaded,
    add: (id, qty = 1) => setCart((c) => addItem(c, id, qty)),
    set: (id, qty) => setCart((c) => setQty(c, id, qty)),
    clear: () => setCart([]),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
