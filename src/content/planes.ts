/**
 * "PLANES" (`/planes`, `/en/plans`; spec 009-planes-pricing).
 *
 * Única fuente de precios, límites, listas y textos de la página (FR-005). Cambiar un monto o un
 * límite se hace aquí y en ningún otro lugar.
 *
 * Reglas de la constitución (5.0.0) que aplican a este archivo:
 * - Principio I (veracidad): montos REFERENCIALES, solo en esta página, con el aviso
 *   `referenceNote`. Toda función que hoy no exista en la app publicada lleva `soon: true`
 *   ("Próximamente"). Nada puede insinuar que hoy se puede pagar o contratar un plan pago.
 *   El plan Free no usa "prueba" ni "trial" (FR-007).
 * - Principio III: cada texto existe en español e inglés; el inglés no dice más que el español.
 * - Principio VII: español de Chile con tuteo; inglés en segunda persona; sin jerga.
 *
 * Solo usa `import type`: así `specs/009-planes-pricing/planes-check.mjs` lo importa con Node
 * sin compilar (research R9).
 *
 * Plantillas: "{plan}", "{n}", "{period}" y "{price}" se reemplazan al mostrar.
 */
import type { Locale, Localized } from "./types";

export type PlanId = "free" | "standard" | "premium";
export type Period = "monthly" | "annual";

/** Ítem de la lista de un plan; `soon` lo marca "Próximamente" (no existe hoy en la app). */
export type PlanItem = { text: string; soon?: true };

export type Plan = {
  id: PlanId;
  name: string; // igual en ambos idiomas
  monthlyPrice: number; // CLP sin IVA; free = 0. PLACEHOLDER: montos a confirmar por el owner
  warehouses: number | "unlimited"; // límite principal, en bodegas (FR-004)
  recommended: boolean; // exactamente uno: standard (FR-003)
  includesFrom: PlanId | null; // la lista abre con "Todo lo de <plan>" (FR-002b)
};

export type PlanText = { tagline: string; items: PlanItem[] };

export type PlansContent = {
  header: { title: string; subtitle: string };
  periods: { legend: string; monthly: string; annual: string; annualSaving: string };
  price: { perMonth: string; perYear: string; tax: string; freeForever: string };
  warehouses: { one: string; upTo: string; unlimited: string };
  includesFrom: string;
  recommended: string;
  soon: string;
  referenceNote: string;
  cta: { free: string; paid: string };
  trial: { title: string; body: string };
  plans: Record<PlanId, PlanText>;
  dialog: {
    title: string;
    summary: string;
    fields: { email: { label: string }; whatsapp: { label: string; hint: string } };
    errors: { email: { required: string; email: string }; whatsapp: { whatsapp: string } };
    // Anuncio en role="status"; "{n}" = cantidad de campos con error
    errorSummary: { one: string; other: string };
    submit: string;
    sending: string;
    close: string;
    sent: { title: string; body: string };
    failed: { text: string; link: string };
    privacyNote: { text: string; link: string };
  };
  // Mensaje de WhatsApp de los botones pagos sin JavaScript (research R5)
  noScriptWhatsapp: string;
  // Correo al owner: la ruta usa siempre el español (lo lee el owner); el inglés existe por el
  // Principio III.
  email: {
    subjectPrefix: string;
    labels: Record<"plan" | "period" | "price" | "email" | "whatsapp" | "date" | "locale" | "origin", string>;
    localeNames: Record<Locale, string>;
  };
};

/** Los 3 planes, en el orden en que se muestran (FR-001). */
export const plans: Plan[] = [
  { id: "free", name: "Free", monthlyPrice: 0, warehouses: 1, recommended: false, includesFrom: null },
  { id: "standard", name: "Standard", monthlyPrice: 9990, warehouses: 3, recommended: true, includesFrom: "free" },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: 19990,
    warehouses: "unlimited",
    recommended: false,
    includesFrom: "standard",
  },
];

