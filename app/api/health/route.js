import { NextResponse } from "next/server";
import { listOrders, storeMode } from "../../../lib/store";

export const dynamic = "force-dynamic";

// GET /api/health: una revisión rápida para saber si la tienda y su base de datos responden.
// Puedes conectar un servicio de monitoreo gratuito a esta dirección para que te avise si se cae.
export async function GET() {
  const started = Date.now();
  let database = "not_used";
  if (storeMode === "database") {
    try { await listOrders(1); database = "ok"; } catch { database = "error"; }
  }
  const ok = database !== "error";
  return NextResponse.json({ ok, mode: storeMode, database, ms: Date.now() - started }, { status: ok ? 200 : 503 });
}
