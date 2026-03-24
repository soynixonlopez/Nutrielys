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
  items: Array<{ name: string; quantity: number; price: number; subtotal: number; orderUnit: CartItem["orderUnit"] }>,
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    isPickup?: boolean;
    pickupPoint?: string;
    address?: string;
    province?: string;
    corregimiento?: string;
    street?: string;
  }
): string {
  const lines: string[] = [
    "¡Hola! Quiero hacer un pedido:",
    "",
    ...items.map((item) => `• ${item.name} x${item.quantity} — ${formatSubtotal(item.subtotal)}`),
    "",
    `*Total: ${formatSubtotal(items.reduce((sum, i) => sum + i.subtotal, 0))}*`,
    "Nota: venta regular por unidades. Si deseo por kilo/libra, consulto directamente.",
  ];

  const fullName = [customer?.firstName?.trim(), customer?.lastName?.trim()].filter(Boolean).join(" ");
  if (fullName) {
    lines.push("");
    lines.push(`Mi nombre es: ${fullName}`);
  }

  if (customer?.email?.trim()) {
    lines.push(`Mi email es: ${customer.email.trim()}`);
  }

  if (customer?.phone?.trim()) {
    lines.push(`Mi telefono es: ${customer.phone.trim()}`);
  }

  lines.push(`Tipo de entrega: ${customer?.isPickup ? "Retiro en punto" : "Entrega a domicilio"}`);
  if (customer?.isPickup) {
    if (customer.pickupPoint?.trim()) {
      lines.push(`Punto de retiro: ${customer.pickupPoint.trim()}`);
    }
  } else {
    if (customer?.address?.trim()) lines.push(`Direccion: ${customer.address.trim()}`);
    if (customer?.province?.trim()) lines.push(`Provincia: ${customer.province.trim()}`);
    if (customer?.corregimiento?.trim()) lines.push(`Corregimiento: ${customer.corregimiento.trim()}`);
    if (customer?.street?.trim()) lines.push(`Calle: ${customer.street.trim()}`);
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
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    isPickup?: boolean;
    pickupPoint?: string;
    address?: string;
    province?: string;
    corregimiento?: string;
    street?: string;
  }
): void {
  const orderItems = items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.price * item.quantity,
    orderUnit: item.orderUnit,
  }));
  const message = buildOrderMessage(orderItems, customer);
  const url = getWhatsAppUrl(whatsappNumber, message);
  window.open(url, "_blank", "noopener,noreferrer");
}
