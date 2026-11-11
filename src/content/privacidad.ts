/**
 * POLÍTICA DE PRIVACIDAD (FR-019, research R11).
 *
 * Nunca se publica texto legal inventado: `text` queda en `null` hasta que el owner entregue el
 * texto de cada idioma. Con `null`, `/privacidad` (o `/en/privacy`) responde "no encontrada", no
 * entra al sitemap y el pie enlaza al destino vigente (`URLS.privacyPolicy`).
 * Párrafos separados por una línea en blanco.
 */
import type { Localized } from "./types";

export const privacidad: Localized<{ text: string | null }> = {
  es: { text: null },
  en: { text: null },
};
