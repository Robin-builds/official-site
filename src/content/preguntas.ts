/**
 * PREGUNTAS FRECUENTES (`/preguntas-frecuentes`, `/en/faq`; FR-011).
 *
 * Todas las preguntas de la landing, agrupadas por tema, más la del idioma de la app
 * (research R19), que existe en ambos idiomas para que el inglés no afirme más que el español.
 * - "Varias bodegas y usuarios" reescrita con los roles de la guía, sin "quién lo hizo" (R8).
 * - Precio: gratis para empezar + planes pagados, sin montos ni nombres de planes.
 * - Lo que la app no hace (iPhone, boletas/facturas) se responde con honestidad (Principio I).
 */
import { ui } from "./site";
import type { Cta, FaqGroup, Localized } from "./types";

const es = {
  intro: {
    title: "Preguntas frecuentes",
    subtitle: "Lo que más nos preguntan sobre StoreFlow. Toca una pregunta para ver la respuesta.",
  },
  groups: [
    {
      id: "uso",
      title: "Uso de la app",
      items: [
        {
          question: "¿Funciona sin internet?",
          answer:
            "Sí. Puedes registrar entradas y salidas sin conexión. Todo queda guardado en el celular y se respalda solo cuando vuelve internet.",
        },
        {
          question: "¿Necesito un lector de códigos de barras?",
          answer:
            "No. Usas la cámara del celular, que lee códigos de barras y QR. Incluye linterna para bodegas con poca luz.",
        },
        {
          question: "¿Puedo tener varias bodegas y usuarios?",
          answer:
            "Sí. Tu empresa puede tener varias bodegas, cada una con su propio stock, y varios usuarios con rol Administrador u Operador. El Operador ve el stock y registra entradas y salidas; el Administrador además gestiona productos, bodegas y usuarios.",
          guide: "bodegas",
        },
      ],
    },
    {
      id: "precio",
      title: "Precio",
      items: [
        {
          question: "¿Cuánto cuesta?",
          answer: "Puedes empezar gratis. También hay planes pagados para negocios con más necesidades.",
        },
      ],
    },
    {
      id: "datos",
      title: "Datos y seguridad",
      items: [
        {
          question: "¿Dónde quedan mis datos?",
          answer:
            "Se guardan en tu celular y, cuando hay conexión, se respaldan en servidores seguros. Los datos de tu empresa están separados de los de cualquier otra y solo los ven los usuarios que tú invitas.",
        },
      ],
    },
    {
      id: "compatibilidad",
      title: "Compatibilidad",
      items: [
        {
          question: "¿Sirve en iPhone?",
          answer: "Hoy no. StoreFlow está disponible solo para celulares Android, en Google Play.",
        },
        {
          question: "¿La app está en inglés?",
          answer: "Sí. StoreFlow está en español y en inglés, y se muestra según el idioma de tu celular.",
        },
        {
          question: "¿Emite boletas o facturas?",
          answer: "No. StoreFlow es para controlar tu inventario y hoy no emite boletas ni facturas.",
        },
      ],
    },
  ] as FaqGroup[],
  finalCta: {
    title: "¿Listo para probarla?",
    subtitle: "Descarga StoreFlow en tu celular Android. Es gratis para empezar.",
    cta: ui.es.ctaPrincipal as Cta,
    note: "Disponible en Google Play",
  },
};

export type PreguntasContent = typeof es;

export const preguntas: Localized<PreguntasContent> = {
  es,
  en: {
    intro: {
      title: "Frequently asked questions",
      subtitle: "What people ask us most about StoreFlow. Tap a question to see the answer.",
    },
    groups: [
      {
        id: "using-the-app",
        title: "Using the app",
        items: [
          {
            question: "Does it work without internet?",
            answer:
              "Yes. You can record stock ins and outs without a connection. Everything is saved on the phone and backed up automatically when the internet comes back.",
          },
          {
            question: "Do I need a barcode scanner?",
            answer:
              "No. You use your phone camera, which reads barcodes and QR codes. It includes a flashlight for dimly lit warehouses.",
          },
          {
            question: "Can I have multiple warehouses and users?",
            answer:
              "Yes. Your company can have several warehouses, each with its own stock, and several users with the Administrator or Operator role. The Operator sees stock and records stock ins and outs; the Administrator also manages products, warehouses and users.",
            guide: "bodegas",
          },
        ],
      },
      {
        id: "pricing",
        title: "Pricing",
        items: [
          {
            question: "How much does it cost?",
            answer: "You can start for free. There are also paid plans for businesses with more needs.",
          },
        ],
      },
      {
        id: "data-and-security",
        title: "Data and security",
        items: [
          {
            question: "Where is my data kept?",
            answer:
              "It's saved on your phone and, when there's a connection, backed up on secure servers. Your company's data is kept separate from every other company's, and only the users you invite can see it.",
          },
        ],
      },
      {
        id: "compatibility",
        title: "Compatibility",
        items: [
          {
            question: "Does it work on iPhone?",
            answer: "Not yet. StoreFlow is only available for Android phones, on Google Play.",
          },
          {
            question: "Is the app available in English?",
            answer:
              "Yes. StoreFlow is available in Spanish and English, and it shows in the language your phone is set to. The screenshots on this site show the Spanish version.",
          },
          {
            question: "Does it issue receipts or invoices?",
            answer: "No. StoreFlow is for managing your inventory and doesn't issue receipts or invoices.",
          },
        ],
      },
    ],
    finalCta: {
      title: "Ready to try it?",
      subtitle: "Download StoreFlow on your Android phone. It's free to start.",
      cta: ui.en.ctaPrincipal,
      note: "Available on Google Play",
    },
  },
};
