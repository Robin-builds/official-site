# Data Model: Sitio oficial de StoreFlow (spec 005)

No hay base de datos ni backend (FR-024). Las "entidades" son objetos de contenido tipados en
`src/content/`, validados por TypeScript en `npm run build`. Tipos exactos en
[contracts/content.md](./contracts/content.md).

## Idioma (`Locale`, `Localized<T>`)

`Locale = "es" | "en"`. Todo contenido visible es `Localized<T>` = `{ es: T, en: T }`: el tipo
exige ambas traducciones (constitución III). `languages.en.published` en `site.ts` controla si el
inglés aparece (selector, hreflang, sitemap) mientras el owner lo revisa (research R18).

## Página (`Page`)

| Campo | Tipo | Regla |
|---|---|---|
| `key` | `PageKey` | estable entre idiomas; une las dos versiones de una página |
| `inNav` | boolean | Inicio y Privacidad no van en el menú principal |
| `published` | boolean | `false` → no aparece en menú, pie ni sitemap (FR-014, edge case) |
| `locales.{es,en}.href` | ruta completa | única; en el idioma de la página (FR-023, FR-025) |
| `locales.{es,en}.navLabel` | string | texto en menú y pie |
| `locales.{es,en}.title` | string | título propio (FR-020); se compone como "`title` · StoreFlow" |
| `locales.{es,en}.description` | string | descripción propia para buscadores y vista previa |

Registro único `pages` en `site.ts`: lo leen menú, pie, selector de idioma, sitemap y
`pageMetadata()`.

## CTA (`Cta`)

`{ label, href }`. Cada página tiene **una** CTA principal (FR-015): `ctaPrincipal`
("Pruébala gratis" → `URLS.googlePlay`), salvo Contadores (`URLS.whatsappContador`).

## Funcionalidad (`Feature`)

| Campo | Tipo | Regla |
|---|---|---|
| `id` | slug | ancla en `/funcionalidades#id` |
| `icon` | `IconName` | íconos existentes |
| `title`, `description`, `benefit` | string | FR-008; veracidad según research R8–R9 |
| `screen` | `Screenshot \| null` | solo capturas reales de `/public/screens/` (FR-017); `null` → sin imagen |
| `guide` | slug de guía `\| null` | si existe y está lista, enlace "Ver la guía" (FR-014a) |

## Rubro (`Business`)

| Campo | Tipo | Regla |
|---|---|---|
| `id` | `"minimarket" \| "ferreteria" \| "distribuidora" \| "bodega"` | ancla en `/para-tu-negocio#id` |
| `icon`, `title`, `summary` | | |
| `problems` | string[] (2–4) | problemas típicos del rubro |
| `solutions` | string[] (2–4) | cómo StoreFlow los aborda; solo funcionalidades permitidas |

## Pregunta frecuente (`Faq`, `FaqGroup`)

`FaqGroup = { id, title, items: Faq[] }`, `Faq = { question, answer, guide?: slug }`.
Temas: uso, precio, datos y seguridad, compatibilidad (FR-011). Todas las preguntas actuales
deben existir en algún grupo (SC-003: no se pierde contenido).

## Guía (`Guide`, `GuideStep`)

| Campo | Tipo | Regla |
|---|---|---|
| `slug` | string | ruta `/ayuda/[slug]` |
| `title`, `summary` | string | resumen de una línea (US7-1) |
| `ready` | boolean | `false` → sin ruta, sin enlace, fuera del sitemap |
| `steps` | `GuideStep[]` (≥ 2) | numerados por orden de la lista |
| `feature` | id de `Feature` | enlace de vuelta a la funcionalidad |

`GuideStep = { title, body, screen: Screenshot | null }`. Nombres de botones y tipos de
movimiento se citan como aparecen en la app (ENTRADA, "Configurar productos"; Principio VII).

## Captura (`Screenshot`)

Sin cambios respecto de specs 001/003: `{ src: "/screens/…", alt, width, height }`; `alt`
describe solo lo que se ve. Variante oscura opcional `x-oscuro.png`.

## Privacidad

`privacy = { text: string | null }`. `null` → página 404 y pie enlaza a `URLS.privacyPolicy`.

## Funcionalidades, rubros, FAQ y guías en dos idiomas

Cada lista existe en `es` y `en` con las mismas `key` y el mismo orden; cambian textos, `id` de
ancla y `alt` de capturas. Las guías tienen `key`, `ready` y `feature` comunes, y `slug`, título,
resumen y pasos por idioma (`Guide.locales`). Detalle de tipos en
[contracts/content.md](./contracts/content.md).

## Relaciones

```text
pages (site.ts) ──► menú, pie, selector ES/EN, sitemap, pageMetadata (hreflang)
Feature.guide ──► Guide.slug ──► Guide.feature ──► Feature.id
Faq.guide ──► Guide.slug
Feature.screen / GuideStep.screen ──► /public/screens/*.png
```

Un enlace a una guía con `ready: false` no se renderiza (se filtra al leer el contenido).
