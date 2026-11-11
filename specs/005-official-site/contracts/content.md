# Contrato: módulos de contenido (`src/content/`)

Reemplaza a `src/content/landing.ts`. Los componentes importan solo de estos módulos
(Principio III). Ningún componente tiene copy ni URLs externas. Todo texto existe en español e
inglés: si falta una traducción, falla el typecheck (constitución 3.0.0).

```ts
// types.ts
export type Locale = "es" | "en";
/** Mismo contenido en ambos idiomas; TypeScript exige las dos claves. */
export type Localized<T> = Record<Locale, T>;

export type PageKey =
  | "home" | "features" | "business" | "accountants" | "faq" | "help" | "download" | "privacy";

// Tipos heredados: IconName, Cta, Item, Faq, Testimonio, Screenshot, HeroScreen, HeroScreens.

export type PageInfo = {
  href: `/${string}`;          // dirección completa en su idioma ("/en/features")
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

export type Feature = {
  key: string;                 // estable entre idiomas
  id: string;                  // ancla en el idioma del objeto
  icon: IconName;
  title: string;
  description: string;
  benefit: string;
  screen: Screenshot | null;   // misma imagen; alt en el idioma del objeto
  guide: GuideKey | null;
};
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

export type GuideKey = "primeros-pasos" | "movimientos" | "bodegas" | "alertas";
export type GuideStep = { title: string; body: string; screen: Screenshot | null };
export type GuideText = { slug: string; title: string; summary: string; steps: GuideStep[] };
export type Guide = {
  key: GuideKey;
  ready: boolean;              // un solo interruptor para ambos idiomas
  feature: string;             // Feature.key
  locales: Localized<GuideText>;
};
```

| Módulo | Exporta | Notas |
|---|---|---|
| `site.ts` | `URLS`, `languages`, `pages`, `ui: Localized<…>` (brand, a11y, nav, footer, notFound, languageSwitch, ctaPrincipal) | `URLS` única constante de destinos, con WhatsApp por idioma (R20); `languages.en.published` (R18) |
| `inicio.ts` | `inicio: Localized<…>` | hero (+ `screens`, `carousel`), credibility, problems (3), benefits (3), howItWorks, shortcuts, appLanguageNote (solo `en`, R19), testimonials, finalCta |
| `funcionalidades.ts` | `funcionalidades: Localized<{ intro; features: Feature[] }>` | mismas `key` y mismo orden en ambos idiomas |
| `negocios.ts` | `negocios: Localized<{ intro; businesses: Business[] }>` | 4 rubros |
| `contadores.ts` | `contadores: Localized<…>` | CTA = WhatsApp del idioma |
| `preguntas.ts` | `preguntas: Localized<{ groups: FaqGroup[] }>` | todas las FAQ actuales |
| `descargar.ts` | `descargar: Localized<…>` | requisitos, CTA, Ingresar, nota de idioma de la app (en) |
| `privacidad.ts` | `privacidad: Localized<{ text: string \| null }>` | independiente por idioma |
| `guias.ts` | `guias: Guide[]`, `readyGuides()` | `readyGuides()` filtra `ready: true` |

## Funciones de apoyo (no son contenido)

- `src/lib/i18n.ts` → `pageHref(key, locale)`, `guideHref(key, locale)`,
  `pageKeyFromPath(pathname)`, `otherLocale(locale)`.
- `src/lib/metadata.ts` → `pageMetadata(key, locale): Metadata` (R5): title, description,
  canonical, `alternates.languages`, openGraph y twitter completos.
- `src/lib/og.tsx` → `renderOgImage({ title, note }): ImageResponse` (R6).

## Invariantes (verificadas en build o en quickstart)

- Ambos idiomas tienen las mismas `key` de funcionalidades, rubros, grupos de FAQ y pasos de
  guía, en el mismo orden (comparación en quickstart).
- Toda `Feature.screen` y `GuideStep.screen` apunta a un archivo existente en `/public/screens/`.
- Ningún texto contiene en español "quién", "usuario y fecha" asociado a movimientos, "lote" ni
  "vencimiento"; ni en inglés "who" asociado a movimientos, "batch", "lot number" ni "expir" (research R8–R9).
- `testimonials.items` sigue vacío en ambos idiomas (FR-013).
- `pages` publicadas = enlaces del pie = entradas del sitemap, por idioma.
