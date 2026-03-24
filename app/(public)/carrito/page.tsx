"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SafeImage } from "@/components/ui/safe-image";
import { ShoppingBag, MessageCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { openWhatsAppOrder } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";

const DEFAULT_WHATSAPP = "50760000000";

export default function CarritoPage() {
  const [formStartedAt] = useState<number>(() => Date.now());
  const { items, updateQuantity, removeItem, totalAmount, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerProvince, setCustomerProvince] = useState("");
  const [customerCorregimiento, setCustomerCorregimiento] = useState("");
  const [customerStreet, setCustomerStreet] = useState("");
  const [isPickup, setIsPickup] = useState(false);
  const [customerNotes, setCustomerNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP);

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalDistinctProducts = new Set(items.map((item) => item.productId)).size;

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.whatsapp_number) setWhatsappNumber(data.whatsapp_number);
      })
      .catch(() => {});
  }, []);

  const handleWhatsApp = async () => {
    if (isPickup) {
      setOrderCompleted(true);
      clearCart();
      setFeedback(
        "Confirmado. Para compra en punto de venta, dirígete a Supermercados Rey u Organic. Los productos se surten cada 15 días."
      );
      setFeedbackType("success");
      return;
    }

    const firstName = customerName.trim();
    const lastName = customerLastName.trim();
    const email = customerEmail.trim().toLowerCase();
    const phone = customerPhone.trim();
    const address = customerAddress.trim();
    const province = customerProvince.trim();
    const corregimiento = customerCorregimiento.trim();
    const street = customerStreet.trim();
    const notes = customerNotes.trim();
    const isPanama = /panama/i.test(province) || /panama/i.test(corregimiento);

    if (!firstName || !lastName || !email || !phone) {
      setFeedback("Completa nombre, apellido, email y telefono para enviar el pedido.");
      setFeedbackType("error");
      return;
    }

    if (!isPickup && (!address || !province || !corregimiento || !street)) {
      setFeedback("Para entrega a domicilio completa direccion, provincia, corregimiento y calle.");
      setFeedbackType("error");
      return;
    }

    if (isPanama && totalUnits < 6 && totalDistinctProducts < 6) {
      setFeedback("Para ciudad/provincia de Panama, el pedido minimo es 6 unidades totales o 6 productos diferentes.");
      setFeedbackType("error");
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    setFeedbackType(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: firstName,
          customer_last_name: lastName,
          customer_email: email,
          customer_phone: phone,
          customer_address: address,
          customer_province: province,
          customer_corregimiento: corregimiento,
          customer_street: street,
          is_pickup: isPickup,
          pickup_point: undefined,
          website: "",
          form_started_at: formStartedAt,
          customer_notes: notes || "Pedido enviado por WhatsApp desde la web",
          items: items.map((i) => ({
            product_id: i.productId,
            product_name_snapshot: i.name,
            price_snapshot: i.price,
            quantity: i.quantity,
          })),
        }),
      });
      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as
          | { error?: string | Record<string, string[]> }
          | null;

        if (typeof errorData?.error === "string") {
          throw new Error(errorData.error);
        }

        if (errorData?.error && typeof errorData.error === "object") {
          const firstFieldError = Object.values(errorData.error).find(
            (messages) => Array.isArray(messages) && messages.length > 0
          );
          if (firstFieldError && Array.isArray(firstFieldError)) {
            throw new Error(firstFieldError[0]);
          }
        }

        throw new Error("No se pudo registrar el pedido");
      }

      openWhatsAppOrder(whatsappNumber, items, {
        firstName,
        lastName,
        email,
        phone,
        isPickup,
        pickupPoint: undefined,
        address,
        province,
        corregimiento,
        street,
      });
      setOrderCompleted(true);
      clearCart();
      setFeedback("Pedido realizado con exito. Espera unos momentos, pronto te contactaremos para confirmar.");
      setFeedbackType("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos crear tu pedido ahora. Intenta nuevamente en unos minutos.";
      setFeedback(message);
      setFeedbackType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-3 py-16 sm:px-4">
        <div className="mx-auto max-w-md rounded-2xl border border-sage-200/60 bg-gradient-to-b from-cream-50/80 to-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 text-sage-500">
            <ShoppingBag className="h-8 w-8" />
          </div>
          {orderCompleted ? (
            <>
              <h2 className="mt-6 font-serif text-xl font-medium text-sage-900">Pedido realizado</h2>
              <p className="mt-2 text-sm text-sage-700">
                Espera unos momentos, pronto te contactaremos para confirmar tu pedido.
              </p>
            </>
          ) : (
            <>
              <h2 className="mt-6 font-serif text-xl font-medium text-sage-900">Tu carrito está vacío</h2>
              <p className="mt-2 text-sm text-sage-700">
                Agrega productos desde el catálogo y vuelve para enviar tu pedido por WhatsApp.
              </p>
            </>
          )}
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
        Completa tus datos, registra el pedido y envialo por WhatsApp.
      </p>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div key={`${item.productId}-${item.orderUnit}`} className="flex gap-4 rounded-xl border border-sage-200/60 bg-white p-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-sage-100/50">
              {item.imageUrl ? (
                <SafeImage src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="96px" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-sage-400">Sin imagen</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/productos/${item.slug}`} className="font-medium text-sage-900 hover:underline">
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-sage-600">{formatPrice(item.price)} c/u</p>
              <p className="mt-1 text-xs text-sage-600">
                Venta por unidades. Para kilo/libra consultar directo en el pedido.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.productId, item.orderUnit, Math.max(1, Number(e.target.value) || 1))
                  }
                  className="h-8 w-20"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeItem(item.productId, item.orderUnit)}
                >
                  Quitar
                </Button>
              </div>
            </div>
            <div className="text-right font-semibold text-sage-800">{formatPrice(item.price * item.quantity)}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-sage-200/60 bg-gradient-to-b from-cream-50/80 to-white p-6 shadow-sm">
        <h2 className="font-semibold text-sage-900">Resumen y datos del pedido</h2>
        <p className="mt-2 text-2xl font-semibold text-sage-800">Total: {formatPrice(totalAmount)}</p>
        <p className="mt-1 text-xs text-sage-600">
          Para ciudad/provincia de Panama el pedido minimo es 6 unidades totales o 6 productos diferentes.
        </p>
        <p className="mt-1 text-xs text-sage-600">
          Dependiendo de la zona o ubicacion, se cobraran gastos de envio.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <label htmlFor="customer-name" className="text-sm font-medium text-sage-700">Nombre</label>
            <Input id="customer-name" placeholder="Ej: Maria" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1" required />
          </div>
          <div>
            <label htmlFor="customer-last-name" className="text-sm font-medium text-sage-700">Apellido</label>
            <Input id="customer-last-name" placeholder="Ej: Gomez" value={customerLastName} onChange={(e) => setCustomerLastName(e.target.value)} className="mt-1" required />
          </div>
          <div>
            <label htmlFor="customer-email" className="text-sm font-medium text-sage-700">Email</label>
            <Input id="customer-email" type="email" placeholder="tu@email.com" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="mt-1" required />
          </div>
          <div>
            <label htmlFor="customer-phone" className="text-sm font-medium text-sage-700">Telefono</label>
            <Input id="customer-phone" type="tel" placeholder="Ej: 6000-0000" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="mt-1" required />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-5 rounded-lg border border-sage-200 bg-white p-3">
          <label className="flex items-center gap-2 text-sm text-sage-800">
            <input type="radio" name="delivery-type" checked={!isPickup} onChange={() => setIsPickup(false)} />
            Entrega a domicilio
          </label>
          <label className="flex items-center gap-2 text-sm text-sage-800">
            <input type="radio" name="delivery-type" checked={isPickup} onChange={() => setIsPickup(true)} />
            Retiro en punto de venta
          </label>
        </div>

        {isPickup ? (
          <div className="mt-3 rounded-lg border border-sage-200 bg-white p-3 text-sm text-sage-700">
            <p>
              Para compra en punto de venta, dirígete a <strong>Supermercados Rey</strong> u{" "}
              <strong>Organic</strong>.
            </p>
            <p className="mt-1 text-xs text-sage-600">Los productos se surten cada 15 días.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="customer-address" className="text-sm font-medium text-sage-700">Direccion</label>
              <Input id="customer-address" placeholder="Casa, edificio o referencia principal" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label htmlFor="customer-province" className="text-sm font-medium text-sage-700">Provincia</label>
              <Input id="customer-province" placeholder="Ej: Panama" value={customerProvince} onChange={(e) => setCustomerProvince(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label htmlFor="customer-corregimiento" className="text-sm font-medium text-sage-700">Corregimiento</label>
              <Input id="customer-corregimiento" placeholder="Ej: Betania" value={customerCorregimiento} onChange={(e) => setCustomerCorregimiento(e.target.value)} className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="customer-street" className="text-sm font-medium text-sage-700">Calle</label>
              <Input id="customer-street" placeholder="Ej: Calle 50, casa 10" value={customerStreet} onChange={(e) => setCustomerStreet(e.target.value)} className="mt-1" />
            </div>
          </div>
        )}

        <div className="mt-3">
          <label htmlFor="customer-notes" className="text-sm font-medium text-sage-700">Nota (opcional)</label>
          <Input id="customer-notes" placeholder="Detalles adicionales del pedido" value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} className="mt-1" />
        </div>

        <Button
          variant={isPickup ? "outline" : "whatsapp"}
          size="lg"
          className="mt-6 w-full md:w-auto"
          onClick={handleWhatsApp}
          disabled={isSubmitting}
        >
          {isPickup ? <CheckCircle2 className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
          {isSubmitting ? "Procesando..." : isPickup ? "Confirmar informacion" : "Enviar pedido por WhatsApp"}
        </Button>
        {feedback ? (
          <p className={`mt-3 text-xs ${feedbackType === "success" ? "text-emerald-700" : "text-rose-700"}`}>
            {feedback}
          </p>
        ) : null}
        <Button variant="ghost" size="sm" className="mt-3 block" onClick={clearCart}>
          Vaciar carrito
        </Button>
      </div>
    </div>
  );
}
