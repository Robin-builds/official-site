import type { Metadata } from "next";
import { guias } from "@/content/guias";
import { URLS, languages } from "@/content/site";
import type { GuideKey, Locale, PageKey } from "@/content/types";
import { getPage, guideHref, HTML_LANG, isPublished, otherLocale, pageHref } from "./i18n";

const OG_LOCALE: Record<Locale, string> = { es: "es_CL", en: "en_US" };
const SITE_NAME = "StoreFlow";

/**
 * Metadata completa de una dirección (research R5).
 *
 * La metadata de Next se fusiona de forma SUPERFICIAL entre layout y página: si la página
 * define `openGraph`, reemplaza entero el del layout. Por eso aquí se arma completo
 * (type, siteName, locale…) en vez de heredarlo.
 *
 * hreflang: español (`es-CL`) y `x-default` siempre; inglés solo si el idioma está publicado
 * y esa página existe en inglés (FR-027, FR-031).
 */
function build(opts: {
  locale: Locale;
  title: string;
  description: string;
  hrefs: Record<Locale, string>;
  englishExists: boolean;
  spanishExists: boolean;
  /** Inicio comparte segmento con el layout, donde `title.template` no aplica */
  absoluteTitle?: boolean;
}): Metadata {
  const { locale, title, description, hrefs } = opts;
  const languagesAlt: Record<string, string> = {};
  if (opts.spanishExists) {
    languagesAlt[HTML_LANG.es] = hrefs.es;
    languagesAlt["x-default"] = hrefs.es;
  }
  if (opts.englishExists) languagesAlt[HTML_LANG.en] = hrefs.en;

  const fullTitle = `${title} · ${SITE_NAME}`;
  const bothLanguages = opts.englishExists && opts.spanishExists;

  return {
    title: opts.absoluteTitle ? { absolute: `${SITE_NAME} · ${title}` } : title,
    description,
    alternates: { canonical: hrefs[locale], languages: languagesAlt },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      ...(bothLanguages ? { alternateLocale: OG_LOCALE[otherLocale(locale)] } : {}),
      title: fullTitle,
      description,
      url: hrefs[locale],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

export function pageMetadata(key: PageKey, locale: Locale): Metadata {
  const info = getPage(key).locales[locale];
  return build({
    locale,
    title: info.title,
    description: info.description,
    hrefs: { es: pageHref(key, "es"), en: pageHref(key, "en") },
    spanishExists: isPublished(key, "es"),
    englishExists: isPublished(key, "en"),
    absoluteTitle: key === "home",
  });
}

export function guideMetadata(key: GuideKey, locale: Locale): Metadata {
  const guide = guias.find((g) => g.key === key);
  if (!guide) return {};
  const text = guide.locales[locale];
  return build({
    locale,
    title: text.title,
    description: text.summary,
    hrefs: { es: guideHref(key, "es"), en: guideHref(key, "en") },
    spanishExists: guide.ready,
    englishExists: guide.ready && languages.en.published,
  });
}

/**
 * Metadata base de cada layout raíz: dirección del sitio (para URLs absolutas de canonical,
 * hreflang y OG) y plantilla de título "Página · StoreFlow" (research R5).
 */
export function layoutMetadata(locale: Locale): Metadata {
  return {
    metadataBase: new URL(URLS.site),
    title: { template: `%s · ${SITE_NAME}`, default: `${SITE_NAME} · ${getPage("home").locales[locale].title}` },
    description: getPage("home").locales[locale].description,
  };
}
