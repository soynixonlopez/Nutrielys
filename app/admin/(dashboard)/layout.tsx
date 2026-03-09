import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/supabase/server";
import { AdminNav } from "@/components/admin/admin-nav";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-sage-50/30">
      <header className="sticky top-0 z-40 border-b border-sage-200/60 bg-white">
        <div className="flex h-14 items-center justify-between px-4 md:px-6">
          <Link href="/admin" className="font-semibold text-sage-800">
            Nutrielys Admin
          </Link>
          <AdminNav userEmail={user.email ?? ""} />
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 md:px-6 md:py-8">{children}</main>
    </div>
  );
}
