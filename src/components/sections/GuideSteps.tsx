import { inicio } from "@/content/inicio";
import { ui } from "@/content/site";
import type { GuideStep, Locale } from "@/content/types";
import { Container } from "@/components/ui/Container";
import { PhoneFrame, ScreenImage } from "./PhoneMockup";

const SCREEN_SIZES = "(min-width: 768px) 220px, 200px";

/**
 * Pasos numerados de una guía (FR-014): número visible (y "Paso" para lectores), título,
 * texto y captura real cuando existe. El orden de la lista es el de la app (Principio I).
 */
export function GuideSteps({ steps, label, locale }: { steps: GuideStep[]; label: string; locale: Locale }) {
  const { a11y } = ui[locale];

  return (
    <section aria-label={label} className="bg-surface py-section">
      <Container className="max-w-4xl">
        <ol className="flex flex-col gap-12">
          {steps.map((step, i) => (
            <li key={step.title} className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:gap-8">
              <span className="grid size-12 place-items-center rounded-full bg-primary text-xl font-extrabold text-on-primary shadow-card">
                <span className="sr-only">{a11y.step} </span>
                {i + 1}
              </span>
              <div className="max-w-xl">
                <h2 className="text-2xl font-semibold text-fg">{step.title}</h2>
                <p className="mt-3 text-lg leading-relaxed text-fg-2">{step.body}</p>
              </div>
              {step.screen && (
                <PhoneFrame className="w-[200px] md:w-[220px]">
                  <ScreenImage
                    screen={step.screen}
                    locale={locale}
                    pendingLabel={inicio[locale].hero.screenshotPending}
                    sizes={SCREEN_SIZES}
                  />
                </PhoneFrame>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
