# Tasks: Sitio oficial de StoreFlow (de landing única a sitio de varias páginas, en español e inglés)

**Input**: Design documents from `specs/005-official-site/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R23), data-model.md, contracts/routes.md, contracts/content.md, quickstart.md, fuentes/guia-rapida.md

**Tests**: no solicitados; la validación es `npm run build` + escenarios de [quickstart.md](./quickstart.md) + Lighthouse.

## Format: `[ID] [P?] [Story] Description`

Reglas comunes a todas las tareas:

- **Contenido** (constitución III): todo texto y URL vive en `src/content/`, como `Localized<T>` (`{ es, en }`). Mientras no se llegue a la fase de inglés (US8), el lado `en` se llena con el mismo texto en español precedido de `"[EN] "`; `languages.en.published = false` impide que se publique. Ningún componente tiene strings visibles ni URLs externas.
- **Veracidad** (constitución I, research R8): ningún texto afirma que la app muestra quién hizo cada movimiento ("quién lo movió", "con usuario y fecha", "con quién lo hizo" → "con su fecha"). Lotes y vencimientos, planes pagados e idioma de la app (español e inglés) están confirmados. Sin montos, sin testimonios, sin beneficios para partners.
- **Server Components por defecto**; `"use client"` solo en `NavLinks`, `MobileMenu` y los existentes (`ThemeToggle`, `ScreensCarousel`).
- **APIs de Next 16.4.5**: `params` es `Promise` (`await params`); metadata se fusiona en forma superficial (por eso `pageMetadata` arma `openGraph` completo); verificar en `node_modules/next/dist/docs/` antes de usar algo no listado en research.
- Comentario inline en todo bloque no obvio. Commits en Conventional Commits (`feat:`, `content:`, `refactor:`), uno por tarea o grupo coherente.
- **Checkpoint** de cada fase: `npm run build` sin errores y todas las rutas como estáticas (`○` / `●`).

---

## Phase 1: Setup

- [X] T001 Confirmar que se trabaja en la rama `005-official-site` con `git status` limpio y que `npm run build` pasa sobre la landing actual
- [X] T002 Medir **H0**: con `npm run build && npm run start`, en Chrome a 360 px, ejecutar `document.documentElement.scrollHeight` en `/` y anotar el valor en una nota al pie de este archivo (`specs/005-official-site/tasks.md`, sección "Mediciones") para el quickstart #2
- [X] T003 En `next.config.ts` agregar `experimental: { globalNotFound: true }` con comentario que cite research R12 y la constitución 3.0.1 (único flag experimental permitido)

---

## Phase 2: Foundational (bloquea todas las historias)

**⚠️ Ninguna historia puede empezar antes de terminar esta fase.**

### Contenido base

- [X] T004 Crear `src/content/types.ts`: mover desde `src/content/landing.ts` los tipos `IconName`, `Cta`, `Item`, `Faq`, `Testimonio`, `Screenshot`, `HeroScreen`, `HeroScreens`; agregar `Locale = "es" | "en"`, `Localized<T> = Record<Locale, T>`, `PageKey = "home" | "features" | "business" | "partner" | "faq" | "help" | "download" | "privacy"`, `PageInfo`, `Page`, `FeatureGroupKey`, `FeatureGroup`, `Feature` (con `group`, `adminOnly?`, `screen: Screenshot | null`, `guide: GuideKey | null`), `Business` (`key: "minimarket" | "hardware" | "distributor" | "warehouse"`), `FaqItem`, `FaqGroup`, `GuideKey = "primeros-pasos" | "movimientos" | "bodegas" | "alertas"`, `GuideStep`, `GuideText`, `Guide` exactamente como en contracts/content.md
- [X] T005 Crear `src/content/site.ts`: `URLS` (copiar de `landing.ts`; `site` pasa a `"https://storeflow-official-site.vercel.app"` marcado `// PLACEHOLDER: confirmar en el primer despliegue (research R14)`; reemplazar `whatsappContador` por `whatsappPartner` ("Hola, quiero ser partner de StoreFlow") y agregar `whatsappPartnerEn`, `whatsappGeneralEn` con texto `"[EN] …"` provisorio, research R20); `languages = { es: { published: true }, en: { published: false } }`; `pages: Page[]` con las 8 claves y sus `href` de contracts/routes.md (`inNav: false` para `home`, `partner`, `privacy`; `help.published` se calcula con `readyGuides().length > 0` en tiempo de build); `ui: Localized<{ brand, a11y, nav, footer, notFound, languageSwitch, ctaPrincipal }>` con el copy de `landing.brand`, `landing.a11y`, `landing.nav`, `landing.footer` (+ `skip`, `menuOpen`/`menuClose`, `currentPage`, etiquetas de selector "ES"/"EN" con nombres accesibles "Español"/"English")
- [X] T006 Crear `src/content/inicio.ts` con `inicio: Localized<…>` a partir de `landing.ts`: `meta`, `hero` (con `screens`, `carousel`, `screenshotPending`), `credibility`, `problems` (los 3 primeros ítems: cuaderno, quiebre, vencimientos), `benefits` (3: "Sabes qué tienes y dónde", "No te quedas sin stock", "Pierdes menos por vencimiento"), `howItWorks` (`id: "como-funciona"` en `es`, `"how-it-works"` en `en`), `shortcuts` (4 accesos: features, business, help, faq, con título y bajada de una línea), `appLanguageNote` (`""` en `es`), `testimonials` (vacío), `finalCta`. Aplicar correcciones R8: `meta.description` → "…Cada entrada y salida queda registrada con su fecha. Pruébala gratis en Android."; `hero.subtitle` sin "y quién lo movió"; credibilidad "Historial que no se puede editar" → "Cada movimiento queda con su fecha y no se edita ni se borra."

