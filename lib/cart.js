// Funciones puras del carrito: reciben datos y devuelven datos, sin tocar la pantalla.
// Por eso se pueden probar con `npm test`.
//
// Un carrito es una lista de líneas: [{ id: "lomo-saltado", qty: 2 }].
// Los precios NUNCA se guardan en el carrito: siempre se leen del catálogo, para que nadie pueda cambiarlos.

export const MAX_QTY = 20;

export function addItem(cart, id, qty = 1) {
  const line = cart.find((l) => l.id === id);
  if (line) return cart.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
  return [...cart, { id, qty: Math.min(MAX_QTY, qty) }];
}

export function setQty(cart, id, qty) {
  const n = Math.floor(Number(qty));
  if (!Number.isFinite(n) || n <= 0) return cart.filter((l) => l.id !== id);
  return cart.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, n) } : l));
}

export function itemCount(cart) {
  return cart.reduce((a, l) => a + l.qty, 0);
}

/** Líneas con nombre y precio del catálogo. Las que no existen o están agotadas se marcan. */
export function priceLines(cart, products) {
  return cart.map((l) => {
    const p = products.find((x) => x.id === l.id);
    return {
      id: l.id,
      qty: l.qty,
      name: p ? p.name : "Producto no encontrado",
      unit: p ? p.price : 0,
      subtotal: p ? round(p.price * l.qty) : 0,
      ok: !!p && p.available,
    };
  });
}

export function cartTotal(cart, products) {
  return round(priceLines(cart, products).reduce((a, l) => a + (l.ok ? l.subtotal : 0), 0));
}

function round(n) {
  return Math.round(n * 100) / 100;
}
