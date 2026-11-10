"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export default function AddToCart({ id, disabled }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <div className="row">
      <button className="btn" disabled={disabled} onClick={() => { add(id); setAdded(true); }}>Agregar al carrito</button>
      {added && <span role="status" className="muted">Agregado. <a href="/carrito">Ver carrito</a></span>}
    </div>
  );
}
