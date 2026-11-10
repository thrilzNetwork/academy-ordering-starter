# Publicar la tienda en internet

Vas a conectar tu repositorio de GitHub a un servicio de hosting. Cada vez que hagas push a la rama `main`, la tienda se
vuelve a publicar sola. Netlify y Vercel tienen planes gratuitos que alcanzan para este proyecto. **Los límites de los
planes gratuitos cambian:** revisa la página oficial de precios del proveedor el día que publiques y anota la fecha.

## Antes de publicar
1. `npm run check` pasa.
2. Revisaste `CHECKLIST.md`.
3. Tu código está en tu propio repositorio de GitHub (un fork o una copia de este proyecto).
4. Si vas a guardar pedidos de verdad, ya creaste la tabla con `supabase/orders.sql`. Sin Supabase la tienda
   funciona en modo demo, pero en internet los pedidos se pueden perder en cualquier momento.

## Opción A: Netlify
1. Entra a netlify.com con tu cuenta de GitHub.
2. "Add new site" → "Import an existing project" → elige GitHub y tu repositorio.
3. Netlify detecta que es Next.js. Deja el comando de build en `npm run build`.
4. En "Environment variables" agrega: `NEXT_PUBLIC_STORE_NAME`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `ADMIN_PASSWORD` y, si usas
   base de datos, `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.
5. "Deploy". Espera a que termine y abre la dirección que te da.

## Opción B: Vercel
1. Entra a vercel.com con tu cuenta de GitHub.
2. "Add New" → "Project" → importa tu repositorio.
3. En "Environment Variables" agrega las mismas variables del paso 4 de Netlify.
4. "Deploy".

## Verifica la tienda publicada
- [ ] El menú carga y cada producto abre su página.
- [ ] Puedes armar un pedido, simular el pago y confirmarlo.
- [ ] El botón de WhatsApp abre el chat con el pedido escrito.
- [ ] `/admin` pide contraseña y, con la correcta, muestra el pedido que hiciste.
- [ ] `/api/health` responde `"ok": true` y dice si estás en modo `demo` o `database`.

## Si algo falla
- **El build falla:** abre el registro del deploy y busca la primera línea roja. Suele ser una variable de entorno que
  falta o un error que también aparece con `npm run build` en tu computadora.
- **El panel dice que falta la contraseña:** agregaste `ADMIN_PASSWORD` después de publicar. Vuelve a publicar.
- **Los pedidos desaparecen:** estás en modo demo. Configura Supabase.

## Tu propio dominio (opcional)
Compra un dominio y, en el hosting, agrégalo en la sección de dominios. El hosting te dice qué registros DNS poner en el
lugar donde compraste el dominio. El dominio se renueva cada año: súmalo a tus costos.
