import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { contactFormSchema } from "@/lib/validations/contact";
import { checkRateLimit, isBotHoneypotTriggered, isSuspiciousFormTiming } from "@/lib/security/request-guards";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const rl = checkRateLimit({
      request,
      key: "api-contact",
      max: 6,
      windowMs: 10 * 60 * 1000,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Demasiados intentos. Intenta nuevamente en ${rl.retryAfterSec}s.` },
        { status: 429 }
      );
    }

    if (isBotHoneypotTriggered(body)) {
      return NextResponse.json({ ok: true });
    }
    if (isSuspiciousFormTiming(body)) {
      return NextResponse.json({ error: "Formulario invalido. Intenta nuevamente." }, { status: 400 });
    }

    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    await sendContactEmail(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/contact", error);
    return NextResponse.json(
      { error: "No se pudo enviar el mensaje. Intenta nuevamente en unos minutos." },
      { status: 500 }
    );
  }
}
