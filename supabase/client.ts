import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan las variables de entorno de Supabase. Crea un archivo .env.local en la raíz del proyecto con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY. Ver .env.example o https://supabase.com/dashboard/project/_/settings/api"
  );
}

export function createClient() {
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
