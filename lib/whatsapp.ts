import type { CartItem } from "@/types";

/**
 * Construye el número de WhatsApp en formato internacional (sin + ni espacios)
 * para usar en enlaces wa.me
 */
export function normalizeWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? digits.slice(1) : digits;
}

/**
 * Genera el mensaje de pedido formateado para enviar por WhatsApp.
 * Reutilizable para un solo producto o para el carrito completo.
 */
export function buildOrderMessage(
  items: Array<{ name: string; quantity: number; price: number; subtotal: number }>,
  customerName?: string
): string {
  const lines: string[] = [
    "¡Hola! Quiero hacer un pedido:",
    "",
    ...items.map((item) => `• ${item.name} x${item.quantity} — ${formatSubtotal(item.subtotal)}`),
    "",
    `*Total: ${formatSubtotal(items.reduce((sum, i) => sum + i.subtotal, 0))}*`,
  ];

  if (customerName?.trim()) {
    lines.push("");
    lines.push(`Mi nombre es: ${customerName.trim()}`);
  }

  return lines.join("\n");
}

function formatSubtotal(amount: number): string {
  return new Intl.NumberFormat("es-PA", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Dado el número de WhatsApp del negocio y un mensaje, devuelve la URL de WhatsApp
 */
export function getWhatsAppUrl(phone: string, message: string): string {
  const normalized = normalizeWhatsAppNumber(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${encoded}`;
}

/**
 * Abre WhatsApp con el pedido (items del carrito o un solo producto)
 */
export function openWhatsAppOrder(
  whatsappNumber: string,
  items: CartItem[],
  customerName?: string
): void {
  const orderItems = items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.price * item.quantity,
  }));
  const message = buildOrderMessage(orderItems, customerName);
  const url = getWhatsAppUrl(whatsappNumber, message);
  window.open(url, "_blank", "noopener,noreferrer");
}