### Utilidades

- [X] T007 [P] Crear `src/lib/i18n.ts`: `otherLocale(l)`, `pageHref(key, locale)`, `guideHref(key, locale)` (`/ayuda/<slug>` o `/en/help/<slug>`), `pageKeyFromPath(pathname)` (búsqueda inversa en `pages` y guías; devuelve `{ type: "page" | "guide", key }` o `null`), `localeFromPath(pathname)` (`/en` o `/en/…` → `"en"`)
- [X] T008 [P] Crear `src/lib/metadata.ts` con `pageMetadata(key: PageKey, locale: Locale): Metadata` y `guideMetadata(key: GuideKey, locale)`: `title`, `description`, `alternates.canonical` (href propio), `alternates.languages` (`es-CL`, `en`, `x-default` → español; omitir `en` si `languages.en.published` es `false`), `openGraph` completo (`type: "website"`, `siteName: "StoreFlow"`, `locale: "es_CL" | "en_US"`, `alternateLocale`, `title`, `description`, `url`) y `twitter` (`summary_large_image`) (research R5)
- [X] T009 [P] Crear `src/lib/og.tsx` con `renderOgImage({ title, note }): ImageResponse` moviendo el JSX y los colores literales de `src/app/opengraph-image.tsx`; exportar también `ogSize = { width: 1200, height: 630 }` y `ogContentType = "image/png"` (research R6)

### Estructura de layouts

- [X] T010 Crear `src/components/layout/RootDocument.tsx` (Server Component) con props `{ lang: "es-CL" | "en"; children }`: mueve desde `src/app/layout.tsx` la fuente `Plus_Jakarta_Sans`, el `themeScript` del `<head>`, `suppressHydrationWarning` y el import de `globals.css`; exporta también `viewport` compartido
- [X] T011 Mover `src/components/sections/Navbar.tsx` y `src/components/sections/Footer.tsx` a `src/components/layout/`, con prop `locale: Locale`; leen `ui[locale]` y `pages` de `site.ts` en vez de `landing`
- [X] T012 Adaptar todos los componentes de `src/components/sections/` (`Hero`, `ScreensCarousel`, `PhoneMockup`, `Credibility`, `Problems`, `Benefits`, `HowItWorks`, `UseCases`, `Accountants`, `Testimonials`, `Faq`, `FinalCta`) y `src/components/ui/ThemeToggle.tsx` para que reciban su contenido por props (tipado con el tipo del módulo correspondiente) en vez de importar `landing`; sin cambios visuales
- [X] T013 Eliminar `src/content/landing.ts`: tras T012 los componentes ya no lo importan; los imports que quedan en `src/app/layout.tsx`, `page.tsx`, `opengraph-image.tsx`, `robots.ts` y `sitemap.ts` se apuntan a `site.ts` / `inicio.ts` (cambio mínimo, esos archivos los reescriben T014, T018 y T019); `grep -r "content/landing" src` MUST devolver vacío y `npm run build` MUST pasar
- [X] T014 Mover el árbol de rutas a `src/app/(es)/`: crear `src/app/(es)/layout.tsx` (`<RootDocument lang="es-CL">` + enlace "Saltar al contenido" (`#contenido`) + `<Navbar locale="es" />` + `<main id="contenido">{children}</main>` + `<Footer locale="es" />`, `metadata` con `metadataBase: new URL(URLS.site)` y `title: { template: "%s · StoreFlow", default: <title de home> }`); borrar `src/app/layout.tsx`; mover `src/app/page.tsx` y `src/app/opengraph-image.tsx` a `src/app/(es)/` (route-groups.md: la home debe estar dentro de un grupo cuando no hay layout raíz común)
- [X] T015 Crear `src/app/(en)/en/layout.tsx` igual a T014 con `lang="en"`, `locale="en"`, `#content`, sin páginas todavía salvo las de US8. Guardia de publicación (FR-031, constitución VII): si `languages.en.published` es `false`, el layout llama a `notFound()` antes de renderizar, así ninguna dirección `/en/...` existe en el sitio publicado aunque sus rutas estén en el código; comentario que cite FR-031
- [X] T016 Crear `src/app/global-not-found.tsx`: documento completo (`<html lang="es-CL">`, importa `globals.css`, fuente y `themeScript` por su cuenta), con marca, título "No encontramos esta página" + "We couldn't find this page" (`lang="en"` en el bloque inglés), enlaces a Inicio y Descargar (y a `/en` y `/en/download` solo si `languages.en.published`), `metadata` con `title` bilingüe; textos desde `ui.es.notFound` y `ui.en.notFound` (research R12)
- [X] T017 [P] Crear `src/app/(es)/not-found.tsx` y `src/app/(en)/en/not-found.tsx` para los `notFound()` explícitos, con el texto de `ui[locale].notFound` y enlaces a Inicio y Descargar del idioma
- [X] T018 Reescribir `src/app/sitemap.ts` y `src/app/robots.ts` para leer de `site.ts`: el sitemap recorre `pages` publicadas (y `readyGuides()`), emite la URL en español con `alternates.languages` (`es-CL`, y `en` solo si `languages.en.published`) y, si el inglés está publicado, también la URL en inglés; omite Privacidad del idioma con `text: null` (research R13)
- [X] T019 Crear `src/components/pages/HomePage.tsx` (`{ locale }`) que arma Inicio con las secciones existentes leyendo `inicio[locale]` (hero, credibilidad, problemas, beneficios, cómo funciona, testimonios, CTA final) — sin `Shortcuts` todavía (US1); dejar `src/app/(es)/page.tsx` como `export default () => <HomePage locale="es" />` con `export const metadata = pageMetadata("home", "es")`; `src/app/(es)/opengraph-image.tsx` usa `renderOgImage` con `inicio.es.hero.title`
- [X] T020 Checkpoint: `npm run build` pasa; `/` se ve igual que hoy salvo el copy corregido (R8) y las secciones que aún no se movieron; `/xyz` muestra la 404 global

