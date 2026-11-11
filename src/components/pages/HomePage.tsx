import { inicio } from "@/content/inicio";
import type { Locale } from "@/content/types";
import { Benefits } from "@/components/sections/Benefits";
import { Credibility } from "@/components/sections/Credibility";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Problems } from "@/components/sections/Problems";
import { Shortcuts } from "@/components/sections/Shortcuts";
import { Testimonials } from "@/components/sections/Testimonials";

/**
 * Inicio corto (research R15, SC-003): hero → credibilidad → problemas → beneficios →
 * cómo funciona → accesos → testimonios (ocultos si no hay) → CTA final.
 * Casos de uso, contadores y FAQ viven ahora en sus propias páginas.
 */
export function HomePage({ locale }: { locale: Locale }) {
  const c = inicio[locale];

  return (
    <>
      <Hero hero={c.hero} locale={locale} note={c.appLanguageNote} />
      <Credibility credibility={c.credibility} />
      <Problems problems={c.problems} />
      <Benefits benefits={c.benefits} />
      <HowItWorks howItWorks={c.howItWorks} locale={locale} />
      <Shortcuts shortcuts={c.shortcuts} locale={locale} />
      <Testimonials testimonials={c.testimonials} />
      <FinalCta finalCta={c.finalCta} locale={locale} />
    </>
  );
}
