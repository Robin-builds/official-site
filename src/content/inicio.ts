/**
 * CONTENIDO DE INICIO (`/` y `/en`).
 *
 * Correcciones de veracidad aplicadas al copy heredado de la landing (research R8):
 * nada dice que la app muestra quién hizo cada movimiento; los movimientos quedan "con su fecha".
 * Casos de uso, contadores y FAQ salieron de Inicio a sus páginas (research R15).
 */
import { capturas } from "./capturas";
import { URLS, ui } from "./site";
import type { Cta, HeroScreens, Item, Localized, PageKey, Testimonio } from "./types";

type Shortcut = { key: PageKey; title: string; description: string };

/** Pantallas del recorrido del hero: capturas reales + leyenda (spec 003). */
function heroScreens(locale: "es" | "en", captions: [string, string, string, string, string, string]): HeroScreens {
  const c = capturas[locale];
  return [
    { ...c.inicio, caption: captions[0] },
    { ...c.bodega, caption: captions[1] },
    { ...c.escanear, caption: captions[2] },
    { ...c.movimiento, caption: captions[3] },
    { ...c.alertaStock, caption: captions[4] },
    { ...c.historial, caption: captions[5] },
  ];
}

const es = {
  meta: {
    ogImageAlt: "StoreFlow: controla tu stock desde el celular, aunque no haya internet",
  },

  hero: {
    id: "inicio", // ancla heredada de la landing (FR-005)
    eyebrow: "Control de inventario para pymes",
    title: "Controla tu stock desde el celular, aunque no haya internet",
    subtitle:
      "Registra cada entrada y salida y StoreFlow calcula el stock solo. Sabes qué tienes y en qué bodega.",
    primary: ui.es.ctaPrincipal as Cta,
    secondary: { label: "Ver cómo funciona", href: "#como-funciona" } as Cta,
    note: "Gratis para empezar · App para Android",
    loginLine: { text: "¿Ya usas StoreFlow?", link: "Ingresa a la versión web", href: URLS.webAppLogin },
    // La primera pantalla es la imagen principal del hero (LCP) y la única visible sin JS
    screens: heroScreens("es", [
      "Ve tu bodega de un vistazo",
      "Crea tus bodegas",
      "Escanea tus productos",
      "Registra entradas y salidas",
      "Revisa qué está por acabarse",
      "Cada movimiento queda registrado",
    ]),
    // Textos del recorrido. {n}, {total} y {caption} se reemplazan al mostrar.
    carousel: {
      regionLabel: "Recorrido por las pantallas de StoreFlow",
      roleDescription: "carrusel",
      slideRoleDescription: "pantalla",
      slideLabel: "{n} de {total}",
      goTo: "Mostrar pantalla {n} de {total}: {caption}",
      announce: "Pantalla {n} de {total}: {caption}",
      pause: "Pausar recorrido",
      play: "Reanudar recorrido",
    },
    // Se muestra en el mockup mientras no exista la captura real en /public/screens/
    screenshotPending: "Captura pendiente",
  },

  // Hechos verificables del producto; nunca métricas de tracción (Principio I)
  credibility: {
    title: "Lo que puedes esperar de StoreFlow",
    items: [
      { icon: "offline", title: "Funciona sin internet", description: "Registra en la bodega aunque no haya señal." },
      {
        icon: "history",
        title: "Historial que no se puede editar",
        description: "Cada movimiento queda con su fecha y no se edita ni se borra.",
      },
      { icon: "flag", title: "Hecho en Chile", description: "Desarrollado por chileapps.cl." },
      {
        icon: "shield",
        title: "Datos aislados por empresa",
        description: "Tu información no se mezcla con la de otros negocios.",
      },
    ] as Item[],
  },

  problems: {
    title: "¿Te suena conocido?",
    intro: "Lo que pasa en muchas bodegas cuando el stock se lleva de memoria.",
    items: [
      {
        icon: "notebook",
        title: "No sabes cuánto tienes de verdad",
        description: "Planillas desactualizadas, un cuaderno y el clásico «creo que quedan».",
      },
      {
        icon: "alert",
        title: "Te enteras del quiebre cuando el cliente pide",
        description: "Recién cuando alguien pregunta por un producto descubres que se acabó.",
      },
      {
        icon: "calendar",
        title: "Productos que se vencen en la bodega",
        description: "Lo que llegó primero queda al fondo y se pierde antes de venderse.",
      },
    ] as Item[],
  },

  benefits: {
    title: "Lo que cambia con StoreFlow",
    intro: "Menos adivinar, más certeza sobre lo que tienes.",
    items: [
      {
        icon: "warehouse",
        title: "Sabes qué tienes y dónde",
        description: "Stock por producto y por bodega, al día, en tu celular.",
      },
      {
        icon: "alert",
        title: "No te quedas sin stock",
        description: "Ves de inmediato qué productos están bajo su mínimo, antes de que el cliente los pida.",
      },
      {
        icon: "calendar",
        title: "Pierdes menos por vencimiento",
        description: "Registra lotes y fechas de vencimiento, y saca primero lo que vence primero.",
      },
    ] as Item[],
  },

  howItWorks: {
    id: "como-funciona", // ancla heredada de la landing (FR-005)
    title: "Cómo funciona",
    intro: "Tres pasos y tu inventario queda al día.",
    steps: [
      {
        icon: "warehouse",
        title: "Crea tu bodega",
        description:
          "Descarga la app, crea tu empresa y agrega una o varias bodegas. Si trabajas con más personas, invítalas.",
      },
      {
        icon: "scan",
        title: "Carga tus productos escaneando",
        description:
          "La cámara del celular lee códigos de barras y QR. Con la linterna funciona incluso con poca luz.",
      },
      {
        icon: "history",
        title: "Registra entradas y salidas",
        description: "Cada vez que llega o sale mercadería, lo anotas en segundos. El stock se actualiza solo.",
      },
    ] as Item[],
    more: { label: "Ver todas las funcionalidades", page: "features" as PageKey },
  },

  // Accesos a las páginas internas (Sé partner queda fuera: solo pie, FR-010)
  shortcuts: {
    title: "Conoce más de StoreFlow",
    items: [
      { key: "features", title: "Funcionalidades", description: "Todo lo que hace la app, agrupado por tema." },
      { key: "business", title: "Para tu negocio", description: "Minimarket, ferretería, distribuidora o bodega." },
      { key: "help", title: "Ayuda", description: "Guías paso a paso para empezar." },
      { key: "faq", title: "Preguntas frecuentes", description: "Precio, datos, compatibilidad y más." },
    ] as Shortcut[],
  },

  // Nota sobre el idioma de la app y las capturas: solo hace falta en inglés (research R19)
  appLanguageNote: "",

  // Principio I: vacío hasta tener testimonios reales; vacío = sección oculta (FR-013).
  testimonials: {
    title: "Lo que dicen quienes ya lo usan",
    items: [] as Testimonio[],
  },

  finalCta: {
    title: "Empieza hoy a saber cuánto stock tienes",
    subtitle: "Descarga StoreFlow en tu celular Android y crea tu primera bodega hoy mismo.",
    cta: ui.es.ctaPrincipal as Cta,
    note: "Gratis para empezar · Disponible en Google Play",
  },
};

