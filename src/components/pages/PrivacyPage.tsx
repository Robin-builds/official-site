import { notFound } from "next/navigation";
import { privacidad } from "@/content/privacidad";
import type { Locale } from "@/content/types";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { getPage } from "@/lib/i18n";

/**
 * Privacidad (FR-019, research R11): solo con el texto entregado por el owner.
 * Sin texto en ese idioma → "no encontrada". Sin CTA: es una página legal.
 */
export function PrivacyPage({ locale }: { locale: Locale }) {
  const { text } = privacidad[locale];
  if (text === null) notFound();

  return (
    <>
      <PageHeader title={getPage("privacy").locales[locale].title} locale={locale} />
      <section className="bg-surface py-section">
        <Container className="max-w-3xl space-y-5 text-lg leading-relaxed text-fg-2">
          {text.split(/\n\s*\n/).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Container>
      </section>
    </>
  );
}