**Checkpoint**: base lista; las historias pueden empezar.

---

## Phase 3: User Story 1 - Entender StoreFlow y descargarla desde el Inicio (P1) 🎯 MVP

**Goal**: Inicio corto (≤ 0,6 × H0 a 360 px) con hero, credibilidad, resumen de problemas y beneficios, cómo funciona, accesos y CTA final; anclas antiguas funcionando.

**Independent Test**: a 360 px, "Pruébala gratis" visible sin scroll y abre Google Play en un toque; `/#como-funciona` y `/#inicio` llegan a su bloque (quickstart 1–3).

- [X] T021 [US1] Crear `src/components/sections/Shortcuts.tsx` (Server Component): 4 tarjetas-enlace (título + bajada + flecha) desde `inicio[locale].shortcuts`, con `href` resuelto por `pageHref(key, locale)`; usa las clases `.card-hover` / `.card-icon` de la spec 004; grilla 1 col a 360 px, 2 a 768 px, 4 a 1440 px
- [X] T022 [US1] En `src/components/pages/HomePage.tsx`: orden final hero (`id="inicio"`/`"home"`) → credibilidad → problemas (3) → beneficios (3) → cómo funciona (`id` de `howItWorks`, con enlace secundario "Ver todas las funcionalidades" a `/funcionalidades`) → `Shortcuts` → testimonios (oculta si vacío, FR-013) → CTA final; quitar casos de uso, contadores y FAQ (research R15)
- [X] T023 [US1] En `src/components/sections/Hero.tsx`: la CTA secundaria "Ver cómo funciona" apunta a `#como-funciona` (sin cambio) y el logo del encabezado a `pageHref("home", locale)`; confirmar que la primera captura sigue siendo la imagen LCP con `priority`
- [X] T024 [US1] Medir `scrollHeight` de `/` a 360 px y anotarlo junto a H0 en "Mediciones"; si supera 0,6 × H0, reducir problemas/beneficios a 2 ítems o compactar el espaciado de `Shortcuts` hasta cumplir SC-003

**Checkpoint**: quickstart 1–3 pasan.

---

## Phase 4: User Story 2 - Navegar entre páginas con un menú claro (P1)

**Goal**: encabezado y pie compartidos con todas las páginas publicadas, página actual marcada y menú móvil operable con teclado y sin JS.

**Independent Test**: desde cualquier página se llega a cualquier otra en ≤ 2 toques; Tab/Enter/Escape operan el menú; con JS deshabilitado el menú abre y la página actual sigue marcada (quickstart 4–8).