export type InicioContent = typeof es;

export const inicio: Localized<InicioContent> = {
  es,
  en: {
    meta: {
      ogImageAlt: "StoreFlow: track your stock from your phone, even without internet",
    },
    hero: {
      id: "home",
      eyebrow: "Inventory control for small businesses",
      title: "Track your stock from your phone, even without internet",
      subtitle:
        "Record every stock in and stock out, and StoreFlow calculates your stock for you. You know what you have and in which warehouse.",
      primary: ui.en.ctaPrincipal,
      secondary: { label: "See how it works", href: "#how-it-works" },
      note: "Free to start · Android app",
      loginLine: { text: "Already using StoreFlow?", link: "Log in to the web version", href: URLS.webAppLogin },
      screens: heroScreens("en", [
        "See your warehouse at a glance",
        "Create your warehouses",
        "Scan your products",
        "Record stock in and out",
        "See what's running low",
        "Every movement is recorded",
      ]),
      carousel: {
        regionLabel: "Tour of StoreFlow screens",
        roleDescription: "carousel",
        slideRoleDescription: "screen",
        slideLabel: "{n} of {total}",
        goTo: "Show screen {n} of {total}: {caption}",
        announce: "Screen {n} of {total}: {caption}",
        pause: "Pause tour",
        play: "Resume tour",
      },
      screenshotPending: "Screenshot pending",
    },
    credibility: {
      title: "What you can expect from StoreFlow",
      items: [
        { icon: "offline", title: "Works without internet", description: "Record in the warehouse even with no signal." },
        {
          icon: "history",
          title: "History that can't be edited",
          description: "Every movement is saved with its date and can't be edited or deleted.",
        },
        { icon: "flag", title: "Made in Chile", description: "Built by chileapps.cl." },
        {
          icon: "shield",
          title: "Data kept separate per company",
          description: "Your information never mixes with other businesses' data.",
        },
      ],
    },
    problems: {
      title: "Sound familiar?",
      intro: "What happens in many warehouses when stock is tracked from memory.",
      items: [
        {
          icon: "notebook",
          title: "You don't really know how much you have",
          description: "Outdated spreadsheets, a notebook and the classic “I think there's some left”.",
        },
        {
          icon: "alert",
          title: "You find out you're out of stock when a customer asks",
          description: "Only when someone asks for a product do you discover it's gone.",
        },
        {
          icon: "calendar",
          title: "Products that expire in the warehouse",
          description: "What arrived first ends up at the back and spoils before it's sold.",
        },
      ],
    },
    benefits: {
      title: "What changes with StoreFlow",
      intro: "Less guessing, more certainty about what you have.",
      items: [
        {
          icon: "warehouse",
          title: "You know what you have and where",
          description: "Stock by product and by warehouse, up to date, on your phone.",
        },
        {
          icon: "alert",
          title: "You don't run out of stock",
          description: "See right away which products are below their minimum, before a customer asks for them.",
        },
        {
          icon: "calendar",
          title: "You lose less to expiry",
          description: "Record batches and expiry dates, and sell first what expires first.",
        },
      ],
    },
    howItWorks: {
      id: "how-it-works",
      title: "How it works",
      intro: "Three steps and your inventory is up to date.",
      steps: [
        {
          icon: "warehouse",
          title: "Create your warehouse",
          description:
            "Download the app, create your company and add one or more warehouses. If you work with other people, invite them.",
        },
        {
          icon: "scan",
          title: "Add your products by scanning",
          description: "Your phone camera reads barcodes and QR codes. With the flashlight it works even in low light.",
        },
        {
          icon: "history",
          title: "Record stock in and out",
          description: "Every time goods arrive or leave, you log it in seconds. Stock updates on its own.",
        },
      ],
      more: { label: "See all features", page: "features" },
    },
    shortcuts: {
      title: "Learn more about StoreFlow",
      items: [
        { key: "features", title: "Features", description: "Everything the app does, grouped by topic." },
        {
          key: "business",
          title: "For your business",
          description: "Convenience store, hardware store, distributor or warehouse.",
        },
        { key: "help", title: "Help", description: "Step-by-step guides to get started." },
        { key: "faq", title: "FAQ", description: "Pricing, data, compatibility and more." },
      ],
    },
    appLanguageNote:
      "StoreFlow shows in English when your phone is set to English. The screenshots on this site show the Spanish version.",
    testimonials: {
      title: "What people who use it say",
      items: [],
    },
    finalCta: {
      title: "Start knowing how much stock you have today",
      subtitle: "Download StoreFlow on your Android phone and create your first warehouse today.",
      cta: ui.en.ctaPrincipal,
      note: "Free to start · Available on Google Play",
    },
  },
};
