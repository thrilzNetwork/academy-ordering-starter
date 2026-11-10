import { NextResponse } from "next/server";
import { COOKIE, isValidSession } from "./lib/auth";

// Antes de abrir cualquier página de /admin, revisa que haya una sesión válida.
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin/login")) return NextResponse.next();
  if (await isValidSession(request.cookies.get(COOKIE)?.value)) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*"] };
