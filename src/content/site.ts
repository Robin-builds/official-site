/**
 * CONTENIDO COMÚN DEL SITIO: URLs, idiomas, registro de páginas y textos de marca, menú,
 * pie, accesibilidad y 404. Lo leen todas las páginas en ambos idiomas.
 *
 * Reglas de la constitución que aplican a este archivo:
 * - Principio I (veracidad): solo funcionalidades que existen hoy en la app publicada.
 * - Principio II: todas las URLs de destino viven en URLS; ningún componente tiene URLs.
 * - Principio III: cada texto existe en español e inglés (`Localized<T>`).
 * - Principio VII: español de Chile con tuteo; inglés claro en segunda persona; sin jerga.
 */
import type { Cta, Locale, Localized, Page } from "./types";
import { readyGuides } from "./guias";

/* ------------------------------------------------------------------ */
/* URLs: cambiar aquí actualiza todos los botones y enlaces            */
/* ------------------------------------------------------------------ */

// PLACEHOLDER: número de WhatsApp real en formato internacional, sin "+" ni espacios.
const WHATSAPP_NUMBER = "56900000000";

// wa.me abre WhatsApp (app o web) con el mensaje ya escrito; el texto debe ir codificado.
const whatsappLink = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const URLS = {
  // PLACEHOLDER: confirmar en el primer despliegue (research R14).
  site: "https://storeflow-official-site.vercel.app",
  // Hoy apunta a la prueba cerrada; cambiar a la ficha de producción cuando esté publicada.
  googlePlay: "https://play.google.com/apps/testing/cl.storeflow.app",
  whatsappNumber: WHATSAPP_NUMBER,
  // Mensajes precargados en el idioma de la página (research R20, FR-030)
  whatsappGeneral: whatsappLink("Hola, quiero saber más de StoreFlow"),
  whatsappGeneralEn: whatsappLink("Hi, I'd like to know more about StoreFlow"),
  whatsappPartner: whatsappLink("Hola, quiero ser partner de StoreFlow"),
  whatsappPartnerEn: whatsappLink("Hi, I'd like to become a StoreFlow partner"),
  // PLACEHOLDER: URL real de la política de privacidad.
  privacyPolicy: "https://chileapps.cl/privacidad",
  chileapps: "https://chileapps.cl",
  // Inicio de sesión de la versión web (panel web) para usuarios existentes
  webAppLogin: "https://stockflow-web-eight.vercel.app/login",
} as const;

/** Qué enlace de WhatsApp usa cada idioma. */
export const whatsapp: Localized<{ general: string; partner: string }> = {
  es: { general: URLS.whatsappGeneral, partner: URLS.whatsappPartner },
  en: { general: URLS.whatsappGeneralEn, partner: URLS.whatsappPartnerEn },
};

/* ------------------------------------------------------------------ */
/* Idiomas                                                             */
/* ------------------------------------------------------------------ */

/**
 * Interruptor del inglés (research R18, FR-031). Con `en.published = false`:
 * sin selector ES/EN, sin hreflang ni sitemap en inglés, y el layout `(en)` responde
 * "no encontrada" en toda dirección `/en/...`. Solo pasa a `true` tras la revisión del owner.
 */
export const languages: Record<Locale, { published: boolean }> = {
  es: { published: true },
  en: { published: false },
};

/* ------------------------------------------------------------------ */
/* Registro de páginas: alimenta menú, pie, selector, sitemap y head   */
/* ------------------------------------------------------------------ */

