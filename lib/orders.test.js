import { describe, expect, it } from "vitest";
import { validateOrder, whatsappText, whatsappLink, orderNumber } from "./orders";

const products = [
  { id: "a", name: "Plato A", price: 22, available: true },
  { id: "c", name: "Plato C", price: 6, available: false },
];
const good = { name: "Ana", phone: "+51 987 654 321", delivery: "pickup", items: [{ id: "a", qty: 2 }] };

describe("validar pedido en el servidor", () => {
  it("acepta un pedido correcto y recalcula el total con el catálogo", () => {
    const r = validateOrder({ ...good, items: [{ id: "a", qty: 2, price: 0.01 }] }, products);
    expect(r.ok).toBe(true);
    expect(r.order.total).toBe(44);
    expect(r.order.phone).toBe("51987654321");
  });
  it("pide dirección solo para delivery", () => {
    expect(validateOrder({ ...good, delivery: "delivery" }, products).errors).toContain("address");
    expect(validateOrder({ ...good, delivery: "delivery", address: "Av. Siempre Viva 123" }, products).ok).toBe(true);
  });
  it("rechaza nombre, teléfono y carrito inválidos", () => {
    const r = validateOrder({ name: "A", phone: "12", items: [{ id: "c", qty: 1 }, { id: "zzz", qty: 1 }, { id: "a", qty: 99 }] }, products);
    expect(r.errors).toEqual(expect.arrayContaining(["name", "phone", "items"]));
  });
  it("arma el mensaje de WhatsApp y el enlace", () => {
    const { order } = validateOrder(good, products);
    const text = whatsappText(order, "abc12345-0000", { name: "Tienda", currency: "S/" });
    expect(text).toContain("Pedido #ABC123");
    expect(text).toContain("Total: S/ 44.00");
    expect(whatsappLink("+51 987 654 321", "hola")).toBe("https://wa.me/51987654321?text=hola");
    expect(whatsappLink("", "hola")).toBeNull();
    expect(orderNumber("abc12345-0000")).toBe("ABC123");
  });
});
