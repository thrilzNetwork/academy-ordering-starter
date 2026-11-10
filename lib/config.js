// Datos de la tienda. Cámbialos por los de tu negocio.
// Los valores privados (claves, contraseñas) NO van aquí: van en variables de entorno (.env.local).
export const STORE = {
  name: process.env.NEXT_PUBLIC_STORE_NAME || "La cocina de ejemplo",
  currency: "S/",
  // Número con código de país, sin + ni espacios. Ej.: 51987654321
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
};
