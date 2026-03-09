"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SafeImage } from "@/components/ui/safe-image";
import { ShoppingBag, MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { openWhatsAppOrder } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";

const DEFAULT_WHATSAPP = "50760000000";

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, totalAmount, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.whatsapp_number) setWhatsappNumber(data.whatsapp_number);
      })
      .catch(() => {});
  }, []);

  const handleWhatsApp = async () => {
    // Registrar pedido en backend para que el admin lo vea
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName.trim() || "Cliente",
          customer_phone: "Pedido por WhatsApp",
          customer_notes: "Pedido enviado por WhatsApp desde la web",
          items: items.map((i) => ({
            product_id: i.productId,
            product_name_snapshot: i.name,
            price_snapshot: i.price,
            quantity: i.quantity,
          })),
        }),
      });
    } catch {
      // No bloquear si falla el registro
    }
    openWhatsAppOrder(whatsappNumber, items, customerName.trim() || undefined);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-3 py-16 sm:px-4">
        <div className="mx-auto max-w-md rounded-2xl border border-sage-200/60 bg-gradient-to-b from-cream-50/80 to-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 text-sage-500">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="mt-6 font-serif text-xl font-medium text-sage-900">Tu carrito está vacío</h2>
          <p className="mt-2 text-sm text-sage-700">
            Agrega productos desde el catálogo y vuelve para enviar tu pedido por WhatsApp.
          </p>
          <Button asChild className="mt-8">
            <Link href="/productos">Ver productos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-3 py-8 sm:px-4 md:py-12">
      <Link
        href="/productos"
        className="mb-6 inline-flex items-center gap-2 text-sm text-sage-700 hover:text-sage-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Seguir comprando
      </Link>

      <h1 className="font-serif text-3xl font-medium text-sage-900">Tu carrito</h1>
      <p className="mt-1 text-sage-700">
        Revisa tu pedido y envíalo por WhatsApp cuando estés listo.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 rounded-xl border border-sage-200/60 bg-white p-4"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-sage-100/50">
                {item.imageUrl ? (
                  <SafeImage src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="96px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sage-400 text-xs">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/productos/${item.slug}`} className="font-medium text-sage-900 hover:underline">
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-sage-600">{formatPrice(item.price)} c/u</p>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.productId, Math.max(1, Number(e.target.value) || 1))
                    }
                    className="h-8 w-20"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeItem(item.productId)}
                  >
                    Quitar
                  </Button>
                </div>
              </div>
              <div className="text-right font-semibold text-sage-800">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-sage-200/60 bg-gradient-to-b from-cream-50/80 to-white p-6 shadow-sm">
            <h2 className="font-semibold text-sage-900">Resumen del pedido</h2>
            <p className="mt-4 text-2xl font-semibold text-sage-800">
              Total: {formatPrice(totalAmount)}
            </p>
            <div className="mt-4">
              <label htmlFor="customer-name" className="text-sm font-medium text-sage-700">
                Tu nombre (opcional)
              </label>
              <Input
                id="customer-name"
                placeholder="Para el mensaje de WhatsApp"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              variant="whatsapp"
              size="lg"
              className="mt-6 w-full"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="h-5 w-5" />
              Enviar pedido por WhatsApp
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 w-full"
              onClick={clearCart}
            >
              Vaciar carrito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
