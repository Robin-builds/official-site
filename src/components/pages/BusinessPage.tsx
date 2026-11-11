import { negocios } from "@/content/negocios";
import type { Locale } from "@/content/types";
import { BusinessList } from "@/components/sections/BusinessList";
import { FeatureIndex } from "@/components/sections/FeatureIndex";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHeader } from "@/components/sections/PageHeader";

/** Para tu negocio (FR-009): índice de 4 rubros, un bloque por rubro y CTA final. */
export function BusinessPage({ locale }: { locale: Locale }) {
  const c = negocios[locale];
  return (
    <>
      <PageHeader title={c.intro.title} subtitle={c.intro.subtitle} locale={locale}>
        <FeatureIndex label={c.indexLabel} items={c.businesses} />
      </PageHeader>
      <BusinessList content={c} locale={locale} />
      <FinalCta finalCta={c.finalCta} locale={locale} />
    </>
  );
}
