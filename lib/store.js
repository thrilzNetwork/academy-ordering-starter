// Dónde se guardan los pedidos.
//
// - Modo demo (sin configurar nada): en la memoria del servidor. Sirve para practicar en tu computadora,
//   pero se borra al reiniciar y NO sirve en internet.
// - Modo base de datos: si configuras SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local, los pedidos se
//   guardan en una tabla "orders" de Supabase (plan gratuito). La tabla se crea con supabase/orders.sql.
//
// Se habla con la base de datos por su API (fetch), sin librerías extra, para que veas cómo funciona.

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // secreta: solo en el servidor, nunca en el navegador

export const storeMode = URL && KEY ? "database" : "demo";

const memory = globalThis.__demoOrders || (globalThis.__demoOrders = []);

function headers() {
  return { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
}

export async function saveOrder(order) {
  const row = { ...order, status: "nuevo", payment: "simulado", created_at: new Date().toISOString() };
  if (storeMode === "demo") {
    const saved = { id: crypto.randomUUID(), ...row };
    memory.unshift(saved);
    return saved;
  }
  const res = await fetch(`${URL}/rest/v1/orders`, { method: "POST", headers: { ...headers(), Prefer: "return=representation" }, body: JSON.stringify(row) });
  if (!res.ok) throw new Error(`No se pudo guardar el pedido (${res.status})`);
  const [saved] = await res.json();
  return saved;
}

export async function listOrders(limit = 100) {
  if (storeMode === "demo") return memory.slice(0, limit);
  const res = await fetch(`${URL}/rest/v1/orders?select=*&order=created_at.desc&limit=${limit}`, { headers: headers(), cache: "no-store" });
  if (!res.ok) throw new Error(`No se pudieron leer los pedidos (${res.status})`);
  return res.json();
}

export async function setStatus(id, status) {
  if (storeMode === "demo") {
    const o = memory.find((x) => x.id === id);
    if (o) o.status = status;
    return;
  }
  const res = await fetch(`${URL}/rest/v1/orders?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: headers(), body: JSON.stringify({ status }) });
  if (!res.ok) throw new Error(`No se pudo actualizar el pedido (${res.status})`);
}
