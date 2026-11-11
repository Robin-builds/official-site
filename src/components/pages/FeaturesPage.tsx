import { funcionalidades } from "@/content/funcionalidades";
import type { Locale } from "@/content/types";
import { FeatureGroups } from "@/components/sections/FeatureGroups";
import { FeatureIndex } from "@/components/sections/FeatureIndex";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHeader } from "@/components/sections/PageHeader";

/** Funcionalidades (FR-008): encabezado con índice de 5 grupos, grupos y CTA final. */
export function FeaturesPage({ locale }: { locale: Locale }) {
  const c = funcionalidades[locale];
  return (
    <>
      <PageHeader title={c.intro.title} subtitle={c.intro.subtitle} locale={locale}>
        <FeatureIndex label={c.indexLabel} items={c.groups} />
      </PageHeader>
      <FeatureGroups content={c} locale={locale} />
      <FinalCta finalCta={c.finalCta} locale={locale} />
    </>
  );
}
