import Link from "next/link";
import type { PreguntasContent } from "@/content/preguntas";
import { ui } from "@/content/site";
import type { Locale } from "@/content/types";
import { Container } from "@/components/ui/Container";
import { guideHref, readyGuide } from "@/lib/i18n";

/**
 * FAQ agrupada por tema (FR-011). Acordeón con <details>/<summary> nativos (spec 004): se abre
 * con Enter/Espacio, los lectores anuncian expandido/colapsado y funciona sin JavaScript.
 * "Ver la guía" solo si la guía está lista (FR-014a).
 */
export function FaqGroups({ content, locale }: { content: PreguntasContent; locale: Locale }) {
  const t = ui[locale].common;

  return (
    <section className="bg-surface py-section">
      <Container className="flex max-w-3xl flex-col gap-14">
        {content.groups.map((group) => (
          <div key={group.id} id={group.id} className="scroll-mt-20">
            <h2 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">{group.title}</h2>
            <div className="mt-6 divide-y divide-line rounded-card border border-line bg-surface-2 px-5 sm:px-8">
              {group.items.map((item) => {
                const guide = readyGuide(item.guide);
                return (
                  <details key={item.question} className="group">
                    {/* list-none + marcador webkit oculto: se reemplaza por el ícono +/- propio */}
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-lg font-semibold text-fg [&::-webkit-details-marker]:hidden">
                      {item.question}
                      <span
                        aria-hidden="true"
                        className="faq-toggle grid size-8 shrink-0 place-items-center rounded-full bg-surface text-primary group-open:rotate-45"
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
                          <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                        </svg>
                      </span>
                    </summary>
                    <div className="pr-12 pb-6">
                      {/* muted-2 y no text-3: sobre surface-2 en claro text-3 queda bajo AA */}
                      <p className="leading-relaxed text-muted-2">{item.answer}</p>
                      {guide && (
                        <Link
                          href={guideHref(guide.key, locale)}
                          className="mt-3 inline-flex min-h-11 items-center rounded-sm font-semibold text-link underline underline-offset-4 hover:no-underline"
                        >
                          {t.seeGuide}: {guide.locales[locale].title}
                        </Link>
                      )}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
