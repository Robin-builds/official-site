/**
 * Lógica del formulario de intención de Planes (spec 009), sin React: validación, origen y
 * armado del correo. La usan el navegador (validar antes de enviar) y la ruta
 * /api/plan-intent (validar de nuevo: lo que llega del navegador no es confiable).
 */
import { planes, plans } from "@/content/planes";
import type { Period, PlanId } from "@/content/planes";
import type { Locale } from "@/content/types";
import { isEmail } from "@/lib/contact";
import { formatCLP, priceFor } from "@/lib/pricing";

export type PaidPlanId = Exclude<PlanId, "free">;
export type IntentData = { plan: PaidPlanId; period: Period; email: string; whatsapp: string };
export type IntentField = "email" | "whatsapp";
export type IntentErrors = Partial<{ plan: "invalid"; email: "required" | "email"; whatsapp: "whatsapp" }>;

export const ORIGIN_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "referrer"] as const;
export type Origin = Partial<Record<(typeof ORIGIN_KEYS)[number], string>>;

/** Largos máximos: los mismos maxLength del formulario, revisados también en el servidor. */
export const MAX_LENGTH = { email: 254, whatsapp: 30, utm: 100, referrer: 500 } as const;

// WhatsApp: solo dígitos, espacios y + - ( ) . (se envía tal como se escribió)
const PHONE_CHARS = /^[0-9+\-(). ]+$/;

/**
 * Celular chileno (research R8): quitando todo lo que no es dígito queda 9XXXXXXXX (9 dígitos)
 * o 569XXXXXXXX (11 dígitos). La regla genérica de Contacto aceptaría fijos y extranjeros.
 */
export function isChileanMobile(raw: string): boolean {
  const value = raw.trim();
  if (!PHONE_CHARS.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  return /^9\d{8}$/.test(digits) || /^569\d{8}$/.test(digits);
}

const isPaidPlan = (v: unknown): v is PaidPlanId => v === "standard" || v === "premium";
const isPeriod = (v: unknown): v is Period => v === "monthly" || v === "annual";

/** Error de un campo del formulario (o undefined si está bien). Sirve para revalidar al escribir. */
export function validateIntentField(field: IntentField, raw: string): IntentErrors[IntentField] {
  const value = raw.trim();
  if (field === "email") {
    if (!value) return "required";
    return value.length <= MAX_LENGTH.email && isEmail(value) ? undefined : "email";
  }
  // WhatsApp es opcional: vacío es válido
  if (!value) return undefined;
  return value.length <= MAX_LENGTH.whatsapp && isChileanMobile(value) ? undefined : "whatsapp";
}

/** Errores de toda la intención; objeto vacío = válida. */
export function validateIntent(data: { plan: unknown; period: unknown; email: string; whatsapp: string }): IntentErrors {
  const errors: IntentErrors = {};
  // Free no pasa por el formulario (FR-012): un "free" aquí es un envío fuera del sitio
  if (!isPaidPlan(data.plan) || !isPeriod(data.period)) errors.plan = "invalid";
  const email = validateIntentField("email", data.email);
  if (email) errors.email = email as "required" | "email";
  const whatsapp = validateIntentField("whatsapp", data.whatsapp);
  if (whatsapp) errors.whatsapp = "whatsapp";
  return errors;
}

/** Toma solo las claves de origen conocidas, como texto, recortadas; descarta las vacías. */
export function sanitizeOrigin(raw: unknown): Origin {
  const src = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const origin: Origin = {};
  for (const key of ORIGIN_KEYS) {
    const v = src[key];
    if (typeof v !== "string" || !v.trim()) continue;
    origin[key] = v.trim().slice(0, key === "referrer" ? MAX_LENGTH.referrer : MAX_LENGTH.utm);
  }
  return origin;
}

/** Origen visto desde el navegador: UTM de la dirección actual + página de procedencia (R7). */
export function readOrigin(): Origin {
  const params = new URLSearchParams(window.location.search);
  const raw: Record<string, string> = { referrer: document.referrer };
  for (const key of ORIGIN_KEYS) if (key !== "referrer") raw[key] = params.get(key) ?? "";
  return sanitizeOrigin(raw);
}

/** Precio con unidad e impuesto, en el idioma pedido: "$99.900/año + IVA". */
export function priceLabel(plan: PaidPlanId, period: Period, locale: Locale): string {
  const c = planes[locale].price;
  const monthly = plans.find((p) => p.id === plan)?.monthlyPrice ?? 0;
  return `${formatCLP(priceFor(monthly, period))}${period === "annual" ? c.perYear : c.perMonth} ${c.tax}`;
}

/**
 * Correo al owner (siempre en español): asunto "Planes · Standard · Anual" y una línea
 * "Rótulo: valor" por dato, omitiendo los opcionales vacíos. Texto plano: nada de lo que escribe
 * el visitante se interpreta como HTML. El precio se recalcula aquí (research R3).
 */
export function buildIntentEmail({
  data,
  origin,
  locale,
  receivedAt,
}: {
  data: IntentData;
  origin: Origin;
  locale: Locale;
  receivedAt: Date;
}): { subject: string; text: string } {
  const c = planes.es;
  const l = c.email.labels;
  const planName = plans.find((p) => p.id === data.plan)?.name ?? data.plan;
  const periodName = c.periods[data.period];
  const originText = ORIGIN_KEYS.filter((k) => origin[k])
    .map((k) => `${k}=${origin[k]}`)
    .join(" · ");

  const lines: [string, string][] = [
    [l.plan, planName],
    [l.period, periodName],
    [l.price, priceLabel(data.plan, data.period, "es")],
    [l.email, data.email.trim()],
    [l.whatsapp, data.whatsapp.trim()],
    [l.date, receivedAt.toLocaleString("es-CL", { timeZone: "America/Santiago" })],
    [l.locale, c.email.localeNames[locale]],
    [l.origin, originText],
  ];

  return {
    subject: `${c.email.subjectPrefix} · ${planName} · ${periodName}`,
    text: lines
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
      .join("\n"),
  };
}
