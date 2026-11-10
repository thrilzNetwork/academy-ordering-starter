import { login } from "../actions";

export const metadata = { title: "Entrar al panel" };

export default async function Login({ searchParams }) {
  const { error } = await searchParams;
  const configured = !!process.env.ADMIN_PASSWORD;
  return (
    <form action={login} className="card stack" style={{ maxWidth: 420 }}>
      <h1>Panel de la tienda</h1>
      {!configured && <p className="notice">Falta configurar la contraseña. Agrega ADMIN_PASSWORD en .env.local (o en las variables de entorno de tu hosting) y reinicia.</p>}
      {error && <p className="notice" role="alert">Contraseña incorrecta.</p>}
      <div><label htmlFor="password">Contraseña</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div>
      <button className="btn" disabled={!configured}>Entrar</button>
    </form>
  );
}