- [X] T025 [US2] Crear `src/components/layout/NavLinks.tsx` (`"use client"`): recibe `items: { href; label }[]`, usa `usePathname()` y pone `aria-current="page"` + estilo de página actual (texto `text-fg`, subrayado primario) en el enlace cuyo `href` coincide (Inicio solo coincide exacto; `/ayuda` también marca `/ayuda/*`); enlaces con `next/link`
- [X] T026 [US2] Crear `src/components/layout/MobileMenu.tsx` (`"use client"`): `<details>` con `<summary>` (ícono hamburguesa/cerrar, nombre accesible `ui.a11y.menuOpen`), panel con `NavLinks` en columna, CTA principal destacada, "Ingresar" secundario y `ThemeToggle`; comportamiento: cerrar al cambiar `usePathname()`, cerrar con Escape devolviendo el foco al `<summary>`, cerrar con clic fuera (research R3); sin JS sigue abriendo y cerrando de forma nativa
- [X] T027 [US2] En `src/components/layout/Navbar.tsx`: ≥ 1024 px marca · `NavLinks` (páginas con `inNav` y `published`) · Ingresar (ghost) · `ThemeToggle` · CTA principal; < 1024 px marca · CTA principal · `MobileMenu` (contracts/routes.md, "Encabezado"); el slot del selector ES/EN queda preparado pero vacío hasta US8
- [X] T028 [US2] En `src/components/layout/Footer.tsx`: lista de enlaces internos a todas las páginas publicadas del idioma (incluida "Sé partner" cuando exista y Privacidad interna o externa según `privacidad[locale].text`), más Contacto (WhatsApp del idioma), Ingresar y chileapps.cl (FR-004); externos con `target="_blank"` y aviso `ui[locale].a11y.newTab`
- [X] T029 [US2] En `src/app/globals.css`: estilos del panel del menú móvil (`details[open]` → panel fijo bajo el header, fondo `bg-surface`, sombra `--elev-card`), ícono que cambia entre abrir/cerrar por `details[open]`, y sin animación de movimiento bajo `prefers-reduced-motion: reduce`; comentario que cite research R3
- [X] T030 [US2] Verificar quickstart 4–8: en DevTools con JS deshabilitado, `/` y una página interna muestran `aria-current` en el HTML y el menú abre; con teclado, Escape devuelve el foco

**Checkpoint**: US1 + US2 = MVP publicable como "primeras mejoras".

---

## Phase 5: User Story 3 - Conocer las funcionalidades en detalle (P2)

**Goal**: `/funcionalidades` con índice de 5 grupos y las 15 funcionalidades, captura solo cuando es real.

**Independent Test**: cada funcionalidad tiene título, descripción y beneficio; las 6 con captura real la muestran; ninguna imagen inventada; CTA a mano (quickstart 9).

- [X] T031 [P] [US3] Crear `src/content/funcionalidades.ts` con `funcionalidades: Localized<{ meta; intro; groups: FeatureGroup[]; features: Feature[]; cta }>`: 5 grupos (`record`/`#registrar`, `control`/`#controlar`, `team`/`#equipo`, `review`/`#revisar`, `customize`/`#personalizar`) y 15 funcionalidades según research R22, redactadas desde `fuentes/guia-rapida.md` y `landing.ts`, con estas `key` estables (las usan `Guide.feature` y los enlaces): `scanning` escaneo (`escanear.png`), `movements` entradas y salidas (`movimiento.png`, guía `movimientos`), `adjustments` ajustes (AJUSTE; guía `movimientos`), `expiry` lotes y fechas de vencimiento (sin captura), `warehouses` bodegas (`bodega.png`, guía `bodegas`), `products` productos y búsqueda (sin captura, guía `primeros-pasos`), `low-stock-alerts` alertas de stock bajo (`alerta-stock.png`, guía `alertas`), `inactivity-alerts` alerta sin actividad 7 días (sin captura, guía `alertas`), `roles` usuarios y roles Administrador/Operador (sin captura), `offline` funcionamiento sin internet (sin captura), `history` historial (`historial.png`; "no se edita ni se borra", sin "quién"), `web-panel` panel web de solo lectura (sin captura), `excel-export` exportar a Excel (`adminOnly: true`), `product-settings` configurar productos (sin captura), `themes` temas de color (3 paletas × 3 niveles; sin captura); `alt` copiados de `inicio.hero.screens` cuando la captura coincide
- [X] T032 [P] [US3] Crear `src/components/sections/PageHeader.tsx` (título H1 + bajada + CTA opcional), reutilizable por todas las páginas internas
- [X] T033 [P] [US3] Crear `src/components/sections/FeatureIndex.tsx`: lista de enlaces a los 5 grupos (`#id`), horizontal con scroll interno a 360 px sin scroll horizontal de página
- [X] T034 [US3] Crear `src/components/sections/FeatureGroups.tsx`: por grupo, `<section id={group.id}>` con H2 y las funcionalidades en filas alternadas (captura en `PhoneMockup` si `screen` existe; si es `null`, solo ícono `Icon` + texto, US3-2); cada funcionalidad con `id`, título H3, descripción, beneficio, etiqueta "Solo Administrador" si `adminOnly`, y enlace "Ver la guía" si `guide` apunta a una guía con `ready: true`
- [X] T035 [US3] Crear `src/components/pages/FeaturesPage.tsx` (`PageHeader` + `FeatureIndex` + `FeatureGroups` + `FinalCta` con `ctaPrincipal`) y `src/app/(es)/funcionalidades/page.tsx` (+ `metadata = pageMetadata("features", "es")`) y `src/app/(es)/funcionalidades/opengraph-image.tsx` (`renderOgImage` con el título de la página)
- [X] T036 [US3] Marcar `features.published = true` en `src/content/site.ts` y verificar quickstart 9 (incluye que no hay imagen para las 9 sin captura)

