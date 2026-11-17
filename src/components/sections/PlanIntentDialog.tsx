"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { planes, plans } from "@/content/planes";
import type { Period } from "@/content/planes";
import { URLS, ui } from "@/content/site";
import type { Locale } from "@/content/types";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { pageHref } from "@/lib/i18n";
import { MAX_LENGTH, priceLabel, readOrigin, validateIntentField } from "@/lib/planes";
import type { IntentErrors, IntentField, PaidPlanId } from "@/lib/planes";
import { fillTemplate } from "@/lib/text";

/*
 * Ventana "Quiero el plan X" (spec 009, US2, FR-011). <dialog> nativo con showModal() (R6):
 * el navegador da Esc, foco atrapado y el resto de la página inerte. Se monta al tocar el botón
 * y se desmonta al cerrar, así cada apertura empieza limpia. No cobra ni pide datos de pago.
 */

type Status = { kind: "errors"; count: number } | { kind: "sending" } | { kind: "sent" } | { kind: "failed" } | null;

const FIELDS: IntentField[] = ["email", "whatsapp"];
const fieldId = (f: IntentField) => `intent-${f}`;
const inputClass =
  "mt-2 block min-h-11 w-full rounded-button border bg-surface-2 px-3 py-2 text-base text-fg transition-colors";