export const pages: Page[] = [
  {
    key: "home",
    inNav: false, // se llega por la marca
    published: true,
    locales: {
      es: {
        href: "/",
        navLabel: "Inicio",
        title: "Control de inventario desde el celular para pymes",
        description:
          "Controla el stock de todas tus bodegas desde el celular, aunque no tengas internet. Cada entrada y salida queda registrada con su fecha. Pruébala gratis en Android.",
      },
      en: {
        href: "/en",
        navLabel: "Home",
        title: "Inventory control from your phone for small businesses",
        description:
          "Track stock across all your warehouses from your phone, even without internet. Every stock in and stock out is recorded with its date. Try it free on Android.",
      },
    },
  },
  {
    key: "features",
    inNav: true,
    published: true,
    locales: {
      es: {
        href: "/funcionalidades",
        navLabel: "Funcionalidades",
        title: "Funcionalidades",
        description:
          "Todo lo que hace StoreFlow: escaneo, entradas y salidas, lotes y vencimientos, bodegas, alertas de stock, roles, historial, panel web y más.",
      },
      en: {
        href: "/en/features",
        navLabel: "Features",
        title: "Features",
        description:
          "Everything StoreFlow does: scanning, stock in and out, batches and expiry dates, warehouses, stock alerts, roles, history, web panel and more.",
      },
    },
  },
  {
    key: "business",
    inNav: true,
    published: true,
    locales: {
      es: {
        href: "/para-tu-negocio",
        navLabel: "Para tu negocio",
        title: "Para tu negocio",
        description:
          "Cómo StoreFlow ayuda a minimarkets, ferreterías, distribuidoras y bodegas a saber qué stock tienen y dónde.",
      },
      en: {
        href: "/en/for-your-business",
        navLabel: "For your business",
        title: "For your business",
        description:
          "How StoreFlow helps convenience stores, hardware stores, distributors and warehouses know what stock they have and where.",
      },
    },
  },
  {
    key: "faq",
    inNav: true,
    published: true,
    locales: {
      es: {
        href: "/preguntas-frecuentes",
        navLabel: "Preguntas frecuentes",
        title: "Preguntas frecuentes",
        description:
          "Respuestas sobre StoreFlow: uso sin internet, precio, dónde quedan tus datos, compatibilidad e idioma de la app.",
      },
      en: {
        href: "/en/faq",
        navLabel: "FAQ",
        title: "Frequently asked questions",
        description:
          "Answers about StoreFlow: using it without internet, pricing, where your data is kept, compatibility and app language.",
      },
    },
  },
  {
    key: "help",
    inNav: true,
    // Ayuda existe solo si hay al menos una guía lista (FR-014)
    published: readyGuides().length > 0,
    locales: {
      es: {
        href: "/ayuda",
        navLabel: "Ayuda",
        title: "Ayuda",
        description: "Guías paso a paso para empezar con StoreFlow y sacarle provecho en tu bodega.",
      },
      en: {
        href: "/en/help",
        navLabel: "Help",
        title: "Help",
        description: "Step-by-step guides to get started with StoreFlow and make the most of it in your warehouse.",
      },
    },
  },
  {
    key: "download",
    inNav: false, // la CTA del encabezado va directo a Google Play (SC-001)
    published: true,
    locales: {
      es: {
        href: "/descargar",
        navLabel: "Descargar",
        title: "Descargar",
        description: "Descarga StoreFlow gratis en Google Play. Solo necesitas un celular Android.",
      },
      en: {
        href: "/en/download",
        navLabel: "Download",
        title: "Download",
        description: "Download StoreFlow for free on Google Play. All you need is an Android phone.",
      },
    },
  },
  {
    key: "partner",
    inNav: false, // solo en el pie (FR-010)
    published: true,
    locales: {
      es: {
        href: "/se-partner",
        navLabel: "Sé partner",
        title: "Sé partner",
        description:
          "¿Eres contador o asesoras pymes? Recomienda StoreFlow a tus clientes y conversemos por WhatsApp.",
      },
      en: {
        href: "/en/partner",
        navLabel: "Become a partner",
        title: "Become a partner",
        description:
          "Are you an accountant or do you advise small businesses? Recommend StoreFlow to your clients and let's talk on WhatsApp.",
      },
    },
  },
  {
    key: "privacy",
    inNav: false,
    // La publicación real depende del texto de cada idioma (privacidad.ts, research R11)
    published: true,
    locales: {
      es: {
        href: "/privacidad",
        navLabel: "Privacidad",
        title: "Política de privacidad",
        description: "Política de privacidad de StoreFlow.",
      },
      en: {
        href: "/en/privacy",
        navLabel: "Privacy",
        title: "Privacy policy",
        description: "StoreFlow privacy policy.",
      },
    },
  },
];

