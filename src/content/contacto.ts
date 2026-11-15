/**
 * "CONTACTO" (`/contacto`, `/en/contact`; spec 006).
 *
 * Formulario que envía los datos del visitante por correo a StoreFlow (ruta /api/contact, vía
 * Resend), más un botón directo a WhatsApp y un QR como alternativas subordinadas (excepciones
 * "Contacto" de los Principios II y IV, constitución 4.0.0).
 *
 * Reglas de la constitución que aplican a este archivo:
 * - Principio I (veracidad) y FR-012: sin tiempos de respuesta, llamadas, demos ni beneficios.
 * - Principio III: todo texto visible, rótulos del mensaje y errores viven aquí, en ambos idiomas.
 * - Principio VII: español de Chile con tuteo; inglés en segunda persona, sin decir más que el
 *   español; sin jerga.
 *
 * QR (research R8): `public/contact/whatsapp-*.svg` codifican `whatsapp[locale].general`.
 * Si cambia el número o el mensaje general, regenerarlos desde la raíz del repo con:
 *   npx --yes qrcode@1.5.4 -t svg -e M -q 4 -o public/contact/whatsapp-es.svg "https://wa.me/56957596588?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20de%20StoreFlow"
 *   npx --yes qrcode@1.5.4 -t svg -e M -q 4 -o public/contact/whatsapp-en.svg "https://wa.me/56957596588?text=Hi%2C%20I'd%20like%20to%20know%20more%20about%20StoreFlow"
 */
import { whatsapp } from "./site";
import type { Cta, Localized } from "./types";

export type ContactField = "name" | "company" | "phone" | "email" | "message";
// "length" solo lo produce el servidor ante un envío que no pasó por el formulario: sin texto propio
// "reach": falta teléfono y correo a la vez (al menos uno es obligatorio)
export type ContactError = "required" | "email" | "phone" | "reach" | "length";

export type ContactContent = {
  header: { title: string; subtitle: string };
  form: {
    title: string;
    fields: Record<ContactField, { label: string; hint?: string }>;
    // Solo los códigos que puede producir cada campo (lib/contact.ts → validateContact)
    errors: Record<ContactField, Partial<Record<ContactError, string>>>;
    // Anuncio en role="status"; "{n}" se reemplaza por la cantidad de campos con error
    errorSummary: { one: string; other: string };
    submit: string;
    privacyNote: string; // FR-005, junto al botón de envío
    sending: string; // texto del botón mientras se envía
    sent: string; // aviso tras un envío exitoso
    // Aviso si el envío falla: texto + enlace a WhatsApp como salida
    failed: { text: string; link: string };
    noScript: string; // FR-013
  };
  // Correo que recibe StoreFlow. La ruta usa siempre el español (lo lee el owner) y agrega el
  // idioma de la página; el inglés existe porque el Principio III exige ambos idiomas.
  message: { subject: string; greeting: string; labels: Record<ContactField, string> };
  alternatives: {
    title: string;
    body: string;
    direct: Cta;
    qr: { src: `/contact/${string}.svg`; alt: string; caption: string };
  };
};

export const contacto: Localized<ContactContent> = {
  es: {
    header: {
      title: "Conversemos",
      subtitle: "Déjanos tus datos y te contactamos. Si prefieres, escríbenos directo por WhatsApp.",
    },
    form: {
      title: "Envíanos tus datos",
      fields: {
        name: { label: "Nombre" },
        company: { label: "Nombre de tu empresa" },
        phone: { label: "Teléfono", hint: "Teléfono o correo: deja al menos uno" },
        email: { label: "Correo", hint: "Teléfono o correo: deja al menos uno" },
        message: { label: "¿En qué te podemos ayudar?", hint: "Opcional, hasta 500 caracteres" },
      },
      errors: {
        name: { required: "Escribe tu nombre." },
        company: { required: "Escribe el nombre de tu empresa." },
        phone: {
          phone: "Revisa el teléfono: debe tener entre 8 y 15 números, por ejemplo +56 9 1234 5678.",
          reach: "Déjanos un teléfono o un correo para poder responderte.",
        },
        email: { email: "Revisa el correo: debe verse como nombre@empresa.cl." },
        message: {},
      },
      errorSummary: { one: "Revisa 1 campo.", other: "Revisa {n} campos." },
      submit: "Enviar",
      privacyNote: "Tus datos nos llegan por correo y solo los usamos para responderte. Este sitio no los guarda.",
      sending: "Enviando…",
      sent: "Listo, recibimos tus datos. Te contactaremos.",
      failed: { text: "No pudimos enviar tus datos. Inténtalo de nuevo o", link: "escríbenos por WhatsApp" },
      noScript: "Para enviar tus datos, este formulario necesita JavaScript. Puedes escribirnos directo por WhatsApp.",
    },
    message: {
      subject: "Nuevo contacto desde el sitio",
      greeting: "Alguien dejó sus datos en la página de Contacto:",
      labels: { name: "Nombre", company: "Empresa", phone: "Teléfono", email: "Correo", message: "Mensaje" },
    },
    alternatives: {
      title: "¿Prefieres escribir directo?",
      body: "Abre el chat de StoreFlow sin llenar nada.",
      direct: { label: "Escribir por WhatsApp", href: whatsapp.es.general },
      qr: {
        src: "/contact/whatsapp-es.svg",
        alt: "Código QR que abre el chat de WhatsApp de StoreFlow",
        caption: "Escanéalo con la cámara de tu celular.",
      },
    },
  },
  en: {
    header: {
      title: "Let's talk",
      subtitle: "Leave us your details and we'll contact you. If you prefer, message us directly on WhatsApp.",
    },
    form: {
      title: "Send us your details",
      fields: {
        name: { label: "Name" },
        company: { label: "Your company name" },
        phone: { label: "Phone", hint: "Phone or email: leave at least one" },
        email: { label: "Email", hint: "Phone or email: leave at least one" },
        message: { label: "How can we help you?", hint: "Optional, up to 500 characters" },
      },
      errors: {
        name: { required: "Enter your name." },
        company: { required: "Enter your company name." },
        phone: {
          phone: "Check the phone number: it must have 8 to 15 digits, for example +56 9 1234 5678.",
          reach: "Leave us a phone number or an email so we can reply to you.",
        },
        email: { email: "Check the email: it should look like name@company.com." },
        message: {},
      },
      errorSummary: { one: "Check 1 field.", other: "Check {n} fields." },
      submit: "Send",
      privacyNote: "Your details reach us by email and we only use them to reply to you. This site doesn't store them.",
      sending: "Sending…",
      sent: "Done, we got your details. We'll contact you.",
      failed: { text: "We couldn't send your details. Try again or", link: "message us on WhatsApp" },
      noScript: "To send your details, this form needs JavaScript. You can message us directly on WhatsApp.",
    },
    message: {
      subject: "New contact from the site",
      greeting: "Someone left their details on the Contact page:",
      labels: { name: "Name", company: "Company", phone: "Phone", email: "Email", message: "Message" },
    },
    alternatives: {
      title: "Prefer to message us directly?",
      body: "Open the StoreFlow chat without filling anything in.",
      direct: { label: "Message us on WhatsApp", href: whatsapp.en.general },
      qr: {
        src: "/contact/whatsapp-en.svg",
        alt: "QR code that opens the StoreFlow WhatsApp chat",
        caption: "Scan it with your phone's camera.",
      },
    },
  },
};
