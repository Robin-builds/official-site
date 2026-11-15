/**
 * POST /api/contact: recibe el formulario de Contacto y lo envía por correo a StoreFlow con
 * Resend (spec 006, excepción "Contacto" del Principio IV, constitución 4.0.0).
 *
 * No guarda nada: valida, arma un correo de texto plano y lo entrega a Resend.
 * Variables de entorno (Vercel → Settings → Environment Variables):
 * - RESEND_API_KEY: clave de API de Resend.
 * - CONTACT_TO_EMAIL: dirección que recibe los mensajes. Va en una variable y no en el código
 *   para que no quede publicada en el repositorio.
 * Sin dominio verificado en Resend, el remitente es onboarding@resend.dev y solo puede enviar a
 * la dirección dueña de la cuenta de Resend.
 */
import { contacto } from "@/content/contacto";
import type { Locale } from "@/content/types";
import { CONTACT_FIELDS, buildContactMessage, validateContact } from "@/lib/contact";
import type { ContactData } from "@/lib/contact";

const FROM = "StoreFlow sitio <onboarding@resend.dev>";
const LOCALE_NAME: Record<Locale, string> = { es: "español", en: "inglés" };

// Cualquier cosa que no sea texto se trata como vacío: el cuerpo llega del navegador sin garantías
const text = (v: unknown) => (typeof v === "string" ? v : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  // Campo trampa: invisible para personas, los bots que llenan todo lo completan.
  // Se responde "ok" para no darles pistas, pero no se envía nada.
  if (text(body.website)) return Response.json({ ok: true });

  const locale: Locale = body.locale === "en" ? "en" : "es";
  const raw = (body.data ?? {}) as Record<string, unknown>;
  const data = Object.fromEntries(CONTACT_FIELDS.map((f) => [f, text(raw[f])])) as ContactData;

  // Misma validación que el navegador: lo que llega aquí no tiene por qué haber pasado por ella
  const errors = validateContact(data);
  if (Object.keys(errors).length > 0) return Response.json({ ok: false, errors }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[contact] Faltan RESEND_API_KEY o CONTACT_TO_EMAIL");
    return Response.json({ ok: false }, { status: 500 });
  }

  // El correo lo lee el owner: siempre en español, indicando el idioma de la página
  const m = contacto.es.message;
  const email = data.email.trim();
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject: `${m.subject}: ${data.name.trim()} (${data.company.trim()})`,
      text: `${buildContactMessage(data, m)}\n\nIdioma de la página: ${LOCALE_NAME[locale]}`,
      // "Responder" en el correo le contesta directo al visitante, si dejó su correo
      ...(email ? { reply_to: email } : {}),
    }),
  });

  if (!res.ok) {
    // Se registra el motivo para revisarlo en los logs de Vercel; el visitante ve un aviso genérico
    console.error("[contact] Resend respondió", res.status, await res.text());
    return Response.json({ ok: false }, { status: 502 });
  }
  return Response.json({ ok: true });
}