/* ------------------------------------------------------------------ */
/* Textos comunes por idioma                                           */
/* ------------------------------------------------------------------ */

// Wordmark igual al de la app: "STORE" en cian y "FLOW" en naranja; igual en ambos idiomas.
const brand = { wordmark: { first: "STORE", second: "FLOW", accessibleName: "StoreFlow" } };

const ctaPrincipalEs: Cta = { label: "Pruébala gratis", href: URLS.googlePlay };
const ctaPrincipalEn: Cta = { label: "Try it free", href: URLS.googlePlay };

const uiEs = {
  brand,
  ctaPrincipal: ctaPrincipalEs,
  // Ancla del enlace "Saltar al contenido" (contracts/routes.md)
  contentId: "contenido",
  // Pie de la imagen para compartir de cada página
  ogNote: "Gratis para empezar · App para Android",
  // Textos de apoyo para accesibilidad (no visibles, pero también son copy)
  a11y: {
    newTab: "(se abre en una pestaña nueva)",
    step: "Paso",
    home: "StoreFlow, ir al inicio",
    skip: "Saltar al contenido",
    themeToggle: "Modo oscuro",
    mainNav: "Navegación principal",
    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
  },
  nav: {
    cta: ctaPrincipalEs,
    // Acceso utilitario para usuarios existentes: no es conversión (Principio II)
    login: { label: "Ingresar", href: URLS.webAppLogin } satisfies Cta,
  },
  footer: {
    navLabel: "Enlaces de StoreFlow",
    tagline: "Control de inventario para pymes chilenas.",
    byline: "StoreFlow by chileapps.cl",
    pagesTitle: "Sitio",
    moreTitle: "Contacto y cuenta",
    contactLabel: "Contacto por WhatsApp",
    privacyLabel: "Política de privacidad",
    loginLabel: "Ingresar a la versión web",
    themeLabel: "Tema",
  },
  notFound: {
    metaTitle: "Página no encontrada",
    title: "No encontramos esta página",
    body: "Puede que la dirección esté mal escrita o que la página ya no exista.",
    home: "Ir al inicio",
    download: "Descargar StoreFlow",
  },
  languageSwitch: {
    label: "Idioma",
    es: { short: "ES", name: "Español" },
    en: { short: "EN", name: "English" },
  },
  // Etiquetas reutilizadas en varias páginas
  common: {
    seeGuide: "Ver la guía",
    seeFeature: "Ver la funcionalidad",
    adminOnly: "Solo Administrador",
    benefitLabel: "Para qué te sirve",
    onThisPage: "En esta página",
  },
};

export const ui: Localized<typeof uiEs> = {
  es: uiEs,
  en: {
    brand,
    ctaPrincipal: ctaPrincipalEn,
    contentId: "content",
    ogNote: "Free to start · Android app",
    a11y: {
      newTab: "(opens in a new tab)",
      step: "Step",
      home: "StoreFlow, go to home page",
      skip: "Skip to content",
      themeToggle: "Dark mode",
      mainNav: "Main navigation",
      menuOpen: "Open menu",
      menuClose: "Close menu",
    },
    nav: {
      cta: ctaPrincipalEn,
      login: { label: "Log in", href: URLS.webAppLogin },
    },
    footer: {
      navLabel: "StoreFlow links",
      tagline: "Inventory control for small businesses.",
      byline: "StoreFlow by chileapps.cl",
      pagesTitle: "Site",
      moreTitle: "Contact and account",
      contactLabel: "Contact us on WhatsApp",
      privacyLabel: "Privacy policy",
      loginLabel: "Log in to the web version",
      themeLabel: "Theme",
    },
    notFound: {
      metaTitle: "Page not found",
      title: "We couldn't find this page",
      body: "The address may be mistyped, or the page may no longer exist.",
      home: "Go to home page",
      download: "Download StoreFlow",
    },
    languageSwitch: {
      label: "Language",
      es: { short: "ES", name: "Español" },
      en: { short: "EN", name: "English" },
    },
    common: {
      seeGuide: "See the guide",
      seeFeature: "See the feature",
      adminOnly: "Administrator only",
      benefitLabel: "How it helps you",
      onThisPage: "On this page",
    },
  },
};
