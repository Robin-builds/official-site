import Link from "next/link";
import type { InicioContent } from "@/content/inicio";
import type { Locale } from "@/content/types";
import { Section } from "@/components/ui/Section";
import { isPublished, pageHref } from "@/lib/i18n";

/**
 * Accesos de Inicio a las páginas internas (FR-007): tarjetas-enlace con título, bajada y
 * flecha. Solo aparecen las páginas publicadas en ese idioma.
 */
export function Shortcuts({ shortcuts, locale }: { shortcuts: InicioContent["shortcuts"]; locale: Locale }) {
  const items = shortcuts.items.filter((item) => isPublished(item.key, locale));
  if (items.length === 0) return null;

  return (
    <Section titleId="accesos-title" title={shortcuts.title} tone="surface">
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.key} className="card-hover rounded-card border border-line bg-surface-2">
            <Link href={pageHref(item.key, locale)} className="flex h-full items-start justify-between gap-4 rounded-card p-5">
              <span>
                <span className="block text-lg font-semibold text-fg">{item.title}</span>
                <span className="mt-1 block text-fg-2">{item.description}</span>
              </span>
              <span className="card-icon grid size-9 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 0 1 .75-.75h10.64l-3.97-3.97a.75.75 0 1 1 1.06-1.06l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06l3.97-3.97H3.75A.75.75 0 0 1 3 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
