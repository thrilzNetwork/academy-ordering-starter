import { priceLines, cartTotal } from "./cart";

// Revisa un pedido en el SERVIDOR antes de guardarlo. Nunca confíes en lo que manda el navegador:
// los precios se recalculan con el catálogo y cada dato se valida.
export function validateOrder(input, products) {
  const errors = [];
  const name = String(input?.name ?? "").trim();
  const phone = String(input?.phone ?? "").replace(/[^\d]/g, "");
  const delivery = input?.delivery === "delivery" ? "delivery" : "pickup";
  const address = String(input?.address ?? "").trim();
  const notes = String(input?.notes ?? "").trim();
  const cart = Array.isArray(input?.items) ? input.items.slice(0, 30) : [];

  if (name.length < 2 || name.length > 80) errors.push("name");
  if (phone.length < 6 || phone.length > 15) errors.push("phone");
  if (delivery === "delivery" && (address.length < 5 || address.length > 200)) errors.push("address");
  if (notes.length > 300) errors.push("notes");

  const clean = cart
    .map((l) => ({ id: String(l?.id ?? ""), qty: Math.floor(Number(l?.qty)) }))
    .filter((l) => l.id && Number.isFinite(l.qty) && l.qty > 0 && l.qty <= 20);
  const lines = priceLines(clean, products).filter((l) => l.ok);
  if (lines.length === 0) errors.push("items");

  return {
    ok: errors.length === 0,
    errors,
    order: {
      name, phone, delivery, address: delivery === "delivery" ? address : "", notes,
      items: lines.map(({ id, name: n, qty, unit, subtotal }) => ({ id, name: n, qty, unit, subtotal })),
      total: cartTotal(clean, products),
    },
  };
}

export function orderNumber(id) {
  return String(id).replace(/-/g, "").slice(0, 6).toUpperCase();
}

/** Texto que el cliente envía por WhatsApp. El cliente lo envía: la tienda nunca escribe primero. */
export function whatsappText(order, id, store) {
  const lines = order.items.map((l) => `• ${l.qty} × ${l.name}: ${store.currency} ${l.subtotal.toFixed(2)}`);
  return [
    `Hola, soy ${order.name}. Pedido #${orderNumber(id)} en ${store.name}:`,
    ...lines,
    `Total: ${store.currency} ${order.total.toFixed(2)}`,
    order.delivery === "delivery" ? `Entrega en: ${order.address}` : "Lo recojo en el local.",
    order.notes ? `Nota: ${order.notes}` : "",
  ].filter(Boolean).join("\n");
}

export function whatsappLink(number, text) {
  const n = String(number || "").replace(/[^\d]/g, "");
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : null;
}
