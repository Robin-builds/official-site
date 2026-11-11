import { descargar } from "@/content/descargar";
import { ui } from "@/content/site";
import type { Locale } from "@/content/types";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

/** Descargar (FR-012): Google Play, requisitos y acceso a la versión web. */
export function DownloadPage({ locale }: { locale: Locale }) {
  const c = descargar[locale];
  const { a11y } = ui[locale];

  return (
    <>
      <PageHeader title={c.title} subtitle={c.body} cta={c.cta} locale={locale}>
        {/* Nota sobre el idioma de la app y las capturas (solo en inglés, research R19) */}
        {c.appLanguageNote && <p className="mt-6 max-w-xl text-sm text-fg-3">{c.appLanguageNote}</p>}
      </PageHeader>
      <section aria-labelledby="requisitos-title" className="bg-surface py-section">
        <Container className="max-w-3xl">
          <h2 id="requisitos-title" className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            {c.requirementsTitle}
          </h2>
          <ul className="mt-6 space-y-4">
            {c.requirements.map((r) => (
              <li key={r} className="flex gap-3 text-lg text-fg">
                <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-ok text-on-ok">
                  <Icon name="check" className="size-4" />
                </span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
          {/* Acceso para usuarios existentes: utilitario (Principio II) */}
          <p className="mt-10 text-fg-2">
            {c.loginLine.text}{" "}
            <a
              href={c.loginLine.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm font-semibold text-link underline underline-offset-4 hover:no-underline"
            >
              {c.loginLine.link}
              <span className="sr-only"> {a11y.newTab}</span>
            </a>
          </p>
        </Container>
      </section>
    </>
  );
}
