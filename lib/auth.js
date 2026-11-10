// Acceso al panel con una contraseña guardada en la variable de entorno ADMIN_PASSWORD.
// La contraseña nunca va en el código ni en la página: el navegador solo recibe una "huella" (hash) en una cookie.
// Es suficiente para un proyecto de práctica. Una tienda real usaría cuentas de usuario (por ejemplo, Supabase Auth).

export const COOKIE = "admin_session";

export async function sessionToken(password) {
  if (!password) return null;
  const data = new TextEncoder().encode(`admin:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function isValidSession(cookieValue) {
  const expected = await sessionToken(process.env.ADMIN_PASSWORD);
  return !!expected && cookieValue === expected;
}
