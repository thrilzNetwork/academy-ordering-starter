"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { COOKIE, isValidSession, sessionToken } from "../../lib/auth";
import { setStatus } from "../../lib/store";

export async function login(formData) {
  const password = String(formData.get("password") || "");
  const expected = await sessionToken(process.env.ADMIN_PASSWORD);
  if (!expected || (await sessionToken(password)) !== expected) redirect("/admin/login?error=1");
  (await cookies()).set(COOKIE, expected, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 12 });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(COOKIE);
  redirect("/admin/login");
}

const STATUSES = ["nuevo", "preparando", "listo", "entregado", "cancelado"];

export async function changeStatus(formData) {
  // El middleware ya protege /admin, pero cada acción vuelve a revisar: nunca confíes en una sola puerta.
  if (!(await isValidSession((await cookies()).get(COOKIE)?.value))) redirect("/admin/login");
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !STATUSES.includes(status)) return;
  await setStatus(id, status);
  revalidatePath("/admin");
}
