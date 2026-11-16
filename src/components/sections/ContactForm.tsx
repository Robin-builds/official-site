"use client";

import { useState, useSyncExternalStore } from "react";
import type { ContactContent, ContactField } from "@/content/contacto";
import { ui } from "@/content/site";
import type { Locale } from "@/content/types";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { CONTACT_FIELDS, MAX_LENGTH, validateContact } from "@/lib/contact";
import type { ContactData, ContactErrors } from "@/lib/contact";

/*
 * Formulario de Contacto (spec 006, US1). Valida en el navegador y envía los datos a
 * /api/contact, que los manda por correo a StoreFlow. Sin almacenamiento, cookies ni medición.
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
  name: { autoComplete: "name", maxLength: MAX_LENGTH.name },
  company: { autoComplete: "organization", maxLength: MAX_LENGTH.company },
  phone: { type: "tel", inputMode: "tel", autoComplete: "tel", maxLength: MAX_LENGTH.phone },
  email: { type: "email", autoComplete: "email", maxLength: MAX_LENGTH.email },
  message: {}, // textarea: ver abajo
};

const REQUIRED: ContactField[] = ["name", "company"];

const fieldId = (field: ContactField) => `contact-${field}`;

// Mismos tokens que el resto del sitio; el foco visible lo da la regla global :focus-visible
const inputClass =
  "mt-2 block min-h-11 w-full rounded-button border bg-surface px-3 py-2 text-base text-fg transition-colors";

type Status =
  | { kind: "errors"; count: number }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "failed" }
  | null;

export function ContactForm({
  content,
  whatsappHref,
  locale,
}: {
  content: ContactContent["form"];
  whatsappHref: string; // salida si el envío falla
  locale: Locale;
}) {
  const hydrated = useHydrated();
  const [data, setData] = useState<ContactData>(EMPTY);
  // Campo trampa para bots (ver /api/contact): una persona nunca lo ve ni lo llena
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  // Tras el primer intento de envío, cada campo se revalida al escribir (R5)
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const sending = status?.kind === "sending";

  function update(field: ContactField, value: string) {
    const nextData = { ...data, [field]: value };
    setData(nextData);
    if (attempted) {
      // Todo el formulario: el error "falta teléfono o correo" se resuelve escribiendo en otro campo
      const next = validateContact(nextData);
      setErrors(next);
      // Resumen de errores: se quita cuando ya no queda ninguno (no se reanuncia en cada tecla)
      if (status?.kind === "errors" && Object.keys(next).length === 0) setStatus(null);
    }
    // Los avisos de enviado o de falla se refieren a un envío anterior: se quitan al editar
    if (status?.kind === "sent" || status?.kind === "failed") setStatus(null);
  }

  function showErrors(found: ContactErrors) {
    const invalid = CONTACT_FIELDS.filter((f) => found[f]);
    setErrors(found);
    setStatus({ kind: "errors", count: invalid.length });
    // Foco al primer campo con error, en el orden del formulario (FR-006)
    document.getElementById(fieldId(invalid[0]))?.focus();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return; // evita envíos dobles
    setAttempted(true);
    const found = validateContact(data);
    setErrors(found);
    if (Object.keys(found).length > 0) return showErrors(found);

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, data, website }),
      });
      const json: { ok: boolean; errors?: ContactErrors } = await res.json().catch(() => ({ ok: false }));
      if (json.ok) {
        // Enviado: se limpia el formulario para que no parezca pendiente ni se reenvíe
        setData(EMPTY);
        setAttempted(false);
        setStatus({ kind: "sent" });
      } else if (json.errors && Object.keys(json.errors).length > 0) {
        // El servidor revalida; solo difiere si alguien saltó el formulario
        showErrors(json.errors);
      } else {
        setStatus({ kind: "failed" });
      }
    } catch {
      // Sin conexión o el servidor no respondió: se conservan los datos para reintentar
      setStatus({ kind: "failed" });
    }
  }

  return (
    <div className="mt-6">
      <noscript>
        <p className="mb-6 rounded-card border border-card-line bg-surface-2 p-4 text-fg">{content.noScript}</p>
      </noscript>

      <form noValidate onSubmit={onSubmit} aria-busy={sending}>
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
                    maxLength={MAX_LENGTH.message}
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

          {/* Trampa para bots: fuera de pantalla, sin foco con Tab y oculta a lectores de pantalla */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {/* Región viva: resumen de errores, aviso de enviado o de falla (con salida a WhatsApp).
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
            {status?.kind === "sent" && <p className="mt-5 font-medium text-fg">{content.sent}</p>}
            {status?.kind === "failed" && (
              <p className="mt-5 flex gap-2 font-medium text-danger">
                <Icon name="alert" className="mt-1 size-4 shrink-0" />
                <span>
                  {content.failed.text}{" "}
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-link underline underline-offset-4"
                  >
                    {content.failed.link}
                    <span className="sr-only"> {ui[locale].a11y.newTab}</span>
                  </a>
                  .
                </span>
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col items-start gap-3">
            <button
              type="submit"
              disabled={sending}
              className={`${buttonClasses("primary", "lg")} disabled:cursor-wait disabled:opacity-70`}
            >
              {sending ? content.sending : content.submit}
            </button>
            <p className="text-sm text-fg-2">{content.privacyNote}</p>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
