import type { NegociosContent } from "@/content/negocios";
import type { Locale } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

/**
 * Un bloque por rubro (FR-009) con su ancla: resumen, "Lo que pasa" (acento naranja =
 * alerta, como en Problemas) y "Cómo te ayuda StoreFlow" (check verde), más la CTA principal.
 * Los bloques alternan fondo para marcar el ritmo.
 */
export function BusinessList({ content, locale }: { content: NegociosContent; locale: Locale }) {
  return (
    <>
      {content.businesses.map((b, i) => (
        <section
          key={b.key}
          id={b.id}
          aria-labelledby={`${b.id}-title`}
          className={`scroll-mt-16 py-section ${i % 2 === 0 ? "bg-canvas" : "bg-surface"}`}
        >
          <Container>
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Icon name={b.icon} />
              </span>
              <div className="max-w-2xl">
                <h2 id={`${b.id}-title`} className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                  {b.title}
                </h2>
                <p className="mt-3 text-lg text-fg-2">{b.summary}</p>
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-card border border-line bg-surface-2 p-6">
                <h3 className="text-lg font-semibold text-fg">{content.problemsTitle}</h3>
                <ul className="mt-4 space-y-3">
                  {b.problems.map((p) => (
                    <li key={p} className="flex gap-3 text-fg-2">
                      <Icon name="alert" className="mt-0.5 size-5 shrink-0 text-accent" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-card border border-line bg-surface-2 p-6">
                <h3 className="text-lg font-semibold text-fg">{content.solutionsTitle}</h3>
                <ul className="mt-4 space-y-3">
                  {b.solutions.map((s) => (
                    <li key={s} className="flex gap-3 text-fg">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ok text-on-ok">
                        <Icon name="check" className="size-3.5" />
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <Button href={content.finalCta.cta.href} locale={locale}>
                {content.finalCta.cta.label}
              </Button>
            </div>
          </Container>
        </section>
      ))}
    </>
  );
}
