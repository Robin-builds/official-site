"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/content/types";

type Labels = Record<Locale, { short: string; name: string }>;

/**
 * Selector ES/EN (FR-026, research R17). Lleva a la MISMA página en el otro idioma.
 *
 * El servidor entrega la tabla `alternates` (dirección → equivalente en el otro idioma) y aquí
 * solo se busca la dirección actual con `usePathname()`, que en rutas estáticas se resuelve en
 * el prerender: el HTML ya trae el enlace correcto y funciona sin JavaScript.
 * Son <a> normales: cambiar de idioma cambia de layout raíz y recarga la página (R16).
 */
export function LanguageSwitch({
  locale,
  alternates,
  fallback,
  labels,
  groupLabel,
}: {
  locale: Locale;
  alternates: Record<string, string>;
  /** Destino si la dirección no está en la tabla: el Inicio del otro idioma */
  fallback: string;
  labels: Labels;
  groupLabel: string;
}) {
  const pathname = usePathname();
  const otherHref = alternates[pathname] ?? fallback;
  const order: Locale[] = ["es", "en"];

  return (
    <ul aria-label={groupLabel} className="flex items-center rounded-button border border-line p-0.5 text-sm font-semibold">
      {order.map((l) => {
        const current = l === locale;
        const hreflang = l === "es" ? "es-CL" : "en";
        return (
          <li key={l}>
            <a
              href={current ? pathname : otherHref}
              lang={hreflang}
              hrefLang={hreflang}
              aria-label={labels[l].name}
              aria-current={current ? "true" : undefined}
              className={`inline-grid h-9 min-w-10 place-items-center rounded-[0.45rem] px-2 transition-colors ${
                current ? "bg-primary text-on-primary" : "text-fg-2 hover:bg-surface-2 hover:text-fg"
              }`}
            >
              {labels[l].short}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