**Checkpoint**: Funcionalidades navegable desde el menú.

---

## Phase 6: User Story 5 - Encontrar a qué rubro le sirve y resolver dudas (P3)

**Goal**: `/para-tu-negocio` con 4 rubros y `/preguntas-frecuentes` agrupada por tema.

**Independent Test**: `/para-tu-negocio#ferreteria` muestra problemas, soluciones y CTA; la FAQ tiene todas las preguntas actuales + la de idioma, agrupadas y operables con teclado (quickstart 12–13).

- [X] T037 [P] [US5] Crear `src/content/negocios.ts` con `negocios: Localized<{ meta; intro; businesses: Business[]; cta }>`: minimarket (`#minimarket`), ferretería (`#ferreteria`), distribuidora (`#distribuidora`), bodega (`#bodega`), cada uno con `summary` (de `landing.useCases`, corregido: distribuidora y bodega "con su fecha"), 2–4 `problems` (de `landing.problems` según el rubro) y 2–4 `solutions` (solo funcionalidades de T031; minimarket mantiene vencimientos por lote)
- [X] T038 [P] [US5] Crear `src/content/preguntas.ts` con `preguntas: Localized<{ meta; intro; groups: FaqGroup[]; cta }>`: grupos uso (sin internet, lector de códigos, varias bodegas y usuarios — reescrita con roles Administrador/Operador y sin "quién lo hizo"), precio ("¿Cuánto cuesta?": gratis para empezar + planes pagados, sin montos), datos y seguridad (dónde quedan mis datos), compatibilidad (iPhone: no; boletas/facturas: no; **nueva** "¿La app está en inglés?": sí, en español e inglés según el idioma del celular); `guide` en las que tengan guía
- [X] T039 [P] [US5] Crear `src/components/sections/BusinessList.tsx`: un bloque por rubro con `id`, ícono, título H2, resumen, dos listas ("Lo que pasa" / "Cómo te ayuda StoreFlow") y CTA principal; índice de 4 rubros arriba
- [X] T040 [P] [US5] Crear `src/components/sections/FaqGroups.tsx`: por grupo un H2 y los `<details>` existentes de `Faq.tsx` (reutilizar su marcado y clases `.faq-toggle` de la spec 004), con enlace "Ver la guía" si `guide` apunta a una guía lista
- [X] T041 [US5] Crear `src/components/pages/BusinessPage.tsx` y `FaqPage.tsx` (con `PageHeader` y `FinalCta`), `src/app/(es)/para-tu-negocio/{page,opengraph-image}.tsx` y `src/app/(es)/preguntas-frecuentes/{page,opengraph-image}.tsx` con `pageMetadata`/`renderOgImage`; marcar `business` y `faq` como `published` en `site.ts`
- [X] T042 [US5] Borrar `src/components/sections/UseCases.tsx` y `Faq.tsx` si quedaron sin uso (Principio IV); verificar quickstart 12–13

---

## Phase 7: User Story 7 - Aprender a usar la app con guías paso a paso (P3)

**Goal**: `/ayuda` con 4 guías listas, cada una en `/ayuda/<slug>` con pasos numerados.

**Independent Test**: abrir `/ayuda/primeros-pasos` y completar la tarea en la app siguiendo solo los pasos; desde Funcionalidades se llega a la guía (quickstart 14).

