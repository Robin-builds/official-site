import { contacto } from "@/content/contacto";
import type { Locale } from "@/content/types";
import { ContactAlternatives } from "@/components/sections/ContactAlternatives";
import { ContactForm } from "@/components/sections/ContactForm";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";

/**
 * Contacto (spec 006): encabezado sin CTA y dos columnas desde 1024 px. El formulario va
 * primero en el orden de lectura; las alternativas (botón directo y QR) quedan subordinadas.
 */
export function ContactPage({ locale }: { locale: Locale }) {
  const c = contacto[locale];

  return (
    <>
      <PageHeader title={c.header.title} subtitle={c.header.subtitle} locale={locale} />
      <section aria-labelledby="contact-form-title" className="bg-canvas py-section">
        <Container className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
          {/* Columna formulario (US1) */}
          <div className="min-w-0">
            <h2 id="contact-form-title" className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
              {c.form.title}
            </h2>
            <ContactForm content={c.form} whatsappHref={c.alternatives.direct.href} locale={locale} />
          </div>
          {/* Columna alternativas (US2) */}
          <div className="min-w-0">
            <ContactAlternatives content={c.alternatives} locale={locale} />
          </div>
        </Container>
      </section>
    </>
  );
}
