import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { AdminLoginForm } from "@/features/admin/admin-login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role === "admin") {
      redirect("/admin");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sage-50/50 px-4">
      <div className="w-full max-w-md rounded-xl border border-sage-200/60 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-medium text-sage-900">Acceso Admin</h1>
        <p className="mt-1 text-sm text-sage-600">
          Área restringida. Solo personal autorizado. Inicia sesión con tu email y contraseña de administrador.
        </p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
