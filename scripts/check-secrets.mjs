// Busca secretos escritos por error en el código antes de subirlo a GitHub.
// Uso: npm run check
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const SKIP = new Set(["node_modules", ".next", ".git", ".netlify", ".vercel"]);
const PATTERNS = [
  [/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/, "parece una clave JWT (por ejemplo, la service role de Supabase)"],
  [/sk_live_[A-Za-z0-9]{10,}/, "parece una clave secreta de Stripe"],
  [/^\s*ADMIN_PASSWORD=\S+/m, "hay una contraseña de admin escrita en un archivo"],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "hay una clave privada"],
];

const hits = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (/\.(png|jpg|jpeg|gif|webp|ico|lock)$/i.test(name) || name === "package-lock.json") continue;
    if (/^\.env(\.local|\.production)?$/.test(name)) continue; // ignorados por .gitignore: aquí sí van los secretos
    const text = readFileSync(p, "utf8");
    for (const [re, why] of PATTERNS) if (re.test(text)) hits.push(`${p}: ${why}`);
  }
}
walk(process.cwd());

if (hits.length) {
  console.error("Revisa estos archivos antes de subir tu código:\n" + hits.map((h) => " - " + h).join("\n"));
  process.exit(1);
}
console.log("Sin secretos a la vista.");
