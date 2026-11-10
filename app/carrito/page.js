"use client";

import { useState } from "react";
import { useCart } from "../../components/CartProvider";
import Checkout, { Confirmation } from "../../components/Checkout";
import { allProducts, money } from "../../lib/products";
import { cartTotal, priceLines } from "../../lib/cart";
import { STORE } from "../../lib/config";

export default function CartPage() {
  const { cart, loaded, set } = useCart();
  const [done, setDone] = useState(null); // pedido recién enviado: se muestra aunque el carrito ya esté vacío
  const products = allProducts();
  if (!loaded) return null;
  if (done) return <Confirmation done={done} store={STORE} />;

  const lines = priceLines(cart, products);
  const total = cartTotal(cart, products);
  if (lines.length === 0) {
    return (
      <div className="card stack">
        <h1>Tu carrito está vacío</h1>
        <a className="btn" href="/">Ver el menú</a>
      </div>
    );
  }

  return (
    <div className="stack">
      <h1>Tu pedido</h1>
      <div className="card" style={{ overflowX: "auto" }}>
        <table>
          <thead><tr><th>Producto</th><th>Cantidad</th><th>Subtotal</th></tr></thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.id}>
                <td>{l.name}{!l.ok && <div className="notice" style={{ marginTop: 4 }}>No disponible: no se cobra.</div>}</td>
                <td style={{ width: 110 }}>
                  <input type="number" min={0} max={20} value={l.qty} aria-label={`Cantidad de ${l.name}`} onChange={(e) => set(l.id, e.target.value)} />
                </td>
                <td>{money(l.subtotal, STORE.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="price" style={{ textAlign: "right" }}>Total: {money(total, STORE.currency)}</p>
      </div>
      <Checkout store={STORE} onDone={setDone} />
    </div>
  );
}
