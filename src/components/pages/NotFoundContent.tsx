import { ui } from "@/content/site";
import type { Locale } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { HTML_LANG, isPublished, pageHref } from "@/lib/i18n";

/**
 * Bloque "no encontrada" de un idioma (FR-006): título, explicación y accesos a Inicio y
 * Descargar. Lo usan los not-found de cada idioma y la 404 global bilingüe.
 * `withLang`: marca el bloque con su idioma cuando convive con otro en la misma página.
 */
export function NotFoundContent({
  locale,
  headingLevel = 1,
  withLang = false,
}: {
  locale: Locale;
  headingLevel?: 1 | 2;
  withLang?: boolean;
}) {
  const t = ui[locale].notFound;
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const download = isPublished("download", locale) ? pageHref("download", locale) : ui[locale].ctaPrincipal.href;

  return (
    <div lang={withLang ? HTML_LANG[locale] : undefined} className="mx-auto max-w-xl text-center">
      <Heading className="text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{t.title}</Heading>
      <p className="mt-4 text-lg text-fg-2">{t.body}</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href={pageHref("home", locale)} locale={locale}>
          {t.home}
        </Button>
        <Button href={download} locale={locale} variant="secondary">
          {t.download}
        </Button>
      </div>
    </div>
  );
}
