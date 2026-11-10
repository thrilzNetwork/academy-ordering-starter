# Lista de seguridad antes de publicar

Revísala antes de cada publicación. Si un punto no se cumple, no publiques todavía.

## Secretos
- [ ] `npm run check` dice "Sin secretos a la vista".
- [ ] `.env.local` no está en GitHub (está en `.gitignore`).
- [ ] La clave `SUPABASE_SERVICE_ROLE_KEY` solo se usa en el servidor (`lib/store.js`), nunca en un archivo con `"use client"` ni en una variable `NEXT_PUBLIC_`.
- [ ] `ADMIN_PASSWORD` es larga y no la usas en ningún otro servicio.

## Datos de los clientes
- [ ] El servidor revisa cada pedido (`lib/orders.js`) y recalcula el total con el catálogo.
- [ ] La tabla `orders` tiene la seguridad por filas activada y nadie la puede leer desde el navegador.
- [ ] Solo guardas lo necesario: nombre, teléfono y dirección. Nada de tarjetas ni documentos.

## Acceso
- [ ] `/admin` sin sesión te manda a la pantalla de contraseña.
- [ ] Con una contraseña incorrecta no entras.
- [ ] Cambiar el estado de un pedido sin sesión no funciona.

## Pagos
- [ ] Este proyecto solo simula el pago. Para cobrar de verdad hace falta un proveedor de pagos y revisar sus reglas.

## Pruebas
- [ ] `npm test` pasa.
- [ ] Probaste a mano: pedido correcto, pedido sin teléfono, delivery sin dirección, producto agotado.