export function PlanIntentDialog({
  plan,
  period,
  locale,
  onClose,
}: {
  plan: PaidPlanId;
  period: Period;
  locale: Locale;
  onClose: () => void;
}) {
  const c = planes[locale].dialog;
  const planName = plans.find((p) => p.id === plan)?.name ?? plan;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [data, setData] = useState({ email: "", whatsapp: "" });
  // Campo trampa para bots (ver /api/plan-intent): una persona nunca lo ve ni lo llena
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<IntentErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const sending = status?.kind === "sending";

  // Abre como modal al montarse y lleva el foco al correo. El guard evita reabrir en el doble
  // efecto del modo estricto de desarrollo.
  useEffect(() => {
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
    document.getElementById(fieldId("email"))?.focus();
  }, []);

  const close = () => dialogRef.current?.close(); // dispara "close" → onClose

  function fieldErrors(next: typeof data): IntentErrors {
    const found: IntentErrors = {};
    for (const f of FIELDS) {
      const e = validateIntentField(f, next[f]);
      if (e) (found as Record<string, string>)[f] = e;
    }
    return found;
  }

  function update(field: IntentField, value: string) {
    const next = { ...data, [field]: value };
    setData(next);
    // Tras el primer intento, cada campo se revalida al escribir (como Contacto)
    if (attempted) {
      const found = fieldErrors(next);
      setErrors(found);
      if (status?.kind === "errors" && Object.keys(found).length === 0) setStatus(null);
    }
    if (status?.kind === "failed") setStatus(null);
  }

  function showErrors(found: IntentErrors) {
    const invalid = FIELDS.filter((f) => found[f]);
    setErrors(found);
    setStatus({ kind: "errors", count: invalid.length });
    if (invalid[0]) document.getElementById(fieldId(invalid[0]))?.focus();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return; // evita envíos dobles
    setAttempted(true);
    const found = fieldErrors(data);
    if (Object.keys(found).length > 0) return showErrors(found);

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/plan-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, plan, period, ...data, origin: readOrigin(), website }),
      });
      const json: { ok: boolean; errors?: IntentErrors } = await res.json().catch(() => ({ ok: false }));
      if (json.ok) setStatus({ kind: "sent" });
      else if (json.errors && FIELDS.some((f) => json.errors?.[f])) showErrors(json.errors);
      else setStatus({ kind: "failed" }); // conserva lo escrito para reintentar
    } catch {
      setStatus({ kind: "failed" });
    }
  }

  const summary = fillTemplate(c.summary, {
    plan: planName,
    period: planes[locale].periods[period],
    price: priceLabel(plan, period, locale),
  });

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="intent-title"
      onClose={onClose}
      // Tocar el fondo cierra: el clic en el backdrop llega con el propio <dialog> como destino
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-card border border-card-line bg-surface p-0 text-fg shadow-2xl backdrop:bg-black/60"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="intent-title" className="text-xl font-bold tracking-tight text-fg sm:text-2xl">
              {status?.kind === "sent"
                ? fillTemplate(c.sent.title, { plan: planName })
                : fillTemplate(c.title, { plan: planName })}
            </h2>
            <p className="mt-1 text-fg-2">{summary}</p>
          </div>
          <button type="button" onClick={close} className={buttonClasses("ghost", "sm", "shrink-0")}>
            {c.close}
          </button>
        </div>

        {status?.kind === "sent" ? (
          // Confirmación honesta, sin prometer cobro, activación ni precio (FR-016)
          <p role="status" className="mt-6 text-lg text-fg">
            {c.sent.body}
          </p>
        ) : (
          <form noValidate onSubmit={onSubmit} aria-busy={sending} className="mt-6">
            <div className="flex flex-col gap-5">
              {FIELDS.map((field) => {
                const f = c.fields[field];
                const id = fieldId(field);
                const code = errors[field];
                const errorText = code ? (c.errors[field] as Record<string, string>)[code] : undefined;
                const hint = field === "whatsapp" ? c.fields.whatsapp.hint : undefined;
                const describedBy =
                  [hint ? `${id}-hint` : null, errorText ? `${id}-error` : null].filter(Boolean).join(" ") ||
                  undefined;
                return (
                  <div key={field}>
                    <label htmlFor={id} className="block font-semibold text-fg">
                      {f.label}
                    </label>
                    {hint && (
                      <p id={`${id}-hint`} className="mt-1 text-sm text-fg-2">
                        {hint}
                      </p>
                    )}
                    <input
                      id={id}
                      value={data[field]}
                      onChange={(e) => update(field, e.target.value)}
                      aria-invalid={errorText ? true : undefined}
                      aria-describedby={describedBy}
                      aria-required={field === "email" ? true : undefined}
                      maxLength={MAX_LENGTH[field]}
                      {...(field === "email"
                        ? { type: "email", autoComplete: "email" }
                        : { type: "tel", inputMode: "tel" as const, autoComplete: "tel" })}
                      className={`${inputClass} ${errorText ? "border-danger" : "border-line"}`}
                    />
                    {errorText && (
                      // Texto + ícono, no solo color
                      <p id={`${id}-error`} className="mt-2 flex gap-2 text-sm font-medium text-danger">
                        <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
                        <span>{errorText}</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Trampa para bots: fuera de pantalla, sin foco con Tab y oculta a lectores de pantalla */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>

            {/* Región viva: resumen de errores o aviso de falla (con salida a Contacto) */}
            <div role="status">
              {status?.kind === "errors" && (
                <p className="mt-5 font-medium text-danger">
                  {fillTemplate(status.count === 1 ? c.errorSummary.one : c.errorSummary.other, { n: status.count })}
                </p>
              )}
              {status?.kind === "failed" && (
                <p className="mt-5 flex gap-2 font-medium text-danger">
                  <Icon name="alert" className="mt-1 size-4 shrink-0" />
                  <span>
                    {c.failed.text}{" "}
                    <Link
                      href={pageHref("contact", locale)}
                      className="font-semibold text-link underline underline-offset-4"
                    >
                      {c.failed.link}
                    </Link>
                    .
                  </span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={sending}
              className={`${buttonClasses("primary", "lg", "mt-6 w-full")} disabled:cursor-wait disabled:opacity-70`}
            >
              {sending ? c.sending : c.submit}
            </button>

            {/* Para qué se usan los datos y enlace a la política (FR-017) */}
            <p className="mt-4 text-sm text-fg-2">
              {c.privacyNote.text}{" "}
              <a
                href={URLS.privacyPolicy}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-link underline underline-offset-4"
              >
                {c.privacyNote.link}
                <span className="sr-only"> {ui[locale].a11y.newTab}</span>
              </a>
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}
