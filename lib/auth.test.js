import { afterEach, describe, expect, it } from "vitest";
import { isValidSession, sessionToken } from "./auth";

afterEach(() => { delete process.env.ADMIN_PASSWORD; });

describe("sesión del panel", () => {
  it("sin contraseña configurada, nadie entra", async () => {
    expect(await isValidSession("cualquier-cosa")).toBe(false);
    expect(await isValidSession(undefined)).toBe(false);
  });
  it("la cookie guarda una huella, no la contraseña", async () => {
    const t = await sessionToken("clave-larga-de-prueba");
    expect(t).toMatch(/^[0-9a-f]{64}$/);
    expect(t).not.toContain("clave");
  });
  it("solo la huella correcta abre el panel", async () => {
    process.env.ADMIN_PASSWORD = "clave-larga-de-prueba";
    expect(await isValidSession(await sessionToken("clave-larga-de-prueba"))).toBe(true);
    expect(await isValidSession(await sessionToken("otra"))).toBe(false);
  });
});
