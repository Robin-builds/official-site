/**
 * DESCARGAR (`/descargar`, `/en/download`; FR-012).
 *
 * Enlace a Google Play, requisitos y acceso "Ingresar" para usuarios existentes.
 * La nota de idioma de la app solo hace falta en inglés (research R19).
 */
import { URLS, ui } from "./site";
import type { Cta, Localized } from "./types";

const es = {
  title: "Descarga StoreFlow",
  body: "Es gratis para empezar y la instalas desde Google Play en un minuto.",
  cta: ui.es.ctaPrincipal as Cta,
  requirementsTitle: "Qué necesitas",
  requirements: [
    "Un celular Android. Hoy no está disponible para iPhone.",
    "Un email y una contraseña para crear tu cuenta.",
    "Internet para descargar la app. Después funciona aunque no haya señal.",
  ],
  loginLine: { text: "¿Ya usas StoreFlow?", link: "Ingresa a la versión web", href: URLS.webAppLogin },
  appLanguageNote: "",
};

export type DescargarContent = typeof es;

export const descargar: Localized<DescargarContent> = {
  es,
  en: {
    title: "Download StoreFlow",
    body: "It's free to start, and you install it from Google Play in a minute.",
    cta: ui.en.ctaPrincipal,
    requirementsTitle: "What you need",
    requirements: [
      "An Android phone. It isn't available for iPhone yet.",
      "An email and a password to create your account.",
      "Internet to download the app. After that it works even with no signal.",
    ],
    loginLine: { text: "Already using StoreFlow?", link: "Log in to the web version", href: URLS.webAppLogin },
    appLanguageNote:
      "StoreFlow shows in English when your phone is set to English. The screenshots on this site show the Spanish version.",
  },
};
