import Link from "next/link";
import { notFound } from "next/navigation";
import { ayuda } from "@/content/ayuda";
import { funcionalidades } from "@/content/funcionalidades";
import { readyGuides } from "@/content/guias";
import { ui } from "@/content/site";
import type { Locale } from "@/content/types";
import { FinalCta } from "@/components/sections/FinalCta";
import { GuideSteps } from "@/components/sections/GuideSteps";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { isPublished, pageHref } from "@/lib/i18n";

/** Página de una guía (FR-014): pasos numerados, enlace a su funcionalidad y CTA final. */
export function GuidePage({ slug, locale }: { slug: string; locale: Locale }) {
  const guide = readyGuides().find((g) => g.locales[locale].slug === slug);
  if (!guide) notFound();

  const text = guide.locales[locale];
  const c = ayuda[locale];
  const feature = funcionalidades[locale].features.find((f) => f.key === guide.feature);

  return (
    <>
      <PageHeader eyebrow={c.title} title={text.title} subtitle={text.summary} locale={locale} />
      <GuideSteps steps={text.steps} label={c.stepsLabel} locale={locale} />
      {feature && isPublished("features", locale) && (
        <div className="bg-surface pb-section">
          <Container className="max-w-4xl">
            <Link
              href={`${pageHref("features", locale)}#${feature.id}`}
              className="inline-flex min-h-11 items-center rounded-sm font-semibold text-link underline underline-offset-4 hover:no-underline"
            >
              {ui[locale].common.seeFeature}: {feature.title}
            </Link>
          </Container>
        </div>
      )}
      <FinalCta finalCta={c.finalCta} locale={locale} />
    </>
  );
}
