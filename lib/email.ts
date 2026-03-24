import nodemailer from "nodemailer";
import type { ContactFormInput, NewsletterInput } from "@/lib/validations/contact";
import type { CreateOrderInput } from "@/lib/validations/order";

const DEFAULT_RECEIVER = "info@nutrielys.com";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toHtmlWithLineBreaks(value: string): string {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Falta variable de entorno requerida: ${name}`);
  }
  return value;
}

function getSmtpConfig() {
  const host = getRequiredEnv("SMTP_HOST");
  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASS");
  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  return { host, port, secure, user, pass };
}

function createTransporter() {
  const smtp = getSmtpConfig();
  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });
}

function getReceiverEmail(): string {
  return process.env.CONTACT_RECEIVER_EMAIL?.trim() || DEFAULT_RECEIVER;
}

function getFromEmail(): string {
  return process.env.SMTP_FROM_EMAIL?.trim() || getRequiredEnv("SMTP_USER");
}

export async function sendContactEmail(payload: ContactFormInput): Promise<void> {
  const transporter = createTransporter();
  const name = escapeHtml(payload.name);
  const email = escapeHtml(payload.email);
  const message = toHtmlWithLineBreaks(payload.message);

  await transporter.sendMail({
    from: getFromEmail(),
    to: getReceiverEmail(),
    replyTo: payload.email,
    subject: "Nuevo mensaje desde Contacto - Nutrielys",
    text: `Nombre: ${payload.name}\nEmail: ${payload.email}\n\nMensaje:\n${payload.message}`,
    html: `
      <h2>Nuevo mensaje desde Contacto - Nutrielys</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
    `,
  });
}

export async function sendNewsletterEmail(payload: NewsletterInput): Promise<void> {
  const transporter = createTransporter();
  const email = escapeHtml(payload.email);

  await transporter.sendMail({
    from: getFromEmail(),
    to: getReceiverEmail(),
    replyTo: payload.email,
    subject: "Nueva suscripcion Newsletter - Nutrielys",
    text: `Se registro una nueva suscripcion al newsletter.\n\nEmail: ${payload.email}`,
    html: `
      <h2>Nueva suscripcion Newsletter - Nutrielys</h2>
      <p><strong>Email:</strong> ${email}</p>
    `,
  });
}

export async function sendOrderNotificationEmail(payload: {
  orderId: string;
  order: CreateOrderInput;
  total: number;
}): Promise<void> {
  const transporter = createTransporter();
  const { orderId, order, total } = payload;
  const fullName = `${order.customer_name} ${order.customer_last_name}`.trim();
  const safeOrderId = escapeHtml(orderId);
  const safeFullName = escapeHtml(fullName);
  const safeEmail = escapeHtml(order.customer_email);
  const safePhone = escapeHtml(order.customer_phone);
  const safePickupPoint = escapeHtml(order.pickup_point ?? "No especificado");
  const safeAddress = escapeHtml(order.customer_address ?? "-");
  const safeProvince = escapeHtml(order.customer_province ?? "-");
  const safeCorregimiento = escapeHtml(order.customer_corregimiento ?? "-");
  const safeStreet = escapeHtml(order.customer_street ?? "-");
  const itemsText = order.items
    .map((item) => {
      const subtotal = item.price_snapshot * item.quantity;
      return `- ${item.product_name_snapshot} x${item.quantity} = ${subtotal.toFixed(2)}`;
    })
    .join("\n");
  const itemsHtml = order.items
    .map((item) => {
      const subtotal = item.price_snapshot * item.quantity;
      return `<li>${escapeHtml(item.product_name_snapshot)} x${item.quantity} = ${subtotal.toFixed(2)}</li>`;
    })
    .join("");

  await transporter.sendMail({
    from: getFromEmail(),
    to: getReceiverEmail(),
    replyTo: order.customer_email,
    subject: `Nuevo pedido #${orderId.slice(0, 8)} - Nutrielys`,
    text: [
      "Se registro un nuevo pedido en Nutrielys.",
      "",
      `Pedido ID: ${orderId}`,
      `Cliente: ${fullName}`,
      `Email: ${order.customer_email}`,
      `Telefono: ${order.customer_phone}`,
      `Tipo de entrega: ${order.is_pickup ? "Retiro en punto" : "Entrega a domicilio"}`,
      ...(order.is_pickup
        ? [`Punto de retiro: ${order.pickup_point ?? "No especificado"}`]
        : [
            `Direccion: ${order.customer_address ?? "-"}`,
            `Provincia: ${order.customer_province ?? "-"}`,
            `Corregimiento: ${order.customer_corregimiento ?? "-"}`,
            `Calle: ${order.customer_street ?? "-"}`,
          ]),
      `Total: ${total.toFixed(2)}`,
      "",
      "Items:",
      itemsText,
      "",
      "Revisar panel de admin para aceptar, rechazar o confirmar entrega.",
    ].join("\n"),
    html: `
      <h2>Nuevo pedido registrado en Nutrielys</h2>
      <p><strong>Pedido ID:</strong> ${safeOrderId}</p>
      <p><strong>Cliente:</strong> ${safeFullName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Telefono:</strong> ${safePhone}</p>
      <p><strong>Tipo de entrega:</strong> ${order.is_pickup ? "Retiro en punto" : "Entrega a domicilio"}</p>
      ${
        order.is_pickup
          ? `<p><strong>Punto de retiro:</strong> ${safePickupPoint}</p>`
          : `<p><strong>Direccion:</strong> ${safeAddress}</p>
             <p><strong>Provincia:</strong> ${safeProvince}</p>
             <p><strong>Corregimiento:</strong> ${safeCorregimiento}</p>
             <p><strong>Calle:</strong> ${safeStreet}</p>`
      }
      <p><strong>Total:</strong> ${total.toFixed(2)}</p>
      <p><strong>Items:</strong></p>
      <ul>${itemsHtml}</ul>
      <p>Revisar panel de admin para aceptar, rechazar o confirmar entrega.</p>
    `,
  });
}
