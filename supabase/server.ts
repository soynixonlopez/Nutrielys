import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (typeof window === "undefined" && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error(
    "Faltan las variables de entorno de Supabase. Crea un archivo .env.local en la raíz del proyecto con:\n\n" +
      "NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co\n" +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key\n\n" +
      "Obtén los valores en: https://supabase.com/dashboard/project/_/settings/api"
  );
}

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignorar en Server Components
          }
        },
      },
    }
  );
}
