import { notFound } from "next/navigation";
import { allProducts, findProduct, money } from "../../../lib/products";
import { STORE } from "../../../lib/config";

export function generateStaticParams() {
  return allProducts().map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const p = findProduct(id);
  if (!p) notFound();
  return (
    <div className="card stack" style={{ maxWidth: 560 }}>
      <a href="/">← Volver al menú</a>
      <div style={{ fontSize: 64 }} aria-hidden="true">{p.emoji}</div>
      <h1>{p.name}</h1>
      <p className="muted">{p.description}</p>
      <p className="price">{money(p.price, STORE.currency)}</p>
      {!p.available && <p className="notice">Agotado por hoy.</p>}
    </div>
  );
}
