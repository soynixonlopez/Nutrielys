import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

const BUCKET = "products";
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const dynamic = "force-dynamic";

async function ensureAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const admin = await ensureAdmin(supabase);
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 });
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `El archivo no debe superar ${MAX_SIZE_MB} MB` },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Solo se permiten imágenes (JPEG, PNG, WebP, GIF)" },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || "jpg";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(name, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        { error: error.message || "Error al subir. Crea el bucket 'products' en Supabase Storage y habilita acceso público de lectura." },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
    return NextResponse.json({ url: urlData.publicUrl });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Error al procesar la imagen" }, { status: 500 });
  }
}
