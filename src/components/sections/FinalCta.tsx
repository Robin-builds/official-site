import type { Cta, Locale } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Cierre de conversión: bloque con la tinta de marca (#0D1519) en AMBOS temas.
 * data-theme="dark" en el bloque fuerza los tokens oscuros dentro de él (globals.css los
 * declara también sobre [data-theme="dark"]), así título y texto mantienen el contraste sobre
 * la tinta aunque la página esté en claro.
 * Salvo el botón: su envoltorio .page-primary le devuelve el primario del tema de la PÁGINA
 * (teal en claro, cian en oscuro), igual que el resto de los "Pruébala gratis" (spec 010 FR-008).
 * Separación: pt-section arriba y media separación abajo, para no dejar una franja de canvas
 * vacía antes del pie que se lea como "fin de página" (spec 010 FR-012, research R7).
 * Lo usan Inicio y las páginas internas, cada una con su propio texto.
 */
type FinalCtaContent = { title: string; subtitle: string; cta: Cta; note: string };

export function FinalCta({ finalCta, locale }: { finalCta: FinalCtaContent; locale: Locale }) {

  return (
    <section aria-labelledby="cta-final-title" className="bg-canvas pt-section pb-[calc(var(--spacing-section)/2)]">
      <Container>
        <div
          data-theme="dark"
          className="relative isolate overflow-hidden rounded-[2rem] bg-brand-ink px-6 py-12 text-center sm:px-12 sm:py-20"
        >
          {/* Brillos de marca decorativos: cian arriba, naranja abajo */}
          <div
            aria-hidden="true"
            className="absolute -top-28 -right-24 -z-10 size-80 rounded-full bg-brand-cyan/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-24 -z-10 size-80 rounded-full bg-brand-orange/10 blur-3xl"
          />

          <h2
            id="cta-final-title"
            className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-fg sm:text-5xl"
          >
            {finalCta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-fg-2">{finalCta.subtitle}</p>
          <div className="page-primary mt-9 flex justify-center">
            <Button href={finalCta.cta.href} locale={locale} size="lg">
              {finalCta.cta.label}
            </Button>
          </div>
          <p className="mt-5 text-sm text-fg-3">{finalCta.note}</p>
        </div>
      </Container>
    </section>
  );
}
