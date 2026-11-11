"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

/**
 * Enlaces del menú principal con la página actual marcada (research R2).
 *
 * En rutas estáticas `usePathname()` se resuelve durante el prerender: el HTML ya trae
 * `aria-current="page"`, así la marca funciona sin JavaScript.
 * Inicio solo coincide exacto; el resto también marca sus subpáginas (/ayuda → /ayuda/x).
 */
export function NavLinks({ items, layout }: { items: NavItem[]; layout: "row" | "column" }) {
  const pathname = usePathname();

  function isCurrent(href: string) {
    if (href === "/" || href === "/en") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <ul className={layout === "row" ? "flex items-center gap-1" : "flex flex-col gap-1"}>
      {items.map((item) => {
        const current = isCurrent(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              // Página actual: texto principal y subrayado primario (no depende solo del color)
              className={`flex min-h-11 items-center rounded-button px-3 whitespace-nowrap text-sm font-medium transition-colors hover:bg-surface-2 hover:text-fg ${
                layout === "column" ? "text-base" : ""
              } ${
                current
                  ? "text-fg underline decoration-primary decoration-2 underline-offset-8"
                  : "text-fg-2"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
