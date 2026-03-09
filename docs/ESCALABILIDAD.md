# Escalabilidad y nuevas funcionalidades

Guía para mantener el proyecto profesional cuando se añadan nuevas funcionalidades.

## Enfoque actual (por qué escala bien)

- **Código por dominio**: `features/products`, `features/orders`, `features/admin`, etc. Cada funcionalidad tiene su carpeta (componentes, lógica, formularios). Al añadir algo nuevo (ej. cupones, wishlist), se crea `features/cupones` o `features/wishlist` sin tocar el resto.
- **Tipos centralizados**: `types/index.ts` evita duplicar interfaces. Nuevos dominios añaden sus tipos ahí (o en `types/cupones.ts` si crece).
- **Validación con Zod**: esquemas en `lib/validations/`. Cada formulario o API usa un schema reutilizable.
- **Supabase en capa**: `supabase/client.ts`, `supabase/server.ts` y `supabase/queries/` separan la conexión y las consultas. Nuevas tablas = nuevos archivos en `queries/` (ej. `queries/cupones.ts`).
- **API por recurso**: `app/api/` con rutas por dominio (products, orders, admin/...). Una nueva funcionalidad suele ser una nueva ruta o carpeta bajo `api/`.

## Cómo añadir una nueva funcionalidad (pasos recomendados)

1. **Base de datos**  
   Si la funcionalidad necesita tablas o columnas nuevas:
   - Crea un archivo en `supabase/migrations/` con nombre descriptivo y número secuencial, ej. `002_cupones.sql` o `003_add_product_weight.sql`.
   - Escribe solo los cambios (nuevas tablas, `ALTER TABLE`, nuevas políticas RLS).
   - Ejecuta ese archivo en Supabase → SQL Editor. No modifiques `setup-completo.sql` en proyectos ya desplegados.

2. **Tipos**  
   Añade las interfaces en `types/index.ts` (o un nuevo archivo `types/cupones.ts` y expórtalo desde `index.ts`).

3. **Queries / lógica de datos**  
   Crea o amplía archivos en `supabase/queries/` (ej. `cupones.ts`) con las funciones que lean/escriban en Supabase.

4. **Validación**  
   Si hay formularios o payloads de API, crea o amplía esquemas en `lib/validations/`.

5. **API**  
   Añade o extiende rutas en `app/api/` (ej. `app/api/admin/cupones/route.ts`).

6. **UI**  
   - Páginas en `app/(public)/` o `app/admin/(dashboard)/` según corresponda.
   - Componentes y lógica del dominio en `features/<dominio>/`.

7. **Variables de entorno**  
   Si la funcionalidad usa nuevas env vars, documéntalas en `.env.example` y en el README.

## Migraciones de base de datos (estrategia profesional)

| Archivo | Cuándo usarlo |
|--------|----------------|
| `supabase/setup-completo.sql` | Solo una vez: instalación inicial de un proyecto nuevo. Contiene todo el esquema + datos de ejemplo. |
| `supabase/migrations/002_*.sql`, `003_*.sql`, ... | Cada vez que añadas una funcionalidad que requiera cambios en la BD (nuevas tablas, columnas, índices, RLS). Se ejecutan en orden en SQL Editor cuando despliegues o actualices. |

Reglas:

- No edites `setup-completo.sql` para cambios en proyectos ya en producción; usa migraciones nuevas.
- Cada migración debe ser idempotente donde sea posible (`IF NOT EXISTS`, `DROP ... IF EXISTS` antes de crear).
- Nombra los archivos de forma descriptiva: `002_cupones.sql`, `003_add_product_weight.sql`.

## Estructura de carpetas de referencia

```
app/                    # Rutas y páginas
  (public)/             # Sitio público
  admin/                # Panel admin (login + dashboard)
  api/                  # API routes por recurso
components/             # UI compartida (layout, ui)
features/               # Lógica por dominio (products, orders, admin, contact)
lib/                    # Utils, validaciones, formatters
hooks/                  # Hooks reutilizables (useCart, etc.)
types/                  # Tipos TypeScript globales
supabase/
  client.ts | server.ts # Clientes
  queries/              # Funciones de acceso a datos
  setup-completo.sql    # Instalación inicial
  migrations/           # Cambios futuros (002_, 003_, ...)
docs/                   # Documentación (esta guía)
```

## Resumen

- El proyecto está preparado para crecer por dominios y por migraciones incrementales.
- Para cada nueva funcionalidad: migración SQL (si aplica) → tipos → queries → validación → API → UI en `features/` y `app/`.
- Mantén `setup-completo.sql` solo para el primer setup; el resto de cambios de BD van en `migrations/` con numeración secuencial.
