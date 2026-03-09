# Migraciones (cambios futuros en la base de datos)

**Instalación inicial**: usa solo `../setup-completo.sql` en el SQL Editor de Supabase (una vez por proyecto).

**Nuevas funcionalidades**: cuando añadas algo que requiera cambios en la BD (tablas, columnas, índices, RLS), crea aquí un nuevo archivo y ejecútalo en Supabase en orden.

## Convención de nombres

- `002_descripcion_corta.sql`  
- `003_otro_cambio.sql`  
- etc.

Ejemplos: `002_cupones.sql`, `003_add_product_weight.sql`. Puedes usar `_plantilla.sql` como referencia al escribir una migración nueva.

## Contenido de cada archivo

- Solo los **cambios** (CREATE TABLE, ALTER TABLE, CREATE POLICY, etc.).
- Usa `IF NOT EXISTS` / `DROP ... IF EXISTS` cuando tenga sentido para poder re-ejecutar sin errores.
- Incluye RLS (políticas) si creas tablas nuevas.

## Orden de ejecución

Ejecuta en el SQL Editor en orden numérico: primero 002, luego 003, etc. No hace falta volver a ejecutar `setup-completo.sql` en proyectos ya configurados.
