/**
 * "SÉ PARTNER" (`/se-partner`, `/en/partner`; FR-010, research R23).
 *
 * Página simple para contadores y asesores de pymes, enlazada solo desde el pie.
 * Su conversión principal es WhatsApp (excepción del Principio II, constitución 3.0.1).
 * MUST NOT prometer comisiones, descuentos ni beneficios para el partner.
 * Razones heredadas de la sección Contadores, corregidas por veracidad (research R8).
 */
import { whatsapp } from "./site";
import type { Cta, Localized } from "./types";

const es = {
  eyebrow: "Para contadores y asesores de pymes",
  title: "¿Asesoras pymes? Recomiéndales un inventario que sí van a llevar",
  body: "Cuando el inventario vive en un cuaderno, cerrar el mes es adivinar. Con StoreFlow cada movimiento queda registrado y el stock sale de los movimientos, no de la memoria.",
  reasonsTitle: "Por qué recomendar StoreFlow",
  reasons: [
    "Historial de entradas y salidas que no se puede modificar, con fecha.",
    "Stock por bodega calculado a partir de los movimientos, no anotado a mano.",
    "Panel web de solo lectura para revisar el inventario desde el computador.",
    "Fácil de adoptar: funciona en el celular Android que ya tienen, aunque no haya internet.",
  ],
  cta: { label: "Quiero ser partner", href: whatsapp.es.partner } as Cta,
  ctaNote: "Te respondemos por WhatsApp.",
};

export type PartnerContent = typeof es;

export const partner: Localized<PartnerContent> = {
  es,
  en: {
    eyebrow: "For accountants and small business advisors",
    title: "Advise small businesses? Recommend an inventory they'll actually keep",
    body: "When inventory lives in a notebook, closing the month is guesswork. With StoreFlow every movement is recorded and stock comes from those movements, not from memory.",
    reasonsTitle: "Why recommend StoreFlow",
    reasons: [
      "A history of stock ins and outs that can't be changed, with dates.",
      "Stock per warehouse calculated from movements, not written down by hand.",
      "A read-only web panel to review inventory from a computer.",
      "Easy to adopt: it works on the Android phone they already have, even without internet.",
    ],
    cta: { label: "Become a partner", href: whatsapp.en.partner },
    ctaNote: "We'll reply on WhatsApp.",
  },
};
