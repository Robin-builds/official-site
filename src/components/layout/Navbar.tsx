import Link from "next/link";
import { languages, ui } from "@/content/site";
import type { Locale } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { languageAlternates, navItems, otherLocale, pageHref } from "@/lib/i18n";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

/**
 * Encabezado fijo y translúcido (.header-glass), común a todas las páginas del idioma
 * (contracts/routes.md, "Encabezado"):
 * - ≥ 1280 px: marca · páginas · Ingresar (ghost) · ES/EN · tema · CTA principal.
 * - < 1280 px: marca · CTA principal · menú desplegable con páginas, CTA, Ingresar, ES/EN y tema.
 * El corte es 1280 y no 1024 (contrato): en español las etiquetas no caben en una línea a
 * 1024 px junto a Ingresar, ES/EN, tema y CTA. Bajo 1280 el menú desplegable trae todo.
 * La CTA principal va directo a Google Play (SC-001); los enlaces del menú no compiten con ella.
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
        <nav aria-label={t.a11y.mainNav} className="hidden xl:block">
          <NavLinks items={items} layout="row" />
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Envoltorio para ocultar bajo 1280 px sin pelear con el display propio de cada botón */}
          <div className="hidden items-center gap-2 xl:flex">
            <Button href={t.nav.login.href} locale={locale} variant="ghost" size="sm">
              {t.nav.login.label}
            </Button>
            {languageSwitch}
            <ThemeToggle label={t.a11y.themeToggle} />
          </div>
          <Button href={t.nav.cta.href} locale={locale} size="sm" className="px-3 whitespace-nowrap sm:px-4">
            {t.nav.cta.label}
          </Button>

          <div className="xl:hidden">
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
                <div className="flex items-center justify-between gap-3">
                  {languageSwitch}
                  <ThemeToggle label={t.a11y.themeToggle} className="ml-auto" />
                </div>
              </div>
            </MobileMenu>
          </div>
        </div>
      </Container>
    </header>
  );
}
