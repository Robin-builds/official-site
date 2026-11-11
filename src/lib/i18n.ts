/**
 * Ayudas de idioma y direcciones. Todo sale del registro `pages` y de `guias`, así una página
 * nueva o una guía lista aparece sola en menú, pie, selector, hreflang y sitemap.
 */
import { guias, readyGuides } from "@/content/guias";
import { privacidad } from "@/content/privacidad";
import { languages, pages } from "@/content/site";
import type { GuideKey, Locale, Page, PageKey } from "@/content/types";

export const LOCALES: Locale[] = ["es", "en"];

/** Valor del atributo `lang` / hreflang de cada idioma. */
export const HTML_LANG: Record<Locale, "es-CL" | "en"> = { es: "es-CL", en: "en" };

export function otherLocale(l: Locale): Locale {
  return l === "es" ? "en" : "es";
}

export function getPage(key: PageKey): Page {
  const page = pages.find((p) => p.key === key);
  if (!page) throw new Error(`Página desconocida: ${key}`);
  return page;
}

export function pageHref(key: PageKey, locale: Locale): string {
  return getPage(key).locales[locale].href;
}

/**
 * ¿La página existe en ese idioma? Combina el interruptor de la página, el del idioma
 * (research R18) y, para Privacidad, que haya texto en ese idioma (research R11).
 */
export function isPublished(key: PageKey, locale: Locale): boolean {
  if (!languages[locale].published) return false;
  if (key === "privacy") return privacidad[locale].text !== null;
  return getPage(key).published;
}

export function guideHref(key: GuideKey, locale: Locale): string {
  const guide = guias.find((g) => g.key === key);
  if (!guide) throw new Error(`Guía desconocida: ${key}`);
  return `${pageHref("help", locale)}/${guide.locales[locale].slug}`;
}

/** Guía lista con esa clave, o null: los enlaces "Ver la guía" solo se muestran si existe. */
export function readyGuide(key: GuideKey | null | undefined) {
  if (!key) return null;
  return readyGuides().find((g) => g.key === key) ?? null;
}

/** "/en" o "/en/…" → inglés; el resto es español. */
export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
}

/**
 * Búsqueda inversa: qué página o guía corresponde a una dirección (en cualquier idioma).
 * La usa el selector de idioma para llevar a la misma página en el otro idioma (research R17).
 */
export function pageKeyFromPath(
  pathname: string,
): { type: "page"; key: PageKey } | { type: "guide"; key: GuideKey } | null {
  // Sin barra final, salvo la raíz
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  for (const page of pages) {
    if (LOCALES.some((l) => page.locales[l].href === path)) return { type: "page", key: page.key };
  }
  for (const guide of guias) {
    if (LOCALES.some((l) => guideHref(guide.key, l) === path)) return { type: "guide", key: guide.key };
  }
  return null;
}

/**
 * Tabla para el selector de idioma: cada dirección publicada en `locale` → su equivalente en
 * el otro idioma. Si la página no existe en el otro idioma, lleva al Inicio de ese idioma.
 */
export function languageAlternates(locale: Locale): Record<string, string> {
  const other = otherLocale(locale);
  const table: Record<string, string> = {};
  for (const page of pages) {
    if (!isPublished(page.key, locale)) continue;
    table[page.locales[locale].href] = isPublished(page.key, other) ? page.locales[other].href : pageHref("home", other);
  }
  for (const guide of readyGuides()) {
    table[guideHref(guide.key, locale)] = guideHref(guide.key, other);
  }
  return table;
}

/** Páginas del menú principal o del pie, ya filtradas por publicación, con su texto. */
export function navItems(locale: Locale, filter: (p: Page) => boolean) {
  return pages
    .filter((p) => filter(p) && isPublished(p.key, locale))
    .map((p) => ({ href: p.locales[locale].href, label: p.locales[locale].navLabel }));
}
