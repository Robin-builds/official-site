/**
 * Lógica del formulario de Contacto (spec 006), sin React: validación y armado del correo.
 * Funciones puras: las usan el navegador (validar antes de enviar) y la ruta /api/contact
 * (validar de nuevo, porque lo que llega del navegador no es confiable) (research R3, R5).
 */
import type { ContactContent, ContactError, ContactField } from "@/content/contacto";

export type ContactData = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, ContactError>>;

/** Orden de los campos: el del formulario, del mensaje y del foco al primer error. */
export const CONTACT_FIELDS: ContactField[] = ["name", "company", "phone", "email", "message"];

/** Largo máximo por campo: el mismo maxLength del formulario, revisado también en el servidor. */
export const MAX_LENGTH: Record<ContactField, number> = {
  name: 100,
  company: 100,
  phone: 30,
  email: 254,
  message: 500,
};

// Teléfono: solo dígitos, espacios y + - ( ) . (se envía tal como se escribió)
const PHONE_CHARS = /^[0-9+\-(). ]+$/;
// Correo: forma mínima "algo@algo.algo"; la validación estricta no aporta y rechaza correos válidos
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Error de un solo campo (o undefined si está bien). Sirve para revalidar al escribir. */
export function validateField(field: ContactField, raw: string): ContactError | undefined {
  const value = raw.trim();
  // Solo alcanzable si alguien envía sin pasar por el formulario (maxLength ya lo impide)
  if (value.length > MAX_LENGTH[field]) return "length";
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
  // Por correo no llega el número de quien escribe (como sí por WhatsApp): sin teléfono ni
  // correo no hay cómo responder. El error se muestra en el teléfono, primero en el orden.
  if (!data.phone.trim() && !data.email.trim()) errors.phone = "reach";
  return errors;
}

/**
 * Cuerpo del correo: saludo y una línea "Rótulo: valor" por campo, en orden, omitiendo los
 * opcionales vacíos. Texto plano: nada de lo que escribe el visitante se interpreta como HTML.
 */
export function buildContactMessage(data: ContactData, text: ContactContent["message"]): string {
  const lines = [text.greeting, ""];
  for (const field of CONTACT_FIELDS) {
    const value = data[field].trim();
    if (value) lines.push(`${text.labels[field]}: ${value}`);
  }
  return lines.join("\n");
}
