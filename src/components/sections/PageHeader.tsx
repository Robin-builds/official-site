import type { Cta, Locale } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Encabezado de las páginas internas: H1 + bajada y, opcionalmente, la CTA principal.
 * Mismo fondo en gradiente que el hero de Inicio, más bajo.
 */
export function PageHeader({
  title,
  subtitle,
  eyebrow,
  cta,
  locale,
  children,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  cta?: Cta;
  locale: Locale;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-[linear-gradient(180deg,var(--bg-top),var(--bg-mid)_70%,var(--bg-bottom))]">
      <Container className="pt-12 pb-14 sm:pt-16 sm:pb-20">
        <div className="max-w-3xl">
          {eyebrow && <p className="text-sm font-bold tracking-wide text-accent-text uppercase">{eyebrow}</p>}
          <h1
            className={`text-[2.125rem] leading-[1.1] font-extrabold tracking-tight text-fg sm:text-5xl ${eyebrow ? "mt-3" : ""}`}
          >
            {title}
          </h1>
          {subtitle && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-2 sm:text-xl">{subtitle}</p>}
          {cta && (
            <div className="mt-8">
              <Button href={cta.href} locale={locale} size="lg">
                {cta.label}
              </Button>
            </div>
          )}
        </div>
        {children}
      </Container>
    </section>
  );
}
