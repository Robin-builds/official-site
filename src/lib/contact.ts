/**
 * Lógica del formulario de Contacto (spec 006), sin React: validación y armado del mensaje y
 * del enlace de WhatsApp. Funciones puras para poder revisarlas sin navegador (research R3, R5).
 */
import type { ContactContent, ContactError, ContactField } from "@/content/contacto";
import { whatsappLink } from "@/content/site";

export type ContactData = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, ContactError>>;

/** Orden de los campos: el del formulario, del mensaje y del foco al primer error. */
export const CONTACT_FIELDS: ContactField[] = ["name", "company", "phone", "email", "message"];

// Teléfono: solo dígitos, espacios y + - ( ) . (se envía tal como se escribió)
const PHONE_CHARS = /^[0-9+\-(). ]+$/;
// Correo: forma mínima "algo@algo.algo"; la validación estricta no aporta y rechaza correos válidos
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Error de un solo campo (o undefined si está bien). Sirve para revalidar al escribir. */
export function validateField(field: ContactField, raw: string): ContactError | undefined {
  const value = raw.trim();
  switch (field) {
    case "name":
    case "company":
      return value ? undefined : "required";
    case "phone": {
      if (!value) return undefined; // opcional
      const digits = value.replace(/\D/g, "").length;
      return PHONE_CHARS.test(value) && digits >= 8 && digits <= 15 ? undefined : "phone";
    }
    case "email":
      return !value || EMAIL.test(value) ? undefined : "email";
    case "message":
      return undefined; // sin regla: el largo lo limita maxLength
  }
}

/** Errores de todo el formulario; objeto vacío = válido. */
export function validateContact(data: ContactData): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of CONTACT_FIELDS) {
    const error = validateField(field, data[field]);
    if (error) errors[field] = error;
  }
  return errors;
}

/**
 * Texto del mensaje: saludo y una línea "Rótulo: valor" por campo, en orden, omitiendo los
 * opcionales vacíos. Los saltos de línea los codifica encodeURIComponent dentro de whatsappLink.
 */
export function buildContactMessage(data: ContactData, text: ContactContent["message"]): string {
  const lines = [text.greeting];
  for (const field of CONTACT_FIELDS) {
    const value = data[field].trim();
    if (value) lines.push(`${text.labels[field]}: ${value}`);
  }
  return lines.join("\n");
}

/** Enlace wa.me con el mensaje armado; mismo número y formato que el resto del sitio (R2). */
export function contactLink(data: ContactData, text: ContactContent["message"]): string {
  return whatsappLink(buildContactMessage(data, text));
}
