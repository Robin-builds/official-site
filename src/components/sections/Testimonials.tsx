import type { InicioContent } from "@/content/inicio";
import { Section } from "@/components/ui/Section";

/**
 * Testimonios condicionales (Principio I, FR-013): si no hay testimonios reales en inicio.ts,
 * la sección no se renderiza ni deja espacio vacío.
 */
export function Testimonials({ testimonials }: { testimonials: InicioContent["testimonials"] }) {

  if (testimonials.items.length === 0) return null;

  return (
    <Section titleId="testimonios-title" title={testimonials.title} tone="canvas">
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.items.map((t) => (
          <li key={t.name}>
            <figure className="card-hover h-full rounded-card border border-line bg-surface p-6 shadow-card">
              <blockquote className="text-fg">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-fg">{t.name}</span>
                <span className="text-fg-3"> · {t.business}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
