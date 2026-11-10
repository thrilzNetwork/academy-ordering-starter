# Tienda de pedidos: proyecto de práctica de Attenda Academy

Una tienda de pedidos sencilla para aprender a construir, publicar y operar una aplicación. Es el proyecto de la
**Misión 5** de Attenda Academy. Usa datos inventados y un pago **simulado**: no cobra dinero real.

Cada paso de la misión tiene su propia rama. Si te trabas, compara tu código con la rama del paso o salta a ella.

| Rama | Lo que agrega |
| --- | --- |
| `step-01-setup` | El proyecto corriendo en tu computadora |
| `step-02-catalog` | El menú y la página de cada producto |
| `step-03-cart` | El carrito y el resumen del pedido |
| `step-04-orders` | Guardar pedidos, pago simulado y envío por WhatsApp |
| `step-05-admin` | Panel con contraseña para ver y cambiar pedidos |
| `step-06-checks` | Pruebas y lista de seguridad |
| `step-07-deploy` | Publicar en internet |
| `step-08-operate` | Operar, revisar uso y calcular costos |

## Paso 1: ponlo a correr

Necesitas [Node.js](https://nodejs.org) 20 o más nuevo y [Git](https://git-scm.com).

```bash
git clone https://github.com/thrilzNetwork/academy-ordering-starter.git
cd academy-ordering-starter
git checkout step-01-setup
npm install
npm run dev
```

Abre http://localhost:3000. Si ves "¡Funciona!", terminaste el paso 1.

**Si algo falla:** lee el último mensaje rojo de la terminal. "command not found: npm" quiere decir que falta
Node.js. "Port 3000 is in use" quiere decir que ya hay algo corriendo: ciérralo o usa `npm run dev -- -p 3001`.

## Paso 2: el menú

Los productos están en `data/products.json`. Cada uno tiene un `id`, nombre, descripción, precio, categoría y si está
disponible. La portada (`app/page.js`) los agrupa por categoría y cada uno tiene su página (`app/producto/[id]/page.js`).

**Prueba:** cambia el precio de un plato en el archivo, guarda y recarga la página. Agrega un producto tuyo.

## Paso 3: el carrito

- `lib/cart.js`: funciones del carrito (agregar, cambiar cantidad, total). No tocan la pantalla, así que se pueden probar.
- `lib/cart.test.js`: las pruebas. Córrelas con `npm test`.
- `components/CartProvider.js`: guarda el carrito en el navegador para que no se pierda al recargar.
- `app/carrito/page.js`: el resumen del pedido.

**Regla importante:** el carrito guarda solo el `id` y la cantidad. El precio siempre se lee del catálogo. Si el precio
viviera en el carrito, cualquiera podría cambiarlo desde su navegador.

## Paso 4: guardar pedidos

- `components/Checkout.js`: datos del cliente, pago **simulado** y confirmación.
- `app/api/orders/route.js`: el servidor recibe el pedido, lo revisa con `lib/orders.js` y lo guarda.
- `lib/store.js`: dónde se guarda. Sin configurar nada funciona en **modo demo** (memoria, se borra al reiniciar).
  Para guardar de verdad, crea un proyecto gratis en [Supabase](https://supabase.com), corre `supabase/orders.sql`
  y pon `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en `.env.local` (copia `.env.example`).
- Al final, el cliente abre WhatsApp con el pedido ya escrito y lo envía él. La tienda nunca escribe primero.

**Prueba:** haz un pedido sin teléfono. Luego uno con delivery y sin dirección. El servidor debe rechazarlos.

## Paso 5: el panel de la tienda

Abre http://localhost:3000/admin. Te pide una contraseña que se configura en `.env.local` como `ADMIN_PASSWORD`.

- `middleware.js` revisa la sesión antes de abrir cualquier página de `/admin`.
- `app/admin/actions.js` inicia sesión, cierra sesión y cambia el estado de un pedido, revisando la sesión otra vez.
- La contraseña nunca está en el código. El navegador solo guarda una huella (hash) en una cookie que JavaScript no puede leer.

## Licencia

MIT. Úsalo, cámbialo y construye tu propio producto con él.