export const planes: Localized<PlansContent> = {
  es: {
    header: {
      title: "Planes y precios",
      subtitle: "Empieza gratis, para siempre. Cuando tu negocio crezca, elige el plan que te sirva.",
    },
    periods: { legend: "Periodicidad", monthly: "Mensual", annual: "Anual", annualSaving: "2 meses gratis" },
    price: { perMonth: "/mes", perYear: "/año", tax: "+ IVA", freeForever: "Gratis para siempre" },
    warehouses: { one: "{n} bodega", upTo: "Hasta {n} bodegas", unlimited: "Bodegas ilimitadas" },
    includesFrom: "Todo lo de {plan}",
    recommended: "Recomendado",
    soon: "Próximamente",
    referenceNote: "Precios referenciales, pueden cambiar.",
    cta: { free: "Empezar gratis", paid: "Quiero el plan {plan}" },
    trial: {
      title: "Prueba los planes pagados por 14 días",
      body: "Usa las funciones de un plan pagado durante 14 días, sin tarjeta. Al terminar pasas al plan Free sin perder tus datos.",
    },
    plans: {
      free: {
        tagline: "Para dejar el cuaderno y el Excel en una sola bodega.",
        items: [
          { text: "1 usuario" },
          { text: "Productos" },
          { text: "Movimientos: entradas, salidas y ajustes" },
          { text: "Alertas de stock mínimo" },
          { text: "Funciona sin internet" },
        ],
      },
      standard: {
        tagline: "Para negocios con equipo y más de un local o bodega.",
        items: [
          { text: "Usuarios con roles (Administrador y Operador)" },
          { text: "Panel web" },
          { text: "Reportes y exportar a Excel" },
        ],
      },
      premium: {
        tagline: "Para operaciones grandes y contadores que llevan varios negocios.",
        items: [{ text: "Varias empresas en una cuenta", soon: true }, { text: "Atención prioritaria" }],
      },
    },
    dialog: {
      title: "Quiero el plan {plan}",
      summary: "{plan} · {period} · {price}",
      fields: {
        email: { label: "Correo" },
        whatsapp: { label: "WhatsApp (opcional)", hint: "Celular, por ejemplo +56 9 1234 5678" },
      },
      errors: {
        email: { required: "Escribe tu correo.", email: "Revisa el correo: debe verse como nombre@empresa.cl." },
        whatsapp: { whatsapp: "Revisa el WhatsApp: debe ser un celular chileno, por ejemplo +56 9 1234 5678." },
      },
      errorSummary: { one: "Revisa 1 campo.", other: "Revisa {n} campos." },
      submit: "Enviar",
      sending: "Enviando…",
      close: "Cerrar",
      sent: { title: "Recibimos tu interés en {plan}", body: "Te contactamos para contarte cómo empezar." },
      failed: { text: "No pudimos enviar tus datos. Inténtalo de nuevo o", link: "escríbenos desde Contacto" },
      privacyNote: {
        text: "Usamos tu correo y tu WhatsApp solo para contactarte sobre este plan.",
        link: "Política de privacidad",
      },
    },
    noScriptWhatsapp: "Hola, quiero el plan {plan} ({period})",
    email: {
      subjectPrefix: "Planes",
      labels: {
        plan: "Plan",
        period: "Periodicidad",
        price: "Precio mostrado",
        email: "Correo",
        whatsapp: "WhatsApp",
        date: "Fecha y hora",
        locale: "Idioma de la página",
        origin: "Origen",
      },
      localeNames: { es: "español", en: "inglés" },
    },
  },
  en: {
    header: {
      title: "Plans and pricing",
      subtitle: "Start free, forever. When your business grows, choose the plan that fits.",
    },
    periods: { legend: "Billing period", monthly: "Monthly", annual: "Yearly", annualSaving: "2 months free" },
    price: { perMonth: "/month", perYear: "/year", tax: "+ VAT", freeForever: "Free forever" },
    warehouses: { one: "{n} warehouse", upTo: "Up to {n} warehouses", unlimited: "Unlimited warehouses" },
    includesFrom: "Everything in {plan}",
    recommended: "Recommended",
    soon: "Coming soon",
    referenceNote: "Reference prices, subject to change.",
    cta: { free: "Start free", paid: "I want the {plan} plan" },
    trial: {
      title: "Try the paid plans for 14 days",
      body: "Use the features of a paid plan for 14 days, no card needed. When it ends you move to the Free plan without losing your data.",
    },
    plans: {
      free: {
        tagline: "To leave the notebook and the spreadsheet behind in one warehouse.",
        items: [
          { text: "1 user" },
          { text: "Products" },
          { text: "Movements: stock in, stock out and adjustments" },
          { text: "Minimum stock alerts" },
          { text: "Works without internet" },
        ],
      },
      standard: {
        tagline: "For businesses with a team and more than one store or warehouse.",
        items: [
          { text: "Users with roles (Administrator and Operator)" },
          { text: "Web panel" },
          { text: "Reports and export to Excel" },
        ],
      },
      premium: {
        tagline: "For large operations and accountants who handle several businesses.",
        items: [{ text: "Several companies in one account", soon: true }, { text: "Priority support" }],
      },
    },
    dialog: {
      title: "I want the {plan} plan",
      summary: "{plan} · {period} · {price}",
      fields: {
        email: { label: "Email" },
        whatsapp: { label: "WhatsApp (optional)", hint: "Chilean mobile, for example +56 9 1234 5678" },
      },
      errors: {
        email: { required: "Enter your email.", email: "Check your email: it should look like name@company.com." },
        whatsapp: { whatsapp: "Check your WhatsApp: it must be a Chilean mobile, for example +56 9 1234 5678." },
      },
      errorSummary: { one: "Check 1 field.", other: "Check {n} fields." },
      submit: "Send",
      sending: "Sending…",
      close: "Close",
      sent: { title: "We got your interest in {plan}", body: "We'll contact you to tell you how to get started." },
      failed: { text: "We couldn't send your details. Try again or", link: "write to us from Contact" },
      privacyNote: {
        text: "We only use your email and WhatsApp to contact you about this plan.",
        link: "Privacy policy",
      },
    },
    noScriptWhatsapp: "Hi, I want the {plan} plan ({period})",
    email: {
      subjectPrefix: "Plans",
      labels: {
        plan: "Plan",
        period: "Billing period",
        price: "Price shown",
        email: "Email",
        whatsapp: "WhatsApp",
        date: "Date and time",
        locale: "Page language",
        origin: "Source",
      },
      localeNames: { es: "Spanish", en: "English" },
    },
  },
};