- [X] T043 [US7] Crear `src/content/guias.ts` con `guias: Guide[]` y `readyGuides()`, redactando desde `fuentes/guia-rapida.md` (adaptado a español de Chile, tuteo, sin jerga; botones y tipos tal como en la app): `primeros-pasos` (crear cuenta → se crea empresa y "Bodega Principal"; tarjeta "Productos" → [+] con nombre, unidad y stock mínimo; ENTRADA del primer producto; revisar el inicio; captura `inicio.png` en el último paso; feature `products`), `movimientos` (`registrar-movimientos`: ENTRADA, SALIDA, AJUSTE y el ejemplo de la harina 0 → 100 → 70 → 55 → 50; "los movimientos no se editan ni se borran"; captura `movimiento.png` e `historial.png`; feature `movements`), `bodegas` (`varias-bodegas`: cuándo usar varias, crear bodega, cambiar la bodega activa tocando la tarjeta "Bodegas"; captura `bodega.png`; feature `warehouses`), `alertas` (`alertas-de-stock`: stock mínimo, banner rojo de menor stock, lista stock actual vs mínimo, alerta sin actividad 7 días; captura `alerta-stock.png`; feature `low-stock-alerts`); todas `ready: true`; lado `en` con prefijo `[EN]` hasta US8
- [X] T044 [P] [US7] Crear `src/components/sections/GuideSteps.tsx`: `<ol>` con pasos numerados (número visible y accesible), título, cuerpo y captura en `PhoneMockup` cuando `screen` existe
- [X] T045 [US7] Crear `src/components/pages/HelpPage.tsx` (lista de `readyGuides()` con título, resumen de una línea y enlace) y `GuidePage.tsx` (`PageHeader` + `GuideSteps` + enlace "Ver la funcionalidad" a `/funcionalidades#<id>` + `FinalCta`)
- [X] T046 [US7] Crear `src/app/(es)/ayuda/{page,opengraph-image}.tsx` y `src/app/(es)/ayuda/[guia]/{page,opengraph-image}.tsx` con `generateStaticParams()` desde `readyGuides()`, `export const dynamicParams = false`, `params: Promise<{ guia: string }>` y `generateMetadata` con `guideMetadata` (research R10); `help.published` verdadero si hay guías listas
- [X] T047 [US7] Verificar enlaces cruzados: Funcionalidades (T034) y Preguntas frecuentes (T040) muestran "Ver la guía" solo para guías listas; quickstart 14

---

## Phase 8: User Story 6 - Política de privacidad propia (P3)

**Goal**: `/privacidad` solo con texto entregado por el owner.

**Independent Test**: con `text: null`, `/privacidad` da 404 y el pie enlaza a `URLS.privacyPolicy` (quickstart 16).

- [X] T048 [P] [US6] Crear `src/content/privacidad.ts` con `privacidad: Localized<{ meta; text: string | null }>`, ambos `null` hasta que el owner entregue el texto (FR-019)
- [X] T049 [US6] Crear `src/components/pages/PrivacyPage.tsx` (si `text` es `null` llama a `notFound()`; si no, `PageHeader` + texto en párrafos, sin CTA) y `src/app/(es)/privacidad/{page,opengraph-image}.tsx` con `pageMetadata("privacy", "es")` y `renderOgImage` con el título de la página (FR-020); verificar quickstart 16 y que el pie de T028 usa el enlace externo

---

## Phase 9: User Story 4 - Página "Sé partner" (P3)

**Goal**: `/se-partner` simple, solo en el pie, con contacto por WhatsApp y sin beneficios prometidos.

**Independent Test**: pie → "Sé partner" → "Quiero ser partner" abre WhatsApp con el mensaje de partners; la página no está en el menú ni en Inicio (quickstart 10).

- [X] T050 [P] [US4] Crear `src/content/partner.ts` con `partner: Localized<{ meta; eyebrow; title; body; reasons: string[]; cta: Cta; ctaNote }>` desde `landing.accountants`: dirigido a "contadores y asesores de pymes", 4 razones con R8 aplicado ("Historial de entradas y salidas que no se puede modificar, con fecha"), CTA "Quiero ser partner" → `URLS.whatsappPartner`; sin comisiones, descuentos ni beneficios (FR-010)
- [X] T051 [US4] Crear `src/components/pages/PartnerPage.tsx` reutilizando el panel de `src/components/sections/Accountants.tsx` (renombrarlo a `PartnerPanel.tsx`, contenido por props) y `src/app/(es)/se-partner/{page,opengraph-image}.tsx`; `partner.published = true`, `inNav = false`; verificar quickstart 10

---

## Phase 10: Descargar (soporte de US1, FR-012)

- [X] T052 [P] [US1] Crear `src/content/descargar.ts` con `descargar: Localized<{ meta; title; body; requirements: string[]; cta; loginLine; appLanguageNote }>`: Google Play, requisito "celular Android", acceso "Ingresar" a la versión web; `appLanguageNote` vacío en `es`
- [X] T053 [US1] Crear `src/components/pages/DownloadPage.tsx` y `src/app/(es)/descargar/{page,opengraph-image}.tsx`; en el encabezado y el panel móvil, "Pruébala gratis" sigue yendo directo a Google Play (SC-001) y `download` va en el pie; `download.published = true`

**Checkpoint**: sitio completo en español. Commit y, si el owner lo aprueba, primer despliegue con `languages.en.published = false`.

---

## Phase 11: User Story 8 - Ver el sitio en inglés (P2)

**Goal**: el mismo sitio bajo `/en`, con selector ES/EN y hreflang, publicado solo tras revisión del owner.

