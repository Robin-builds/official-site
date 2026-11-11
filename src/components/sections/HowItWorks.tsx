import type { InicioContent } from "@/content/inicio";
import { ui } from "@/content/site";
import type { Locale } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { isPublished, pageHref } from "@/lib/i18n";

/**
 * 3 pasos numerados. Conserva el ancla de la landing (`#como-funciona`, FR-005) y enlaza a
 * Funcionalidades con una acción secundaria (Principio II).
 */
export function HowItWorks({ howItWorks, locale }: { howItWorks: InicioContent["howItWorks"]; locale: Locale }) {
  const { a11y } = ui[locale];

  return (
    <Section
      id={howItWorks.id}
      titleId="como-funciona-title"
      title={howItWorks.title}
      intro={howItWorks.intro}
      tone="canvas"
    >
      <ol className="relative grid gap-12 md:grid-cols-3 md:gap-8">
        {/* Línea que une los pasos en escritorio; pasa por el centro de los números (56px) */}
        <span
          aria-hidden="true"
          className="absolute top-7 right-[16.66%] left-[16.66%] hidden h-px bg-line md:block"
        />

        {howItWorks.steps.map((step, i) => (
          <li key={step.title} className="card-hover card-ghost relative flex flex-col items-center text-center">
            {/* Número de paso con más peso visual: 56px, primario del tema */}
            <span className="relative grid size-14 place-items-center rounded-full bg-primary text-2xl font-extrabold text-on-primary shadow-card">
              <span className="sr-only">{a11y.step} </span>
              {i + 1}
            </span>
            <span className="card-icon mt-6 grid size-11 place-items-center rounded-xl bg-primary/12 text-primary">
              <Icon name={step.icon} />
            </span>
            <h3 className="mt-4 text-xl font-semibold text-fg">{step.title}</h3>
            <p className="mt-2 max-w-xs text-fg-2">{step.description}</p>
          </li>
        ))}
      </ol>

      {isPublished(howItWorks.more.page, locale) && (
        <div className="mt-12 flex justify-center">
          <Button href={pageHref(howItWorks.more.page, locale)} locale={locale} variant="secondary">
            {howItWorks.more.label}
          </Button>
        </div>
      )}
    </Section>
  );
}
