import { NextResponse } from "next/server";
import { allProducts } from "../../../lib/products";
import { validateOrder } from "../../../lib/orders";
import { saveOrder } from "../../../lib/store";

// POST /api/orders: el navegador manda el pedido, el servidor lo revisa y lo guarda.
export async function POST(request) {
  let input;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const { ok, errors, order } = validateOrder(input, allProducts());
  if (!ok) return NextResponse.json({ error: "invalid", fields: errors }, { status: 400 });
  try {
    const saved = await saveOrder(order);
    return NextResponse.json({ id: saved.id, order });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}
