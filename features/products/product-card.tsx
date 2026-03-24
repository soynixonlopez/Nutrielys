"use client";

import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const inStock = product.stock > 0;

  return (
    <Card className="group overflow-hidden rounded-2xl border-sage-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sage-300/30">
      <Link href={`/productos/${product.slug}`} className="block">
        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-sage-100/50 to-cream-100/50">
          {product.image_url ? (
            <SafeImage
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-warm-papaya/20 to-warm-mango/20 text-sage-500">Sin imagen</div>
          )}
          {product.is_featured && (
            <span className="absolute left-2 top-2 rounded bg-warm-mango px-2 py-0.5 text-xs font-medium text-white">
              Destacado
            </span>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        {product.category && (
          <p className="text-xs font-medium uppercase tracking-wide text-sage-600">
            {product.category.name}
          </p>
        )}
        <Link href={`/productos/${product.slug}`}>
          <h3 className="mt-1 font-semibold text-sage-900 hover:text-sage-700">{product.name}</h3>
        </Link>
        {product.short_description && (
          <p className="mt-1 line-clamp-2 text-sm text-sage-700/80">{product.short_description}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="font-semibold text-sage-800">{formatPrice(product.price)}</span>
          {product.compare_price != null && product.compare_price > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-sage-600">
          {inStock ? `Disponible (${product.stock})` : "Agotado"}
        </p>
        <p className="mt-1 text-xs text-sage-600">
          Venta por unidades. Para pedidos por kilo o libra, consultar directamente.
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button size="sm" className="w-full" asChild>
          <Link href={`/productos/${product.slug}`}>Pedir producto</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
