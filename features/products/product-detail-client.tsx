"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/types";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addItem } = useCart();

  const inStock = product.stock > 0;

  const handleWhatsAppDirect = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image_url,
      slug: product.slug,
      quantity,
      orderUnit: "cantidad",
    });
    router.push("/carrito");
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image_url,
      slug: product.slug,
      quantity,
      orderUnit: "cantidad",
    });
  };

  return (
    <>
      {inStock && (
        <div className="w-full space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
            <div className="flex items-center justify-between gap-2 rounded-xl border border-sage-200/70 bg-cream-50/60 px-3 py-2 md:w-auto md:justify-start md:border-0 md:bg-transparent md:p-0">
              <label htmlFor="qty" className="text-sm font-medium text-sage-700">
                Cantidad
              </label>
              <Input
                id="qty"
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))}
                className="w-24"
              />
            </div>
            <Button variant="outline" onClick={handleAddToCart} className="w-full md:w-auto">
              <ShoppingBag className="h-4 w-4" />
              Agregar al carrito
            </Button>
            <Button variant="whatsapp" onClick={handleWhatsAppDirect} className="w-full md:w-auto">
              <MessageCircle className="h-4 w-4" />
              Pedir por WhatsApp
            </Button>
          </div>
          <p className="text-sm text-sage-600">
            Venta regular por unidades. Si deseas comprar por kilo o libra, consulta directo en tu pedido.
          </p>
        </div>
      )}
      {!inStock && (
        <p className="text-sage-600">Por el momento no hay stock. Contáctanos por WhatsApp para consultar.</p>
      )}
    </>
  );
}
