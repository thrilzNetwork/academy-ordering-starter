import { describe, expect, it } from "vitest";
import { addItem, setQty, itemCount, priceLines, cartTotal } from "./cart";

const products = [
  { id: "a", name: "Plato A", price: 22, available: true },
  { id: "b", name: "Plato B", price: 8.5, available: true },
  { id: "c", name: "Plato C", price: 6, available: false },
];

describe("carrito", () => {
  it("agrega y suma cantidades del mismo producto", () => {
    const cart = addItem(addItem([], "a"), "a", 2);
    expect(cart).toEqual([{ id: "a", qty: 3 }]);
    expect(itemCount(cart)).toBe(3);
  });

  it("no pasa de 20 unidades por producto", () => {
    expect(addItem([], "a", 50)[0].qty).toBe(20);
  });

  it("quita el producto si la cantidad es 0 o no es un número", () => {
    expect(setQty([{ id: "a", qty: 2 }], "a", 0)).toEqual([]);
    expect(setQty([{ id: "a", qty: 2 }], "a", "hola")).toEqual([]);
  });

  it("calcula el total con los precios del catálogo", () => {
    const cart = [{ id: "a", qty: 2 }, { id: "b", qty: 1 }];
    expect(cartTotal(cart, products)).toBe(52.5);
  });

  it("no cobra productos agotados ni inexistentes", () => {
    const cart = [{ id: "a", qty: 1 }, { id: "c", qty: 1 }, { id: "zzz", qty: 1 }];
    expect(cartTotal(cart, products)).toBe(22);
    expect(priceLines(cart, products).map((l) => l.ok)).toEqual([true, false, false]);
  });
});
