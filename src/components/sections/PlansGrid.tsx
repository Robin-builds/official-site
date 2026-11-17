"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { planes, plans } from "@/content/planes";
import type { Period } from "@/content/planes";
import { URLS, ui, whatsappLink } from "@/content/site";
import type { Locale } from "@/content/types";
import { buttonClasses } from "@/components/ui/Button";
import { PlanCard } from "@/components/sections/PlanCard";
import { PlanIntentDialog } from "@/components/sections/PlanIntentDialog";
import type { PaidPlanId } from "@/lib/planes";
import { fillTemplate } from "@/lib/text";

/*
 * Bloque interactivo de Planes (spec 009): selector Mensual/Anual, las 3 tarjetas, sus botones y
 * la ventana de intención. Único componente de cliente de la página (Principio VI).
 *
 * Medición (contracts/events.md): cada clic en los 3 botones llama a umami.track("plan-cta").
 * El script de Umami se carga solo en esta página con data-auto-track="false", que apaga TODO su
 * seguimiento automático (páginas y también los atributos data-umami-event, según su
 * documentación); por eso el clic se envía a mano. Sin datos personales.
 */

// Función del tracker de Umami (docs: tracker-functions). No existe si el script no cargó.
declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string>) => void };
  }
}

// Hidratación sin setState en useEffect: el servidor ve `false`, el cliente `true` (como Contacto)
const noopSubscribe = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

const PERIODS: Period[] = ["monthly", "annual"];

export function PlansGrid({ locale }: { locale: Locale }) {
  const c = planes[locale];
  const hydrated = useHydrated();
  const [period, setPeriod] = useState<Period>("monthly"); // Mensual por defecto (FR-008)
  const [open, setOpen] = useState<{ plan: PaidPlanId; period: Period } | null>(null);
  // Botón que abrió la ventana: recibe el foco al cerrarla (FR-011)
  const opener = useRef<HTMLButtonElement | null>(null);

  // Evento plan-cta (contracts/events.md); `period` es el visible al tocar. Si el script no cargó
  // (sin variable, bloqueador) no pasa nada y el botón funciona igual.
  const track = (plan: string, kind: "intent" | "activation") => {
    try {
      window.umami?.track("plan-cta", { plan, period, kind, lang: locale });
    } catch {
      // la medición nunca debe romper el botón
    }
  };

  return (
    <>
      {/* Selector de periodicidad: radios nativos (teclado y lectores sin código extra).
          Sin JavaScript queda deshabilitado en Mensual, que es lo que muestran las tarjetas. */}
      <fieldset disabled={!hydrated} className="mb-12 flex justify-center disabled:opacity-60">
        <legend className="sr-only">{c.periods.legend}</legend>
        <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-line bg-surface-2 p-1">
          {PERIODS.map((p) => (
            <label
              key={p}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 font-semibold text-fg transition-colors has-checked:bg-primary has-checked:text-on-primary has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary"
            >
              <input
                type="radio"
                name="plan-period"
                value={p}
                checked={period === p}
                onChange={() => setPeriod(p)}
                className="sr-only"
              />
              {c.periods[p]}
              {p === "annual" && (
                <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-bold whitespace-nowrap text-fg">
                  {c.periods.annualSaving}
                </span>
              )}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
        {plans.map((plan) => {
          const label = fillTemplate(c.cta.paid, { plan: plan.name });
          // Standard es la acción principal de la página (Principio II, excepción Planes)
          const classes = buttonClasses(plan.recommended ? "primary" : "secondary", "lg", "w-full");
          let cta: React.ReactNode;

          if (plan.id === "free") {
            // Free: directo a la descarga, como el resto del sitio; se cuenta como activación (FR-012)
            cta = (
              // Pestaña nueva, como los demás enlaces a Google Play del sitio (Button)
              <a
                href={URLS.googlePlay}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("secondary", "lg", "w-full")}
                onClick={() => track("free", "activation")}
              >
                {c.cta.free}
                <span className="sr-only"> {ui[locale].a11y.newTab}</span>
              </a>
            );
          } else if (!hydrated) {
            // Sin JavaScript: enlace a WhatsApp con el plan y la periodicidad en el mensaje (R5)
            cta = (
              <a
                href={whatsappLink(
                  fillTemplate(c.noScriptWhatsapp, { plan: plan.name, period: c.periods[period].toLowerCase() }),
                )}
                className={classes}
              >
                {label}
              </a>
            );
          } else {
            const id = plan.id;
            cta = (
              <button
                type="button"
                className={classes}
                onClick={(e) => {
                  track(id, "intent");
                  opener.current = e.currentTarget;
                  setOpen({ plan: id, period });
                }}
              >
                {label}
              </button>
            );
          }

          return (
            <PlanCard key={plan.id} plan={plan} text={c.plans[plan.id]} content={c} period={period} cta={cta} />
          );
        })}
      </div>

      {open && (
        <PlanIntentDialog
          plan={open.plan}
          period={open.period}
          locale={locale}
          onClose={() => {
            setOpen(null);
            opener.current?.focus();
          }}
        />
      )}
    </>
  );
}
