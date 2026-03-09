"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { siteSettingsSchema, type SiteSettingsFormData } from "@/lib/validations/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SiteSettings } from "@/types";

interface SettingsFormProps {
  settings: SiteSettings | null;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SiteSettingsFormData>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: settings
      ? {
          business_name: settings.business_name,
          whatsapp_number: settings.whatsapp_number,
          hero_title: settings.hero_title ?? "",
          hero_subtitle: settings.hero_subtitle ?? "",
          hero_image: settings.hero_image ?? "",
        }
      : {
          business_name: "Nutrielys",
          whatsapp_number: "50760000000",
        },
  });

  const onSubmit = async (data: SiteSettingsFormData) => {
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        hero_title: data.hero_title || null,
        hero_subtitle: data.hero_subtitle || null,
        hero_image: data.hero_image || null,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error ?? "Error al guardar");
      return;
    }
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-sage-900">Datos del negocio</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="business_name">Nombre del negocio</Label>
            <Input id="business_name" className="mt-1" {...register("business_name")} />
            {errors.business_name && (
              <p className="mt-1 text-xs text-destructive">{errors.business_name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="whatsapp_number">Número de WhatsApp (con código país, ej. 50760000000)</Label>
            <Input id="whatsapp_number" className="mt-1" placeholder="50760000000" {...register("whatsapp_number")} />
            {errors.whatsapp_number && (
              <p className="mt-1 text-xs text-destructive">{errors.whatsapp_number.message}</p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <h2 className="font-semibold text-sage-900">Hero (portada)</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero_title">Título del hero</Label>
            <Input id="hero_title" className="mt-1" placeholder="Snacks naturales que nutren" {...register("hero_title")} />
          </div>
          <div>
            <Label htmlFor="hero_subtitle">Subtítulo del hero</Label>
            <Input id="hero_subtitle" className="mt-1" placeholder="Frutas y vegetales deshidratados..." {...register("hero_subtitle")} />
          </div>
          <div>
            <Label htmlFor="hero_image">URL imagen del hero (opcional)</Label>
            <Input id="hero_image" type="url" className="mt-1" {...register("hero_image")} />
          </div>
        </CardContent>
      </Card>
      <div className="mt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando…" : "Guardar ajustes"}
        </Button>
      </div>
    </form>
  );
}
