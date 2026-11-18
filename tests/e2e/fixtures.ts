/**
 * Utilidades compartidas por la suite e2e de la spec 010 (contracts/verification.md).
 * Todo lo que es contenido (rutas, etiquetas) se importa del registro de `src/content`, no se
 * escribe a mano: si cambia un texto o se publica una página, los tests lo siguen solos.
 */
import type { Page } from "@playwright/test";
import { pages, ui } from "@/content/site";
import type { Locale } from "@/content/types";
import { isPublished } from "@/lib/i18n";
import { THEME_STORAGE_KEY, type Theme } from "@/components/ui/theme";

/** Anchos de la matriz del contrato (360 a 1440), con el borde del corte a 1023/1024. */
export const VIEWPORTS = {
  w360: { width: 360, height: 800 },
  w390: { width: 390, height: 844 },
  w1023: { width: 1023, height: 768 },
  w1024: { width: 1024, height: 768 },
  w1440: { width: 1440, height: 900 },
} as const;

export type ViewportName = keyof typeof VIEWPORTS;

/**
 * Fija el tema antes de que cargue la página: el script inline del <head> lee esta clave de
 * localStorage y pone data-theme en <html> (research R8). Hay que llamarlo antes del goto.
 */
export async function setTheme(page: Page, theme: Theme) {
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [THEME_STORAGE_KEY, theme] as const,
  );
}

/** Rutas publicadas del idioma, en el orden del registro (incluida Inicio). */
export function publishedRoutes(locale: Locale): string[] {
  return pages.filter((p) => isPublished(p.key, locale)).map((p) => p.locales[locale].href);
}

/** Navega y espera las fuentes: sin ellas, anchos y altos de texto cambian después de medir. */
export async function gotoReady(page: Page, path: string) {
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

/** Etiqueta del CTA principal del encabezado ("Pruébala gratis"), tomada del contenido. */
export const CTA_LABEL = ui.es.nav.cta.label;
