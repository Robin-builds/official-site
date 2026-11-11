import { ui } from "@/content/site";
import type { Locale } from "@/content/types";
import { HTML_LANG } from "@/lib/i18n";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { RootDocument } from "./RootDocument";

/**
 * Documento completo de un idioma: <html lang>, enlace "Saltar al contenido", encabezado,
 * contenido y pie. Lo usan los layouts raíz `(es)` y `(en)` (research R16).
 */
export function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const t = ui[locale];

  return (
    <RootDocument lang={HTML_LANG[locale]}>
      {/* Enlace de salto: primer elemento enfocable, visible solo al recibir foco */}
      <a
        href={`#${t.contentId}`}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-button focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
      >
        {t.a11y.skip}
      </a>
      <Navbar locale={locale} />
      <main id={t.contentId}>{children}</main>
      <Footer locale={locale} />
    </RootDocument>
  );
}
