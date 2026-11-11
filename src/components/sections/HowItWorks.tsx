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
      {/* En celular cada paso es una fila (número + texto) para acortar Inicio (SC-003);
          desde 768 px, tres columnas centradas con su ícono */}
      <ol className="relative grid gap-6 md:grid-cols-3 md:gap-8">
        {/* Línea que une los pasos en escritorio; pasa por el centro de los números (56px) */}
        <span
          aria-hidden="true"
          className="absolute top-7 right-[16.66%] left-[16.66%] hidden h-px bg-line md:block"
        />

        {howItWorks.steps.map((step, i) => (
          <li key={step.title} className="card-hover card-ghost relative flex gap-4 md:flex-col md:items-center md:text-center">
            {/* Número de paso con más peso visual: 56px, primario del tema */}
            <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-primary text-xl font-extrabold text-on-primary shadow-card md:size-14 md:text-2xl">
              <span className="sr-only">{a11y.step} </span>
              {i + 1}
            </span>
            <span className="card-icon mt-6 hidden size-11 place-items-center rounded-xl bg-primary/12 text-primary md:grid">
              <Icon name={step.icon} />
            </span>
            <div>
              <h3 className="mt-2 text-xl font-semibold text-fg md:mt-4">{step.title}</h3>
              <p className="mt-2 max-w-xs text-fg-2 md:mx-auto">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      {isPublished(howItWorks.more.page, locale) && (
        <div className="mt-10 flex justify-center sm:mt-12">
          <Button href={pageHref(howItWorks.more.page, locale)} locale={locale} variant="secondary">
            {howItWorks.more.label}
          </Button>
        </div>
      )}
    </Section>
  );
}
