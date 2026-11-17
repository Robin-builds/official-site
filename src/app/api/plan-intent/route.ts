/**
 * POST /api/plan-intent: recibe el formulario "Quiero el plan X" de la página Planes y lo envía
 * por correo a StoreFlow con Resend (spec 009; constitución 5.0.0, Principio IV: segunda y última
 * ruta de servidor permitida).
 *
 * No guarda, registra ni mide nada: valida, recalcula el precio y arma un correo de texto plano.
 * Contrato: specs/009-planes-pricing/contracts/routes.md.
 * Variables de entorno (Vercel → Settings → Environment Variables), las mismas de /api/contact:
 * - RESEND_API_KEY: clave de API de Resend.
 * - CONTACT_TO_EMAIL: dirección que recibe los correos.
 */
import type { Locale } from "@/content/types";
import { buildIntentEmail, sanitizeOrigin, validateIntent } from "@/lib/planes";
import type { IntentData } from "@/lib/planes";

// Mismo remitente que Contacto: sin dominio verificado en Resend, solo envía al dueño de la cuenta
const FROM = "StoreFlow sitio <onboarding@resend.dev>";

// Cualquier cosa que no sea texto se trata como vacío: el cuerpo llega del navegador sin garantías
const text = (v: unknown) => (typeof v === "string" ? v : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  if (!body || typeof body !== "object") return Response.json({ ok: false }, { status: 400 });

  // Campo trampa: los bots que llenan todo lo completan. Se responde "ok" sin enviar nada.
  if (text(body.website)) return Response.json({ ok: true });

  const locale: Locale = body.locale === "en" ? "en" : "es";
  // Solo se leen estos campos; un precio enviado por el navegador se ignora (research R3)
  const raw = { plan: body.plan, period: body.period, email: text(body.email), whatsapp: text(body.whatsapp) };

  // Misma validación que el navegador: lo que llega aquí no tiene por qué haber pasado por ella
  const errors = validateIntent(raw);
  if (Object.keys(errors).length > 0) return Response.json({ ok: false, errors }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[plan-intent] Faltan RESEND_API_KEY o CONTACT_TO_EMAIL");
    return Response.json({ ok: false }, { status: 500 });
  }

  const data = raw as IntentData; // validado arriba: plan y periodicidad son valores conocidos
  const { subject, text: mail } = buildIntentEmail({
    data,
    origin: sanitizeOrigin(body.origin),
    locale,
    receivedAt: new Date(),
  });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject,
      text: mail,
      // "Responder" en el correo le contesta directo al visitante
      reply_to: data.email.trim(),
    }),
  });

  if (!res.ok) {
    // Solo el código y la respuesta de Resend, sin datos del visitante, para revisar en Vercel
    console.error("[plan-intent] Resend respondió", res.status, await res.text());
    return Response.json({ ok: false }, { status: 502 });
  }
  return Response.json({ ok: true });
}
