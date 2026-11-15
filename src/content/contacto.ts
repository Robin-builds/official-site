/**
 * "CONTACTO" (`/contacto`, `/en/contact`; spec 006).
 *
 * Formulario que arma un mensaje de WhatsApp con los datos del visitante, más un botón directo
 * y un QR como alternativas subordinadas (excepción "Contacto" del Principio II, constitución 3.1.0).
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
export type ContactError = "required" | "email" | "phone";

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
    sent: { text: string; link: string }; // aviso tras el envío + enlace de respaldo (R6)
    noScript: string; // FR-013
  };
  // Texto que viaja en el mensaje de WhatsApp (en el idioma de la página)
  message: { greeting: string; labels: Record<ContactField, string> };
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
      subtitle: "Déjanos tus datos y se arma un mensaje de WhatsApp para StoreFlow. Tú decides si lo envías.",
    },
    form: {
      title: "Envíanos tus datos",
      fields: {
        name: { label: "Nombre" },
        company: { label: "Nombre de tu empresa" },
        phone: { label: "Teléfono", hint: "Opcional" },
        email: { label: "Correo", hint: "Opcional" },
        message: { label: "¿En qué te podemos ayudar?", hint: "Opcional, hasta 500 caracteres" },
      },
      errors: {
        name: { required: "Escribe tu nombre." },
        company: { required: "Escribe el nombre de tu empresa." },
        phone: { phone: "Revisa el teléfono: debe tener entre 8 y 15 números, por ejemplo +56 9 1234 5678." },
        email: { email: "Revisa el correo: debe verse como nombre@empresa.cl." },
        message: {},
      },
      errorSummary: { one: "Revisa 1 campo.", other: "Revisa {n} campos." },
      submit: "Enviar por WhatsApp",
      privacyNote:
        "Tus datos no se guardan en este sitio: solo se agregan al mensaje de WhatsApp, y tú decides si lo envías.",
      sent: { text: "Abrimos WhatsApp en una pestaña nueva. ¿No se abrió?", link: "Abrir WhatsApp" },
      noScript:
        "Para armar el mensaje con tus datos, este formulario necesita JavaScript. Puedes escribirnos directo por WhatsApp.",
    },
    message: {
      greeting: "Hola, quiero saber más de StoreFlow. Mis datos:",
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
      subtitle: "Leave us your details and a WhatsApp message to StoreFlow is put together. You decide whether to send it.",
    },
    form: {
      title: "Send us your details",
      fields: {
        name: { label: "Name" },
        company: { label: "Your company name" },
        phone: { label: "Phone", hint: "Optional" },
        email: { label: "Email", hint: "Optional" },
        message: { label: "How can we help you?", hint: "Optional, up to 500 characters" },
      },
      errors: {
        name: { required: "Enter your name." },
        company: { required: "Enter your company name." },
        phone: { phone: "Check the phone number: it must have 8 to 15 digits, for example +56 9 1234 5678." },
        email: { email: "Check the email: it should look like name@company.com." },
        message: {},
      },
      errorSummary: { one: "Check 1 field.", other: "Check {n} fields." },
      submit: "Send it on WhatsApp",
      privacyNote:
        "Your details aren't stored on this site: they're only added to the WhatsApp message, and you decide whether to send it.",
      sent: { text: "We opened WhatsApp in a new tab. Didn't it open?", link: "Open WhatsApp" },
      noScript:
        "To put the message together with your details, this form needs JavaScript. You can message us directly on WhatsApp.",
    },
    message: {
      greeting: "Hi, I'd like to know more about StoreFlow. My details:",
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
