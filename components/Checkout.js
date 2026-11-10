"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { orderNumber, whatsappLink, whatsappText } from "../lib/orders";
import { money } from "../lib/products";

const FIELD_ERRORS = {
  name: "Escribe tu nombre (2 a 80 letras).",
  phone: "Escribe un teléfono válido.",
  address: "Escribe la dirección de entrega.",
  notes: "La nota es muy larga (máximo 300 letras).",
  items: "Tu carrito no tiene productos disponibles.",
};

export default function Checkout({ store, onDone }) {
  const { cart, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", delivery: "pickup", address: "", notes: "" });
  const [paid, setPaid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState([]);
  const up = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErrors([]);
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, items: cart }) });
      const data = await res.json();
      if (!res.ok) { setErrors(data.fields || ["save"]); return; }
      onDone({ id: data.id, order: data.order });
      clear();
    } catch {
      setErrors(["save"]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card stack" onSubmit={submit} noValidate>
      <h2>Datos del pedido</h2>
      <div><label htmlFor="name">Nombre</label><input id="name" autoComplete="name" value={form.name} onChange={up("name")} required maxLength={80} /></div>
      <div><label htmlFor="phone">Teléfono</label><input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={up("phone")} required /></div>
      <div>
        <label htmlFor="delivery">Entrega</label>
        <select id="delivery" value={form.delivery} onChange={up("delivery")}>
          <option value="pickup">Recojo en el local</option>
          <option value="delivery">Delivery</option>
        </select>
      </div>
      {form.delivery === "delivery" && (
        <div><label htmlFor="address">Dirección y referencia</label><input id="address" autoComplete="street-address" value={form.address} onChange={up("address")} maxLength={200} /></div>
      )}
      <div><label htmlFor="notes">Nota (opcional)</label><textarea id="notes" rows={2} value={form.notes} onChange={up("notes")} maxLength={300} /></div>

      <fieldset className="card stack" style={{ background: "#fafafa" }}>
        <legend><strong>Pago simulado</strong></legend>
        <p className="muted">Este proyecto no cobra dinero real. En una tienda de verdad aquí iría un QR de pago o una pasarela como Stripe.</p>
        <label className="row" style={{ fontWeight: 400 }}>
          <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} style={{ width: 20, minHeight: 20 }} />
          Simular que el cliente pagó
        </label>
      </fieldset>

      {errors.length > 0 && (
        <ul className="notice" role="alert">
          {errors.map((k) => <li key={k}>{FIELD_ERRORS[k] || "No se pudo guardar el pedido. Intenta de nuevo."}</li>)}
        </ul>
      )}
      <button className="btn" disabled={busy || !paid || cart.length === 0}>{busy ? "Enviando…" : "Confirmar pedido"}</button>
    </form>
  );
}

export function Confirmation({ done, store }) {
  const text = whatsappText(done.order, done.id, store);
  const link = whatsappLink(store.whatsapp, text);
  return (
    <div className="card stack">
      <h1>Pedido #{orderNumber(done.id)} recibido</h1>
      <p className="ok">Total: {money(done.order.total, store.currency)}. El pago fue simulado: no se cobró dinero real.</p>
      {link ? (
        <>
          <p>Último paso: envía tu pedido por WhatsApp para que la tienda lo confirme.</p>
          <a className="btn" href={link} target="_blank" rel="noreferrer">Enviar por WhatsApp</a>
        </>
      ) : (
        <p className="notice">La tienda todavía no configuró su número de WhatsApp (NEXT_PUBLIC_WHATSAPP_NUMBER).</p>
      )}
      <a href="/">Volver al menú</a>
    </div>
  );
}
