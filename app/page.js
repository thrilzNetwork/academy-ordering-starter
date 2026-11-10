import { allProducts, money } from "../lib/products";
import { STORE } from "../lib/config";

export default function Home() {
  const products = allProducts();
  const categories = [...new Set(products.map((p) => p.category))];
  return (
    <div className="stack">
      <h1>Menú</h1>
      {categories.map((cat) => (
        <section key={cat} className="stack">
          <h2>{cat}</h2>
          <div className="grid">
            {products.filter((p) => p.category === cat).map((p) => (
              <a key={p.id} href={`/producto/${p.id}`} className="card stack" style={{ textDecoration: "none", color: "inherit", opacity: p.available ? 1 : 0.55 }}>
                <div style={{ fontSize: 40 }} aria-hidden="true">{p.emoji}</div>
                <strong>{p.name}</strong>
                <span className="muted">{p.description}</span>
                <span className="price">{p.available ? money(p.price, STORE.currency) : "Agotado"}</span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
