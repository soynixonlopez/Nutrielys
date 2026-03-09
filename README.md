# Nutrielys – Ecommerce de Snacks Naturales

Ecommerce moderno para una marca que vende **frutas y vegetales deshidratados** en Panamá. Desarrollado con Next.js 14, TypeScript, Tailwind CSS y Supabase.

## Características

- **Sitio público**: Home, catálogo con filtros y búsqueda, detalle de producto, carrito, pedido por WhatsApp, contacto y página sobre la marca.
- **Panel admin**: Login seguro, dashboard con métricas, CRUD de productos (con subida de imagen), categorías, listado de pedidos con cambio de estado, y ajustes (WhatsApp, textos, hero).
- **Tecnologías**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, React Hook Form + Zod, Supabase (DB, Auth, Storage opcional).

## Requisitos previos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)

## Configuración

### 1. Clonar e instalar dependencias

```bash
cd nutrielys
npm install
```

### 2. Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

Obtén estos valores en el dashboard de Supabase: **Project Settings → API**.

### 3. Base de datos en Supabase

1. Entra a tu proyecto en Supabase → **SQL Editor** → New query.
2. Copia y pega **todo** el contenido de `supabase/setup-completo.sql`.
3. Pulsa **Run**. Con eso quedan creadas tablas, políticas, triggers y datos de ejemplo (categorías + 11 productos). No hace falta ejecutar ningún otro SQL.

### 4. Usuario administrador

1. En Supabase ve a **Authentication → Users** y crea un usuario (o regístrate desde la app).
2. En **SQL Editor** ejecuta (reemplaza `TU_USER_ID` por el UUID del usuario creado):

```sql
UPDATE public.profiles SET role = 'admin' WHERE id = 'TU_USER_ID';
```

Para ver el `id` del usuario: **Authentication → Users** y copia el UUID.

### 5. Imágenes de productos (Supabase Storage)

Para poder **subir imágenes** desde el formulario de producto en el admin:

En **Storage** del dashboard: crea un bucket público llamado `products` y configura políticas que permitan a usuarios autenticados subir y al público leer.

En el formulario de producto (crear/editar) puedes usar **Subir imagen** (sube a Storage) o pegar una **URL** manual.

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para el sitio público y [http://localhost:3000/admin](http://localhost:3000/admin) para el panel (redirige a login si no estás autenticado).

## Scripts

- `npm run dev` – Servidor de desarrollo
- `npm run build` – Build de producción
- `npm run start` – Servidor de producción
- `npm run lint` – Linter

## Estructura del proyecto

```
app/
  (public)/          # Páginas públicas (home, productos, contacto, etc.)
  admin/             # Login y panel admin (dashboard bajo (dashboard))
  api/               # API routes (productos, pedidos, settings, admin)
components/          # UI compartida (layout, ui)
features/            # Lógica por dominio (products, orders, admin, contact)
lib/                 # Utilidades, validaciones (Zod), formatters
hooks/               # useCart, etc.
types/               # Tipos TypeScript
supabase/            # Cliente, servidor, queries, setup-completo.sql
  migrations/        # Cambios futuros en la BD (002_xxx.sql, 003_xxx.sql…)
docs/                # Documentación (escalabilidad, etc.)
```

## Flujo de pedidos

1. El cliente agrega productos al carrito (localStorage).
2. En **Carrito** puede editar cantidades y al hacer clic en **Enviar pedido por WhatsApp**:
   - Se registra el pedido en la base de datos (opcional, para que el admin lo vea).
   - Se abre WhatsApp con un mensaje formateado (productos, cantidades, total).
3. El admin ve los pedidos en **Admin → Pedidos**.

## Diseño

- Colores naturales (verdes sage, crema, acentos mango/piña).
- Tipografía: Inter y DM Serif Display.
- Componentes tipo shadcn/ui, responsive y accesibles.

## Deploy en Vercel (desde GitHub)

1. **Sube el proyecto a GitHub**
   - Crea un repositorio y haz push del código (no subas `.env` ni `.env.local`).

2. **Conecta el repo en Vercel**
   - Entra en [vercel.com](https://vercel.com) → **Add New Project** → **Import** tu repo de GitHub.
   - Framework: Vercel detecta Next.js automáticamente.

3. **Variables de entorno**
   - En el proyecto de Vercel: **Settings → Environment Variables**.
   - Añade:
     - `NEXT_PUBLIC_SUPABASE_URL` = tu URL de Supabase.
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu Anon Key de Supabase.
   - Aplícalas a **Production**, **Preview** y **Development** si usas previews.

4. **Deploy**
   - Cada push a la rama principal (p. ej. `main`) dispara un deploy automático.
   - El build usa `next build`; asegúrate de que en local `npm run build` termine sin errores.

**Nota:** La base de datos debe estar configurada (ejecuta `supabase/setup-completo.sql` en Supabase una vez). Las variables de entorno en Vercel deben apuntar al mismo proyecto de Supabase.

## Escalabilidad y nuevas funcionalidades

Cuando añadas nuevas funcionalidades (cupones, wishlist, etc.):

- **Código**: nueva carpeta en `features/<dominio>`, tipos en `types/`, rutas en `app/api/` y `app/(public)` o `app/admin` según corresponda.
- **Base de datos**: no edites `setup-completo.sql` en proyectos ya desplegados. Crea archivos en `supabase/migrations/` (ej. `002_cupones.sql`) con solo los cambios, y ejecútalos en orden en el SQL Editor.

Guía detallada: **[docs/ESCALABILIDAD.md](docs/ESCALABILIDAD.md)**.

## Licencia

Uso interno / proyecto cliente.