**Independent Test**: desde cada página en español, "EN" lleva a su equivalente y "ES" vuelve (quickstart 22–31).

- [X] T054 [US8] Crear `src/components/layout/LanguageSwitch.tsx` (Server Component que recibe `locale` y `href` del otro idioma, o variante client mínima que use `pageKeyFromPath(usePathname())` dentro de `NavLinks` si hace falta): dos enlaces "ES"/"EN" con `lang`, `hreflang`, nombre accesible "Español"/"English" y `aria-current="true"` en el actual; `<a>` normal (recarga completa entre layouts raíz, research R16–R17); solo se renderiza si `languages.en.published`
- [X] T055 [US8] Insertar `LanguageSwitch` en `src/components/layout/Navbar.tsx` (≥ 1024 px, junto al tema) y en `MobileMenu.tsx`
- [X] T056 [P] [US8] Traducir al inglés `src/content/site.ts` (`ui.en`, `pages[*].locales.en`, `whatsappGeneralEn` "Hi, I'd like to know more about StoreFlow", `whatsappPartnerEn` "Hi, I'd like to become a StoreFlow partner") quitando todos los `[EN]`; inglés claro, segunda persona, sin jerga ni clichés (constitución VII)
- [X] T057 [P] [US8] Traducir `src/content/inicio.ts` (`en`), incluido `alt` de capturas y `appLanguageNote`: "StoreFlow shows in English when your phone is set to English. The screenshots on this site show the Spanish version." (research R19)
- [X] T058 [P] [US8] Traducir `src/content/funcionalidades.ts` (`en`) con anclas en inglés (`#record`, `#stay-on-top`, `#team`, `#review`, `#customize` y una por funcionalidad, p. ej. `#scanning`)
- [X] T059 [P] [US8] Traducir `src/content/negocios.ts` (`en`; anclas `#minimarket`, `#hardware-store`, `#distributor`, `#warehouse`), `preguntas.ts`, `descargar.ts` (con `appLanguageNote`), `partner.ts` y `privacidad.ts` (`text: null`)
- [X] T060 [P] [US8] Traducir `src/content/guias.ts` (`locales.en`: slugs `getting-started`, `recording-stock-movements`, `multiple-warehouses`, `stock-alerts`); citar ENTRADA, SALIDA, AJUSTE y nombres de pantalla tal como en la app con traducción la primera vez ("ENTRADA (stock in)")
- [X] T061 [US8] Crear en `src/app/(en)/en/` las rutas de contracts/routes.md, cada una de una línea con su componente de `src/components/pages/` y `locale="en"`: `page.tsx`, `features/`, `for-your-business/`, `faq/`, `help/`, `help/[guide]/` (`generateStaticParams` con slugs `en`, `dynamicParams = false`), `download/`, `partner/`, `privacy/`, cada una con `metadata`/`generateMetadata` (`pageMetadata(key, "en")`) y `opengraph-image.tsx` donde corresponda. Las rutas quedan detrás de la guardia de T015: con `languages.en.published = false` responden "no encontrada" en el build de producción; para revisarlas localmente se cambia el flag sin commitearlo
- [X] T062 [US8] Revisar que `pageMetadata`, `sitemap.ts`, `global-not-found.tsx` y el pie incluyen el inglés cuando `languages.en.published` es `true` (probar con el flag en `true` localmente, sin commitearlo)
- [X] T063 [US8] Verificar quickstart 22–30 con el flag en `true` localmente; comparar cantidad y orden de funcionalidades, rubros, FAQ y pasos entre idiomas (quickstart 28)
- [ ] T064 [US8] **Revisión del owner** (FR-031, quickstart 31): entregar al owner la lista de páginas en inglés para leer en local; aplicar sus correcciones; recién con su aprobación poner `languages.en.published = true` en `src/content/site.ts` y commitear. Antes de la aprobación, verificar en `npm run build && npm run start` con el flag en `false` que `/en` y `/en/features` responden "no encontrada" (FR-031)

---

## Phase 12: Polish & Cross-Cutting Concerns

