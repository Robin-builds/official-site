/**
 * AYUDA (`/ayuda`, `/en/help`): textos de la portada de guías y de la página de cada guía.
 * Las guías mismas viven en guias.ts.
 */
import { ui } from "./site";
import type { Cta, Localized } from "./types";

/** Textos de la portada de Ayuda y de la página de cada guía. */
export const ayuda: Localized<{
  title: string;
  subtitle: string;
  listLabel: string;
  stepsLabel: string;
  finalCta: { title: string; subtitle: string; cta: Cta; note: string };
}> = {
  es: {
    title: "Ayuda",
    subtitle: "Guías cortas, paso a paso, para empezar con StoreFlow y sacarle provecho en tu bodega.",
    listLabel: "Guías",
    stepsLabel: "Pasos",
    finalCta: {
      title: "¿Aún no tienes StoreFlow?",
      subtitle: "Descárgala en tu celular Android y sigue la guía de primeros pasos.",
      cta: ui.es.ctaPrincipal,
      note: "Gratis para empezar · Disponible en Google Play",
    },
  },
  en: {
    title: "Help",
    subtitle: "Short step-by-step guides to get started with StoreFlow and make the most of it in your warehouse.",
    listLabel: "Guides",
    stepsLabel: "Steps",
    finalCta: {
      title: "Don't have StoreFlow yet?",
      subtitle: "Download it on your Android phone and follow the getting started guide.",
      cta: ui.en.ctaPrincipal,
      note: "Free to start · Available on Google Play",
    },
  },
};
