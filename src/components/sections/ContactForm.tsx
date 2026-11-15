"use client";

import { useState, useSyncExternalStore } from "react";
import type { ContactContent, ContactField } from "@/content/contacto";
import { ui } from "@/content/site";
import type { Locale } from "@/content/types";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { CONTACT_FIELDS, contactLink, validateContact, validateField } from "@/lib/contact";
import type { ContactData, ContactErrors } from "@/lib/contact";

/*
 * Formulario de Contacto (spec 006, US1). Valida en el navegador, arma un mensaje rotulado y
 * abre wa.me en una pestaña nueva. Nada sale del navegador salvo dentro de ese enlace (SC-005):
 * sin fetch, sin almacenamiento, sin cookies, sin medición.
 *
 * Sin JavaScript (research R7): el <fieldset> se renderiza deshabilitado hasta hidratar y los
 * campos no tienen atributo `name`, así un envío nativo por GET no puede llevar datos.
 */

// Hidratación sin setState en useEffect: el servidor ve `false`, el cliente `true`.
const noopSubscribe = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

const EMPTY: ContactData = { name: "", company: "", phone: "", email: "", message: "" };

// Atributos propios de cada campo (data-model.md): tipo, autocompletado y largo máximo (R4)
const FIELD_ATTRS: Record<ContactField, React.InputHTMLAttributes<HTMLInputElement>> = {
  name: { autoComplete: "name", maxLength: 100 },
  company: { autoComplete: "organization", maxLength: 100 },
  phone: { type: "tel", inputMode: "tel", autoComplete: "tel", maxLength: 30 },
  email: { type: "email", autoComplete: "email", maxLength: 254 },
  message: {}, // textarea: ver abajo
};

const REQUIRED: ContactField[] = ["name", "company"];

const fieldId = (field: ContactField) => `contact-${field}`;

// Mismos tokens que el resto del sitio; el foco visible lo da la regla global :focus-visible
const inputClass =
  "mt-2 block min-h-11 w-full rounded-button border bg-surface px-3 py-2 text-base text-fg transition-colors";

type Status = { kind: "errors"; count: number } | { kind: "sent"; url: string } | null;

export function ContactForm({
  content,
  message,
  locale,
}: {
  content: ContactContent["form"];
  message: ContactContent["message"];
  locale: Locale;
}) {
  const hydrated = useHydrated();
  const [data, setData] = useState<ContactData>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  // Tras el primer intento de envío, cada campo se revalida al escribir (R5)
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  function update(field: ContactField, value: string) {
    setData((d) => ({ ...d, [field]: value }));
    if (attempted) {
      const next = { ...errors, [field]: validateField(field, value) };
      if (!next[field]) delete next[field];
      setErrors(next);
      // Resumen de errores: se quita cuando ya no queda ninguno (no se reanuncia en cada tecla)
      if (status?.kind === "errors" && Object.keys(next).length === 0) setStatus(null);
    }
    // El enlace del aviso "enviado" quedaría con los datos viejos: se quita al editar
    if (status?.kind === "sent") setStatus(null);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAttempted(true);
    const found = validateContact(data);
    setErrors(found);

    const invalid = CONTACT_FIELDS.filter((f) => found[f]);
    if (invalid.length > 0) {
      setStatus({ kind: "errors", count: invalid.length });
      // Foco al primer campo con error, en el orden del formulario (FR-006)
      document.getElementById(fieldId(invalid[0]))?.focus();
      return;
    }

    const url = contactLink(data, message);
    // Pestaña nueva dentro del gesto del usuario. No se pasa "noopener" porque hace que
    // window.open devuelva null; se corta la referencia a mano (R6).
    const w = window.open(url, "_blank");
    if (w) w.opener = null;
    // Siempre se muestra el enlace de respaldo, por si un bloqueador frenó la pestaña.
    // El formulario no se limpia (R6).
    setStatus({ kind: "sent", url });
  }

  return (
    <div className="mt-6">
      <noscript>
        <p className="mb-6 rounded-card border border-line bg-surface-2 p-4 text-fg">{content.noScript}</p>
      </noscript>

      <form noValidate onSubmit={onSubmit}>
        <fieldset disabled={!hydrated} className="min-w-0 disabled:opacity-60">
          <div className="grid gap-5 sm:grid-cols-2">
          {CONTACT_FIELDS.map((field) => {
            const f = content.fields[field];
            const id = fieldId(field);
            const errorCode = errors[field];
            const errorText = errorCode ? content.errors[field][errorCode] : undefined;
            // La ayuda y el error se leen junto con la etiqueta
            const describedBy =
              [f.hint ? `${id}-hint` : null, errorText ? `${id}-error` : null].filter(Boolean).join(" ") ||
              undefined;
            const common = {
              id,
              value: data[field],
              "aria-invalid": errorText ? true : undefined,
              "aria-describedby": describedBy,
              "aria-required": REQUIRED.includes(field) ? true : undefined,
              className: `${inputClass} ${errorText ? "border-danger" : "border-line"}`,
            } as const;

            return (
              // El mensaje ocupa las dos columnas; el resto va de a dos desde 640 px
              <div key={field} className={field === "message" ? "sm:col-span-2" : undefined}>
                <label htmlFor={id} className="block font-semibold text-fg">
                  {f.label}
                </label>
                {f.hint && (
                  <p id={`${id}-hint`} className="mt-1 text-sm text-fg-2">
                    {f.hint}
                  </p>
                )}
                {field === "message" ? (
                  <textarea
                    {...common}
                    rows={4}
                    maxLength={500}
                    autoComplete="off"
                    onChange={(e) => update(field, e.target.value)}
                  />
                ) : (
                  <input {...common} {...FIELD_ATTRS[field]} onChange={(e) => update(field, e.target.value)} />
                )}
                {errorText && (
                  // Texto + ícono, no solo color (FR-006)
                  <p id={`${id}-error`} className="mt-2 flex gap-2 text-sm font-medium text-danger">
                    <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
                    <span>{errorText}</span>
                  </p>
                )}
              </div>
            );
          })}
          </div>

          {/* Región viva: resumen de errores o aviso de enviado con enlace de respaldo.
              Siempre presente (vacía no ocupa espacio) para que los lectores la anuncien. */}
          <div role="status">
            {status?.kind === "errors" && (
              <p className="mt-5 font-medium text-danger">
                {(status.count === 1 ? content.errorSummary.one : content.errorSummary.other).replace(
                  "{n}",
                  String(status.count),
                )}
              </p>
            )}
            {status?.kind === "sent" && (
              <p className="mt-5 text-fg">
                {content.sent.text}{" "}
                <a
                  href={status.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-link underline underline-offset-4"
                >
                  {content.sent.link}
                  <span className="sr-only"> {ui[locale].a11y.newTab}</span>
                </a>
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col items-start gap-3">
            <button type="submit" className={buttonClasses("primary", "lg")}>
              {content.submit}
            </button>
            <p className="text-sm text-fg-2">{content.privacyNote}</p>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
