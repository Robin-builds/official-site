import Link from "next/link";
import { languages, ui } from "@/content/site";
import type { Locale } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { languageAlternates, navItems, otherLocale, pageHref } from "@/lib/i18n";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

/**
 * Encabezado fijo y translúcido (.header-glass), común a todas las páginas del idioma
 * (spec 010, contracts/header-footer.md, que reemplaza el contrato de la spec 005):
 * - ≥ 1024 px: marca · 3 páginas (Funcionalidades, Para tu negocio, Planes) · Ingresar (ghost)
 *   · ES/EN · CTA principal.
 * - < 1024 px: marca · CTA principal · menú desplegable con las 3 páginas, CTA, Ingresar y ES/EN.
 * Con solo 3 enlaces todo cabe en una línea desde 1024 px (research R2). FAQ, Ayuda, Contacto y
 * el selector de tema viven solo en el pie (FR-002, FR-003): nada más compite con la CTA, que va
 * directo a Google Play.
 */
export function Navbar({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const items = navItems(locale, (p) => p.inNav);

  // Selector ES/EN solo si el inglés está publicado (FR-031)
  const languageSwitch = languages.en.published ? (
    <LanguageSwitch
      locale={locale}
      alternates={languageAlternates(locale)}
      fallback={pageHref("home", otherLocale(locale))}
      labels={t.languageSwitch}
      groupLabel={t.languageSwitch.label}
    />
  ) : null;

  return (
    <header className="header-glass sticky top-0 z-50 border-b border-line">
      <Container className="flex h-15 items-center justify-between gap-2 sm:h-16 sm:gap-3">
        <Link href={pageHref("home", locale)} aria-label={t.a11y.home} className="shrink-0 rounded-md">
          <Logo size="header" />
        </Link>

        {/* Menú de escritorio */}
        <nav aria-label={t.a11y.mainNav} className="hidden lg:block">
          <NavLinks items={items} layout="row" />
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Envoltorio para ocultar bajo 1024 px sin pelear con el display propio de cada botón */}
          <div className="hidden items-center gap-2 lg:flex">
            <Button href={t.nav.login.href} locale={locale} variant="ghost" size="sm">
              {t.nav.login.label}
            </Button>
            {languageSwitch}
          </div>
          <Button href={t.nav.cta.href} locale={locale} size="sm" className="px-3 whitespace-nowrap sm:px-4">
            {t.nav.cta.label}
          </Button>

          <div className="lg:hidden">
            <MobileMenu openLabel={t.a11y.menuOpen} closeLabel={t.a11y.menuClose}>
              <nav aria-label={t.a11y.mainNav}>
                <NavLinks items={items} layout="column" />
              </nav>
              <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
                <Button href={t.nav.cta.href} locale={locale} size="md">
                  {t.nav.cta.label}
                </Button>
                <Button href={t.nav.login.href} locale={locale} variant="ghost" size="sm" className="self-start">
                  {t.nav.login.label}
                </Button>
                {/* Fila de idioma: solo si el inglés está publicado (el tema ya no va aquí, FR-003) */}
                {languageSwitch && <div className="flex items-center gap-3">{languageSwitch}</div>}
              </div>
            </MobileMenu>
          </div>
        </div>
      </Container>
    </header>
  );
}
