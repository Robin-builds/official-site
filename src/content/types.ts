/**
 * Tipos compartidos del contenido del sitio (contrato: specs/005-official-site/contracts/content.md).
 *
 * Todo texto visible es `Localized<T>`: TypeScript exige las dos claves, así una traducción
 * faltante rompe `next build` (constitución III).
 */

export type Locale = "es" | "en";
/** Mismo contenido en ambos idiomas; TypeScript exige las dos claves. */
export type Localized<T> = Record<Locale, T>;

export type IconName =
  | "warehouse"
  | "scan"
  | "history"
  | "alert"
  | "calendar"
  | "offline"
  | "users"
  | "monitor"
  | "shield"
  | "flag"
  | "store"
  | "tool"
  | "truck"
  | "notebook"
  | "check"
  | "trend-down"
  | "search"
  | "sliders"
  | "palette"
  | "download"
  | "clock"
  | "adjust";

export type Cta = { label: string; href: string };
export type Item = { icon: IconName; title: string; description: string };
export type Faq = { question: string; answer: string };
export type Testimonio = { quote: string; name: string; business: string };
export type Screenshot = {
  src: `/screens/${string}`;
  alt: string;
  width: number;
  height: number;
};

/**
 * Pantalla del recorrido del hero (spec 003). La leyenda va sin número: el "1. " lo agrega
 * el orden de la lista. Máx. ~32 caracteres para que quepa en 2 líneas a 248 px.
 * Variante oscura opcional por convención: "x.png" → "x-oscuro.png" (mismas dimensiones).
 */
export type HeroScreen = Screenshot & { caption: string };

// Tupla de 4, 5 o 6: un largo fuera de rango rompe el typecheck de `next build`
export type HeroScreens =
  | [HeroScreen, HeroScreen, HeroScreen, HeroScreen]
  | [HeroScreen, HeroScreen, HeroScreen, HeroScreen, HeroScreen]
  | [HeroScreen, HeroScreen, HeroScreen, HeroScreen, HeroScreen, HeroScreen];

/* ---------- Registro de páginas ---------- */

export type PageKey = "home" | "features" | "business" | "partner" | "faq" | "help" | "download" | "privacy";

export type PageInfo = {
  href: `/${string}`; // dirección completa en su idioma ("/en/features")
  navLabel: string;
  title: string;
  description: string;
};
export type Page = {
  key: PageKey;
  inNav: boolean;
  published: boolean;
  locales: Localized<PageInfo>;
};

/* ---------- Funcionalidades ---------- */

export type FeatureGroupKey = "record" | "control" | "team" | "review" | "customize";
export type FeatureGroup = { key: FeatureGroupKey; id: string; title: string; intro: string };
export type Feature = {
  key: string; // estable entre idiomas
  group: FeatureGroupKey; // research R22
  id: string; // ancla en el idioma del objeto
  adminOnly?: boolean; // exportar a Excel: "solo Administrador"
  icon: IconName;
  title: string;
  description: string;
  benefit: string;
  screen: Screenshot | null; // misma imagen; alt en el idioma del objeto
  guide: GuideKey | null;
};

/* ---------- Rubros y FAQ ---------- */

export type Business = {
  key: "minimarket" | "hardware" | "distributor" | "warehouse";
  id: string;
  icon: IconName;
  title: string;
  summary: string;
  problems: string[];
  solutions: string[];
};
export type FaqItem = Faq & { guide?: GuideKey };
export type FaqGroup = { id: string; title: string; items: FaqItem[] };

/* ---------- Guías ---------- */

export type GuideKey = "primeros-pasos" | "movimientos" | "bodegas" | "alertas";
export type GuideStep = { title: string; body: string; screen: Screenshot | null };
export type GuideText = { slug: string; title: string; summary: string; steps: GuideStep[] };
export type Guide = {
  key: GuideKey;
  ready: boolean; // un solo interruptor para ambos idiomas
  feature: string; // Feature.key
  locales: Localized<GuideText>;
};
