import { preguntas } from "@/content/preguntas";
import type { Locale } from "@/content/types";
import { FaqGroups } from "@/components/sections/FaqGroups";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHeader } from "@/components/sections/PageHeader";

/** Preguntas frecuentes agrupadas por tema (FR-011). */
export function FaqPage({ locale }: { locale: Locale }) {
  const c = preguntas[locale];
  return (
    <>
      <PageHeader title={c.intro.title} subtitle={c.intro.subtitle} locale={locale} />
      <FaqGroups content={c} locale={locale} />
      <FinalCta finalCta={c.finalCta} locale={locale} />
    </>
  );
}
