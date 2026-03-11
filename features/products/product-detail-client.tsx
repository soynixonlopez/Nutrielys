"use client";

import { useState } from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { buildOrderMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import type { Product } from "@/types";

interface ProductDetailClientProps {
  product: Product;
  whatsappNumber: string;
}

export function ProductDetailClient({ product, whatsappNumber }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const inStock = product.stock > 0;
  const normalizedPhone = whatsappNumber.replace(/\D/g, "").replace(/^0/, "");

  const handleWhatsAppDirect = () => {
    const message = buildOrderMessage(
      [{ name: product.name, quantity, price: product.price, subtotal: product.price * quantity }]
    );
    const url = getWhatsAppUrl(normalizedPhone, message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image_url,
      slug: product.slug,
      quantity,
    });
  };

  return (
    <>
      {inStock && (
        <>
          <div className="flex items-center justify-between gap-2 rounded-xl border border-sage-200/70 bg-cream-50/60 px-3 py-2 sm:w-auto sm:justify-start sm:border-0 sm:bg-transparent sm:p-0">
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
          <Button variant="outline" onClick={handleAddToCart} className="w-full sm:w-auto">
            <ShoppingBag className="h-4 w-4" />
            Agregar al carrito
          </Button>
          <Button variant="whatsapp" onClick={handleWhatsAppDirect} className="w-full sm:w-auto">
            <MessageCircle className="h-4 w-4" />
            Pedir por WhatsApp
          </Button>
        </>
      )}
      {!inStock && (
        <p className="text-sage-600">Por el momento no hay stock. Contáctanos por WhatsApp para consultar.</p>
      )}
    </>
  );
}
