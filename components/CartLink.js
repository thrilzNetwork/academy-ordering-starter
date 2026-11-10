"use client";

import { useCart } from "./CartProvider";
import { itemCount } from "../lib/cart";

export default function CartLink() {
  const { cart, loaded } = useCart();
  const n = loaded ? itemCount(cart) : 0;
  return <a href="/carrito">Carrito{n > 0 ? ` (${n})` : ""}</a>;
}
