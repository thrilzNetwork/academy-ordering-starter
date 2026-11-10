import { listOrders, storeMode } from "../../lib/store";
import { money } from "../../lib/products";
import { STORE } from "../../lib/config";
import { orderNumber } from "../../lib/orders";
import { changeStatus, logout } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pedidos" };

const STATUSES = [["nuevo", "Nuevo"], ["preparando", "Preparando"], ["listo", "Listo"], ["entregado", "Entregado"], ["cancelado", "Cancelado"]];

export default async function Admin() {
  let orders = [];
  let failed = false;
  try { orders = await listOrders(); } catch (e) { console.error(e); failed = true; }
  const today = new Date().toISOString().slice(0, 10);
  const todays = orders.filter((o) => String(o.created_at).startsWith(today) && o.status !== "cancelado");
  return (
    <div className="stack">
      <div className="row">
        <h1 style={{ margin: 0 }}>Pedidos</h1>
        <span className="spacer" style={{ flex: 1 }} />
        <form action={logout}><button className="btn ghost">Salir</button></form>
      </div>
      {storeMode === "demo" && <p className="notice">Modo demo: los pedidos se guardan en memoria y se borran al reiniciar. Configura Supabase para guardarlos de verdad.</p>}
      {failed && <p className="notice" role="alert">No se pudieron leer los pedidos. Revisa la conexión con la base de datos.</p>}
      <p className="muted">Hoy: {todays.length} {todays.length === 1 ? "pedido" : "pedidos"} · {money(todays.reduce((a, o) => a + Number(o.total), 0), STORE.currency)}</p>
      {orders.length === 0 ? <p className="card">Todavía no hay pedidos.</p> : (
        <div className="card" style={{ overflowX: "auto" }}>
          <table>
            <thead><tr><th>#</th><th>Cliente</th><th>Pedido</th><th>Total</th><th>Estado</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{orderNumber(o.id)}<div className="muted">{new Date(o.created_at).toLocaleString("es-PE")}</div></td>
                  <td>{o.name}<div className="muted">{o.phone}</div><div className="muted">{o.delivery === "delivery" ? o.address : "Recojo"}</div></td>
                  <td>{(o.items || []).map((l) => <div key={l.id}>{l.qty} × {l.name}</div>)}{o.notes && <div className="muted">Nota: {o.notes}</div>}</td>
                  <td>{money(o.total, STORE.currency)}<div className="muted">Pago {o.payment}</div></td>
                  <td>
                    <form action={changeStatus} className="row">
                      <input type="hidden" name="id" value={o.id} />
                      <select name="status" defaultValue={o.status} aria-label={`Estado del pedido ${orderNumber(o.id)}`} style={{ width: 140 }}>
                        {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                      <button className="btn ghost">Guardar</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
