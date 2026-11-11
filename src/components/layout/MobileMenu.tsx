"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Menú desplegable bajo 1024 px (research R3): un <details> nativo, que abre y cierra con
 * toque, Enter o Espacio aunque no haya JavaScript. Este componente solo agrega:
 * - cerrar con Escape, devolviendo el foco al botón;
 * - cerrar al cambiar de página (el layout persiste entre navegaciones de <Link>);
 * - cerrar al tocar fuera del menú.
 * El panel (children) llega renderizado desde el servidor.
 */
export function MobileMenu({ openLabel, closeLabel, children }: { openLabel: string; closeLabel: string; children: ReactNode }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Cierre al navegar: la página nueva no debe aparecer con el menú abierto
  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = false;
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape" || !detailsRef.current) return;
      detailsRef.current.open = false;
      summaryRef.current?.focus();
    }
    function onPointerDown(e: PointerEvent) {
      const details = detailsRef.current;
      if (details && !details.contains(e.target as Node)) details.open = false;
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <details ref={detailsRef} className="mobile-menu" onToggle={(e) => setOpen(e.currentTarget.open)}>
      {/* list-none + marcador webkit oculto: se reemplaza por el ícono propio */}
      <summary
        ref={summaryRef}
        aria-label={open ? closeLabel : openLabel}
        className="inline-grid size-11 cursor-pointer list-none place-items-center rounded-button border border-line text-fg transition-colors hover:bg-surface-2 [&::-webkit-details-marker]:hidden"
      >
        {/* Hamburguesa / cerrar: globals.css muestra uno u otro según details[open] */}
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="menu-icon-open size-5">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="menu-icon-close size-5">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </summary>
      <div className="mobile-menu-panel">{children}</div>
    </details>
  );
}
