import type { MetadataRoute } from "next";
import { readyGuides } from "@/content/guias";
import { URLS, pages } from "@/content/site";
import type { Locale } from "@/content/types";
import { guideHref, HTML_LANG, isPublished, LOCALES, pageHref } from "@/lib/i18n";

/** "/" → "https://…" sin barra final; el resto, dirección absoluta. */
const absolute = (href: string) => (href === "/" ? URLS.site : `${URLS.site}${href}`);

/**
 * Mapa del sitio (FR-023, FR-027, research R13): una entrada por página publicada y guía lista
 * en cada idioma publicado, con sus equivalentes (hreflang). Misma fuente que menú y pie.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  function add(hrefs: Record<Locale, string>, exists: Record<Locale, boolean>, priority: number) {
    const languages: Record<string, string> = {};
    for (const l of LOCALES) if (exists[l]) languages[HTML_LANG[l]] = absolute(hrefs[l]);
    for (const l of LOCALES) {
      if (!exists[l]) continue;
      entries.push({
        url: absolute(hrefs[l]),
        changeFrequency: "monthly",
        priority,
        ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
      });
    }
  }

  for (const page of pages) {
    add(
      { es: pageHref(page.key, "es"), en: pageHref(page.key, "en") },
      { es: isPublished(page.key, "es"), en: isPublished(page.key, "en") },
      page.key === "home" ? 1 : 0.8,
    );
  }
  for (const guide of readyGuides()) {
    add(
      { es: guideHref(guide.key, "es"), en: guideHref(guide.key, "en") },
      { es: isPublished("help", "es"), en: isPublished("help", "en") },
      0.6,
    );
  }
  return entries;
}
