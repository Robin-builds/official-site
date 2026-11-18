import Link from "next/link";
import { URLS, ui } from "@/content/site";
import type { Locale } from "@/content/types";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getPage, isPublished, navItems, pageHref } from "@/lib/i18n";

// Año calculado al construir la página (es estática). Fuera del render para mantener
// el componente puro; se actualiza en cada deploy.
const BUILD_YEAR = new Date().getFullYear();

// muted-2: el pie usa el fondo más profundo (bg-bottom) y text-3 no alcanza AA ahí en claro
const linkClass = "inline-flex min-h-8 items-center rounded-sm text-muted-2 transition-colors hover:text-fg";

/**
 * Pie común (FR-004): en "Sitio", todas las páginas publicadas del idioma (incluida "Sé partner",
 * que solo está aquí, y Privacidad cuando tiene texto) salvo Contacto. En "Contacto y cuenta":
 * la página Contacto (enlace interno, spec 006 R9), Ingresar, Privacidad externa mientras no
 * haya texto propio y, abajo, chileapps.cl.
 */
export function Footer({ locale }: { locale: Locale }) {
  const t = ui[locale];
  // Contacto va en la otra columna: no se repite aquí
  const internal = navItems(locale, (p) => p.key !== "contact");
  const contact = isPublished("contact", locale)
    ? { href: pageHref("contact", locale), label: getPage("contact").locales[locale].navLabel }
    : null;

  // Externos; todos salen de URLS (Principio II)
  const external = [
    { label: t.footer.loginLabel, href: URLS.webAppLogin },
    // Privacidad propia publicada → ya está en la lista interna (research R11)
    ...(isPublished("privacy", locale) ? [] : [{ label: t.footer.privacyLabel, href: URLS.privacyPolicy }]),
  ];

  return (
    <footer className="bg-deep">
      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <Logo size="footer" />
          <p className="mt-3 max-w-xs text-sm text-muted-2">{t.footer.tagline}</p>
          {/* Único lugar del selector de tema: salió del encabezado para no competir con la CTA
              (spec 010 FR-003). La preferencia sigue guardada en localStorage. */}
          <div className="mt-6 flex items-center gap-3 text-sm text-muted-2">
            <span aria-hidden="true">{t.footer.themeLabel}</span>
            <ThemeToggle label={t.a11y.themeToggle} />
          </div>
        </div>

        <nav aria-label={t.footer.navLabel} className="grid grid-cols-2 gap-6 sm:gap-10">
          <div>
            <h2 className="text-sm font-semibold text-fg">{t.footer.pagesTitle}</h2>
            <ul className="mt-3 flex flex-col gap-1 text-sm">
              {internal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-fg">{t.footer.moreTitle}</h2>
            <ul className="mt-3 flex flex-col gap-1 text-sm">
              {/* Contacto primero: página propia, misma pestaña */}
              {contact && (
                <li>
                  <Link href={contact.href} className={linkClass}>
                    {contact.label}
                  </Link>
                </li>
              )}
              {external.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {link.label}
                    <span className="sr-only"> {t.a11y.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-6 text-sm text-muted-2 sm:flex-row sm:justify-between">
          <a href={URLS.chileapps} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {t.footer.byline}
            <span className="sr-only"> {t.a11y.newTab}</span>
          </a>
          <p>© {BUILD_YEAR}</p>
        </Container>
      </div>
    </footer>
  );
}
