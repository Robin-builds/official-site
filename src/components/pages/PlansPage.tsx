import Script from "next/script";
import { planes } from "@/content/planes";
import { URLS } from "@/content/site";
import type { Locale } from "@/content/types";
import { PageHeader } from "@/components/sections/PageHeader";
import { PlansGrid } from "@/components/sections/PlansGrid";
import { Container } from "@/components/ui/Container";

/**
 * Planes (spec 009): encabezado sin CTA y el apartado de planes. El `id="planes"` es el ancla
 * de FR-020 (`/planes#planes`).
 */
export function PlansPage({ locale }: { locale: Locale }) {
  const c = planes[locale];

  // Sitio en Umami Cloud (variable de Vercel, no secreta). Sin ella no se carga el script: la
  // página y el formulario funcionan igual, solo no se cuentan clics (research R1).
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <>
      {umamiId && (
        // Solo en Planes y con data-auto-track="false": no mide páginas ni nada automático; solo
        // los clics que PlansGrid envía con umami.track(). Sin cookies ni datos personales
        // (constitución 5.0.0, Principio IV). next/script reenvía los data-* al <script> final.
        <Script src={URLS.umamiScript} data-website-id={umamiId} data-auto-track="false" strategy="afterInteractive" />
      )}
      <PageHeader title={c.header.title} subtitle={c.header.subtitle} locale={locale} />
      <section id="planes" aria-label={c.header.title} className="scroll-mt-24 bg-canvas py-section">
        <Container>
          <PlansGrid locale={locale} />
          {/* Aviso obligatorio junto a los montos (Principio I, FR-018) */}
          <p className="mt-6 text-sm text-fg-2">{c.referenceNote}</p>

          {/* Prueba de 14 días: hoy no existe en la app, por eso va marcada "Próximamente" (FR-009) */}
          <div className="mt-12 rounded-card border border-card-line bg-surface-2 p-6 sm:p-8">
            <p className="inline-block rounded-full border border-line px-2.5 py-0.5 text-sm font-semibold text-fg">
              {c.soon}
            </p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-fg sm:text-2xl">{c.trial.title}</h2>
            <p className="mt-2 max-w-3xl text-fg-2">{c.trial.body}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
