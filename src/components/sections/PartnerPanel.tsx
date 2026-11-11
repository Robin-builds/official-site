import type { PartnerContent } from "@/content/partner";
import type { Locale } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

/**
 * Panel de "Sé partner" (antes la sección Contadores): superficie elevada con borde/acento
 * naranja. En esta página la conversión principal es WhatsApp (excepción del Principio II),
 * por eso su botón es primario.
 */
export function PartnerPanel({ partner, locale }: { partner: PartnerContent; locale: Locale }) {
  return (
    <section aria-labelledby="partner-title" className="bg-canvas py-section">
      <Container>
        <div className="grid gap-10 rounded-[2rem] border border-accent/40 bg-surface-2 p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
          <div>
            {/* accent-text: naranja legible como texto (en claro es #B45309) */}
            <p className="text-sm font-bold tracking-wide text-accent-text uppercase">{partner.eyebrow}</p>
            <h1 id="partner-title" className="mt-3 text-3xl font-extrabold tracking-tight text-fg sm:text-5xl">
              {partner.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-fg-2">{partner.body}</p>
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-lg font-semibold text-fg">{partner.reasonsTitle}</h2>
            <ul className="mt-4 space-y-4">
              {partner.reasons.map((reason) => (
                <li key={reason} className="flex gap-3">
                  {/* on-ok: contraste del check sobre el verde en cada tema */}
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ok text-on-ok">
                    <Icon name="check" className="size-4" />
                  </span>
                  <span className="text-fg">{reason}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={partner.cta.href} locale={locale} size="lg">
                {partner.cta.label}
              </Button>
              <p className="text-sm text-muted-2">{partner.ctaNote}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
