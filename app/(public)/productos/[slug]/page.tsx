import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/server";
import { getProductBySlug, getRelatedProducts } from "@/supabase/queries/products";
import { getSiteSettings } from "@/supabase/queries/site-settings";
import { formatPrice } from "@/lib/utils";
import { ProductDetailClient } from "@/features/products/product-detail-client";
import { SafeImage } from "@/components/ui/safe-image";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const product = await getProductBySlug(supabase, slug);
  if (!product) return { title: "Producto" };
  return {
    title: product.name,
    description: product.short_description ?? product.description ?? undefined,
    openGraph: product.image_url ? { images: [product.image_url] } : undefined,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const [product, settings, related] = await Promise.all([
    getProductBySlug(supabase, slug),
    getSiteSettings(supabase),
    (async () => {
      const p = await getProductBySlug(supabase, slug);
      if (!p) return [];
      return getRelatedProducts(supabase, p.id, p.category_id, 4);
    })(),
  ]);

  if (!product) notFound();

  const whatsappNumber = settings?.whatsapp_number ?? "50760000000";
  const images = [product.image_url, ...(product.product_images ?? []).map((i) => i.image_url)].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-6xl px-3 py-8 sm:px-4 md:py-12">
      <Link
        href="/productos"
        className="mb-6 inline-flex items-center gap-2 text-sm text-sage-700 hover:text-sage-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Galería */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-xl border border-sage-200/60 bg-sage-100/50">
            {images[0] ? (
              <SafeImage
                src={images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sage-400">Sin imagen</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.slice(1, 5).map((url, i) => (
                <div
                  key={i}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-sage-200/60"
                >
                  <SafeImage src={url} alt="" fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <p className="text-sm font-medium uppercase tracking-wide text-sage-600">
              {product.category.name}
            </p>
          )}
          <h1 className="mt-1 font-serif text-3xl font-medium text-sage-900 md:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-sage-800">
              {formatPrice(product.price)}
            </span>
            {product.compare_price != null && product.compare_price > product.price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>
          <p className="mt-2 text-sage-600">
            {product.stock > 0 ? `Disponible (${product.stock} unidades)` : "Agotado"}
          </p>
          {product.short_description && (
            <p className="mt-4 text-sage-700">{product.short_description}</p>
          )}
          {product.description && (
            <div className="mt-4 prose prose-sage max-w-none">
              <p className="text-sage-700 whitespace-pre-line">{product.description}</p>
            </div>
          )}
          {product.benefits && product.benefits.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-sage-900">Beneficios</h3>
              <ul className="mt-2 list-inside list-disc text-sage-700">
                {product.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          )}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-sage-900">Ingredientes</h3>
              <p className="mt-1 text-sage-700">{product.ingredients.join(", ")}</p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            <ProductDetailClient
              product={product}
              whatsappNumber={whatsappNumber}
            />
          </div>
        </div>
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-sage-200/60 pt-12">
          <h2 className="font-serif text-2xl font-medium text-sage-900">Productos relacionados</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/productos/${p.slug}`}
                className="group overflow-hidden rounded-xl border border-sage-200/60 bg-white transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="aspect-square relative bg-sage-100/50">
                  {p.image_url ? (
                    <SafeImage
                      src={p.image_url}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sage-400">Sin imagen</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sage-900 group-hover:text-sage-700">{p.name}</h3>
                  <p className="mt-1 font-semibold text-sage-600">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
