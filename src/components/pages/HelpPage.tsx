import Link from "next/link";
import { ayuda } from "@/content/ayuda";
import { readyGuides } from "@/content/guias";
import type { Locale } from "@/content/types";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { guideHref } from "@/lib/i18n";

/** Ayuda (FR-014): lista de guías listas, con resumen de una línea. */
export function HelpPage({ locale }: { locale: Locale }) {
  const c = ayuda[locale];

  return (
    <>
      <PageHeader title={c.title} subtitle={c.subtitle} locale={locale} />
      <section aria-labelledby="guias-title" className="bg-surface py-section">
        <Container>
          <h2 id="guias-title" className="sr-only">
            {c.listLabel}
          </h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {readyGuides().map((guide, i) => {
              const text = guide.locales[locale];
              return (
                <li key={guide.key} className="card-hover rounded-card border border-line bg-surface-2">
                  <Link href={guideHref(guide.key, locale)} className="flex h-full gap-4 rounded-card p-6">
                    <span
                      aria-hidden="true"
                      className="card-icon grid size-10 shrink-0 place-items-center rounded-full bg-primary/12 font-extrabold text-primary"
                    >
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-xl font-semibold text-fg">{text.title}</span>
                      <span className="mt-1 block text-fg-2">{text.summary}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>
      <FinalCta finalCta={c.finalCta} locale={locale} />
    </>
  );
}