- [X] T065 [P] Revisión de veracidad (FR-016, SC-006): buscar en `src/content/` "quién", "usuario y fecha", "comisi", "$" (es) y "who", "commission", "$" (en); cada resultado debe ser legítimo (quickstart 18 y 29)
- [X] T066 [P] Revisión de Principio VII: tuteo y sin voseo en español; sin jerga ("offline", "sync", "dashboard", "SaaS", "cloud") ni clichés en ambos idiomas
- [X] T067 Verificar en cada página, en ambos idiomas, 360/768/1440 px sin scroll horizontal y contraste AA en claro y oscuro (quickstart 19); revisar `prefers-reduced-motion` (quickstart 21)
- [ ] T068 Lighthouse móvil (build de producción) en todas las páginas y en una guía, en ambos idiomas: Performance ≥ 90, Accesibilidad ≥ 95, SEO ≥ 95 (SC-005); registrar los resultados en "Mediciones"
- [X] T069 Revisar `<head>` de cada página: canonical, hreflang, `og:locale`, título y descripción propios, imagen OG generada (quickstart 11, 24) y `/sitemap.xml` (quickstart 17)
- [X] T070 Recorrer quickstart.md completo (31 escenarios) y marcar resultados; actualizar `README.md` con la estructura nueva (`src/content/` por página, grupos `(es)`/`(en)`, flag `languages.en.published`)
- [ ] T071 Primer despliegue (solo con aprobación del owner): push de `005-official-site`, revisar la vista previa de Vercel, merge a `main`; confirmar la dirección de producción y actualizar `URLS.site` (research R14), luego repetir quickstart 11 y 17 sobre esa dirección

---

## Dependencies & Execution Order

### Phases

- **Setup (1)** → **Foundational (2)** → historias.
- **US1 (3)** y **US2 (4)** dependen de la fase 2; US2 usa `Footer`/`Navbar` de T011. Juntas forman el MVP.
- **US3 (5)**, **US5 (6)**, **US7 (7)**, **US6 (8)**, **US4 (9)** y **Descargar (10)** dependen solo de la fase 2 (y de `PageHeader`, T032, que conviene hacer primero); son independientes entre sí.
- **US7** enlaza con US3 y US5 (T047), pero cada una funciona sola: los enlaces "Ver la guía" aparecen solo cuando hay guías listas.
- **US8 (11)** depende de que el contenido español de todas las páginas esté terminado (fases 3–10), porque traduce el texto final.
- **Polish (12)** al final; T064 (revisión del owner) bloquea publicar el inglés, no el español.

### Within each story

Contenido (`src/content/*.ts`) → secciones (`src/components/sections/`) → vista de página (`src/components/pages/`) → rutas (`src/app/(es)/…`) → `published = true` → verificación.

### Parallel opportunities

- Fase 2: T007, T008, T009 en paralelo; T017 en paralelo con T018.
- Tras la fase 2: los módulos de contenido T031, T037, T038, T048, T050, T052 en paralelo; componentes T032, T033, T039, T040, T044 en paralelo.
- Fase 11: traducciones T056–T060 en paralelo (archivos distintos).

### Parallel example: User Story 5

```text
T037 src/content/negocios.ts      ‖  T038 src/content/preguntas.ts
T039 sections/BusinessList.tsx    ‖  T040 sections/FaqGroups.tsx
→ T041 páginas y rutas → T042 limpieza y verificación
```

### Parallel example: User Story 8

```text
T056 site.ts ‖ T057 inicio.ts ‖ T058 funcionalidades.ts ‖ T059 negocios/preguntas/descargar/partner/privacidad ‖ T060 guias.ts
→ T061 rutas /en → T062–T063 verificación → T064 revisión del owner
```

## Implementation Strategy

1. **MVP (primeras mejoras)**: fases 1–4 (T001–T030). Inicio corto, navegación y 404, copy corregido. Ya es publicable: el owner decide si es el primer despliegue.
2. **Incremento 2**: Funcionalidades (fase 5) y Descargar (fase 10).
3. **Incremento 3**: Para tu negocio + FAQ, Guías, Privacidad, Sé partner (fases 6–9).
4. **Incremento 4**: inglés (fase 11), publicado solo tras la revisión del owner.
5. **Cierre**: fase 12 y despliegue.

Cada incremento termina con `npm run build`, los escenarios de quickstart de esa fase y un commit.

## Mediciones

- H0 (landing actual, `/` a 360 px, build de producción, 2026-11-10): **10.178 px** → meta Inicio ≤ 6.107 px
- Inicio nuevo a 360 px (2026-11-10): **6.061 px** = 0,596 × H0 (40,4 % más corto). Para cumplir se compactaron en celular "Cómo funciona" (pasos en fila), Problemas (ícono al lado), accesos, pie (2 columnas) y algunos espaciados; no se quitó contenido
- Lighthouse por página: _pendiente (T068)_: no hay Lighthouse instalado en esta máquina; correrlo en Chrome DevTools sobre el build de producción
- Verificación automatizada (Chrome headless, build de producción, 2026-11-10): sin scroll horizontal a 360/768/1440 px en todas las páginas de ambos idiomas; `aria-current` en el HTML estático; menú abre sin JS, Escape devuelve el foco y se cierra al navegar; selector ES/EN lleva a la página equivalente y vuelve en las 9 direcciones probadas; paridad es/en: 15 funcionalidades, 4 rubros, 8 preguntas, mismos pasos por guía; con el inglés apagado `/en/...` y `/privacidad` responden la 404 global
- Contraste (T067): solo se usan combinaciones de tokens ya validadas en las specs 002/004; no se midió con herramienta
