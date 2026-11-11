# Implementation Plan: Sitio oficial de StoreFlow (de landing única a sitio de varias páginas, en español e inglés)

**Branch**: `005-official-site` | **Date**: 2026-11-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-official-site/spec.md`

## Summary

La landing de una página se convierte en un sitio estático bilingüe: 9 páginas + 4 guías en
español (raíz, `/funcionalidades`) y en inglés (`/en/features`). Cada idioma tiene su propio
layout raíz en un grupo de rutas (`(es)` con `lang="es-CL"`, `(en)` con `lang="en"`), sin
rewrites ni Proxy; una 404 global bilingüe cubre las URLs que no existen. Encabezado y pie se
comparten; la página actual se marca con `usePathname()` (resuelto en el prerender, funciona sin
JS), el menú móvil es un `<details>` nativo y un selector ES/EN lleva a la misma página en el otro
idioma. Todo el contenido vive en `src/content/` como `{ es, en }` tipado, de modo que una
traducción faltante rompe el build; un registro único de páginas alimenta menú, pie, selector,
hreflang y sitemap. Cada página tiene metadata e imagen para compartir propias por idioma. Inicio
se acorta y conserva `#inicio` y `#como-funciona`. Funcionalidades presenta las 15
funcionalidades de la app (las de la landing, lotes y vencimientos confirmados, y todas las de la
guía rápida) en 5 grupos con índice. La sección Contadores pasa a "Sé partner", una página simple
enlazada solo desde el pie. Se corrige el copy heredado que contradice la constitución ("quién lo
movió"). El sitio informa en ambos idiomas que la app está en español e inglés. El inglés lo
traduce el agente y queda oculto tras un interruptor hasta que el owner lo revise.

## Technical Context

**Language/Version**: TypeScript 5 (strict), React 19.3

**Primary Dependencies**: Next.js 16.4.5 (App Router, route groups, `next/font`, `next/image`,
`next/og`, `experimental.globalNotFound`), Tailwind CSS 4. Sin dependencias nuevas (sin librería
de i18n).

**Storage**: N/A (contenido tipado en `src/content/`)

**Testing**: sin suite automatizada; `npm run build` (typecheck + lint + prerender) y
[quickstart.md](./quickstart.md) (31 escenarios) en navegador + Lighthouse por página

**Target Platform**: navegadores móviles y de escritorio modernos, 360 px a 1440 px; Vercel
(proyecto `storeflow-official-site`)

**Project Type**: sitio web estático (Next.js App Router, todo prerenderizado)

**Performance Goals**: cada página, en ambos idiomas, con Lighthouse móvil Performance ≥ 90,
Accesibilidad ≥ 95, SEO ≥ 95; JS de cliente limitado a selector de tema, recorrido del hero,
`NavLinks` y `MobileMenu`

**Constraints**: 100 % estático (FR-024); navegación, menú y selector de idioma sin JS; AA en
claro y oscuro; `prefers-reduced-motion`; veracidad en ambos idiomas (Principio I); inglés no se
publica sin revisión del owner

**Scale/Scope**: 18 páginas + 8 guías (9 + 4 por idioma), ~10 módulos de contenido bilingües,
~8 componentes de sección nuevos, 2 componentes de cliente nuevos

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.* Constitución 3.0.1.

| Principio | Evaluación | Estado |
|-----------|------------|--------|
| I. Veracidad | Funcionalidades y guías salen de la guía del owner; lotes/vencimientos, idioma de la app y planes pagados confirmados por el owner (aclaraciones 2026-11-10); copy heredado sobre "quién lo movió" se corrige (R8); "Sé partner" sin beneficios inventados (R23); FAQ de idioma en ambos idiomas para que el inglés no diga más que el español (R19); testimonios ocultos; capturas reales. | ✅ (con corrección) |
| II. Una conversión por página | Una CTA principal por página e idioma; "Sé partner" = WhatsApp (excepción de la constitución 3.0.1); menú, pie y selector ES/EN no compiten; "Ingresar" secundario; `URLS` única en `site.ts`, con WhatsApp por idioma (R20). | ✅ |
| III. Contenido separado | Un módulo por página + `site.ts` común; todo `Localized<T>` (`{ es, en }`), traducción faltante = error de tipos; componentes sin copy. | ✅ |
| IV. Simplicidad | Sin dependencias ni librería de i18n; las páginas de cada idioma son una línea que llama al mismo componente. Abstracciones con 2+ usos: `pageMetadata`, `renderOgImage`, helpers de `i18n.ts`. Páginas sin contenido no se publican (`published`, `ready`, `text: null`, `languages.en.published`). | ✅ |
| V. Mobile-first y accesible | `<html lang>` correcto por idioma; menú `<details>` y selector ES/EN operables con teclado y sin JS; `aria-current` en HTML estático; quickstart 5–8, 19, 21–23. | ✅ |
| VI. Performance | Todo prerenderizado; `"use client"` solo en `NavLinks` y `MobileMenu` además de los existentes; Lighthouse por página e idioma. | ✅ |
| VII. Español de Chile e inglés | Español es la fuente; inglés claro en segunda persona; guías citan ENTRADA/SALIDA/AJUSTE como en la app, con traducción la primera vez; revisión del owner antes de publicar el inglés (R18). | ✅ |
| Restricción: APIs verificadas | `usePathname`, metadata (fusión superficial, `title.template`, `alternates.languages`), route groups con varios layouts raíz, `global-not-found`, `opengraph-image` por segmento, `generateStaticParams`, sitemap con `alternates` verificados en `node_modules/next/dist/docs/`. | ✅ |
| Restricción: flags experimentales | Solo `experimental.globalNotFound`, permitido explícitamente por la constitución 3.0.0; alternativa estable documentada (R12). | ✅ |
| Restricción: proyecto propio | Se despliega solo en `storeflow-official-site`; nada se empuja al repo de la landing. | ✅ |

**Post-diseño**: sin violaciones. Hallazgos que no son excepciones: corrección de veracidad del
copy heredado (R8) y uso de un flag experimental ya autorizado (R12).

## Project Structure

### Documentation (this feature)

```text
specs/005-official-site/
├── spec.md
├── plan.md              # este archivo
├── research.md          # R1–R21
├── data-model.md        # entidades de contenido bilingües
├── quickstart.md        # 31 escenarios de validación
├── contracts/
│   ├── routes.md        # rutas por idioma, anclas, encabezado, pie, <head>
│   └── content.md       # módulos y tipos de src/content/
├── fuentes/guia-rapida.md
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks (aún no)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── global-not-found.tsx            # NUEVO: 404 bilingüe (R12)
│   ├── globals.css
│   ├── icon.png  robots.ts  sitemap.ts # sitemap con ambos idiomas y alternates
│   ├── (es)/
│   │   ├── layout.tsx                  # <RootDocument lang="es-CL">, Navbar, Footer
│   │   ├── not-found.tsx               # notFound() explícitos en español
│   │   ├── page.tsx  opengraph-image.tsx
│   │   ├── funcionalidades/  para-tu-negocio/  se-partner/  preguntas-frecuentes/
│   │   ├── descargar/  privacidad/     # cada una: page.tsx (+ opengraph-image.tsx)
│   │   └── ayuda/{page,opengraph-image}.tsx, [guia]/{page,opengraph-image}.tsx
│   └── (en)/en/
│       ├── layout.tsx                  # <RootDocument lang="en">, Navbar, Footer
│       ├── not-found.tsx
│       ├── page.tsx  opengraph-image.tsx
│       ├── features/  for-your-business/  partner/  faq/  download/  privacy/
│       └── help/{page,opengraph-image}.tsx, [guide]/{page,opengraph-image}.tsx
├── components/
│   ├── layout/                         # NUEVO
│   │   ├── RootDocument.tsx            # <html lang>, fuente, script de tema
│   │   ├── Navbar.tsx  Footer.tsx      # movidos desde sections/, reciben locale
│   │   ├── NavLinks.tsx                # "use client": usePathname → aria-current
│   │   ├── MobileMenu.tsx              # "use client": <details> + Escape/cierre por ruta
│   │   └── LanguageSwitch.tsx          # enlaces ES/EN a la misma página
│   ├── pages/                          # NUEVO: una vista por página, recibe locale
│   │   ├── HomePage.tsx  FeaturesPage.tsx  BusinessPage.tsx  PartnerPage.tsx
│   │   ├── FaqPage.tsx  DownloadPage.tsx  PrivacyPage.tsx  HelpPage.tsx  GuidePage.tsx
│   ├── sections/                       # existentes (reciben contenido por props) + Shortcuts,
│   │                                   #   FeatureIndex, FeatureGroups, BusinessList, FaqGroups,
│   │                                   #   GuideSteps, PageHeader
│   └── ui/                             # sin cambios
├── content/
│   ├── types.ts  site.ts  inicio.ts  funcionalidades.ts  negocios.ts
│   ├── partner.ts  preguntas.ts  descargar.ts  privacidad.ts  guias.ts
│   └── (landing.ts se elimina)
└── lib/
    ├── i18n.ts                         # pageHref, guideHref, pageKeyFromPath, otherLocale
    ├── metadata.ts                     # pageMetadata(key, locale) con hreflang
    └── og.tsx                          # renderOgImage()
next.config.ts                          # + experimental.globalNotFound
```

**Structure Decision**: un solo proyecto Next.js (el actual) con dos grupos de rutas, uno por
idioma, cada uno con su layout raíz (research R16). Las vistas de página viven en
`components/pages/` y reciben el idioma, así cada `page.tsx` de cada idioma es una línea y no se
duplica lógica. Las secciones existentes dejan de importar `landing.ts` y reciben su contenido por
props.

## Orden sugerido de implementación (para /speckit-tasks)

1. **Base en español (bloquea todo)**: tipos `Localized`, `site.ts`, `inicio.ts` con
   correcciones de veracidad R8 (el lado `en` puede partir como copia marcada `TODO-EN` solo en la
   rama, nunca publicada); `i18n.ts`, `pageMetadata`, `renderOgImage`; `RootDocument`, grupo
   `(es)` con Navbar/Footer/NavLinks/MobileMenu; Inicio acortado con anclas; 404 global; sitemap.
   → cumple US1 + US2 (P1) en español.
2. **P2**: Funcionalidades (15 funcionalidades en 5 grupos con índice, R22) (español).
3. **P3**: Para tu negocio, Preguntas frecuentes (+ FAQ de idioma de la app), Descargar,
   Privacidad condicional, Ayuda + 4 guías, "Sé partner" (solo pie) (español).
4. **Inglés (US8, P2 por valor, va después por depender del español final)**: grupo `(en)`,
   selector ES/EN, traducción de todos los módulos y guías, hreflang, WhatsApp en inglés, nota de
   capturas en español (R19); `languages.en.published = false` hasta la revisión.
5. **Cierre**: quickstart completo en ambos idiomas, Lighthouse por página, revisión de veracidad,
   **revisión del owner del inglés** y luego `languages.en.published = true`.

El punto 1 ya es publicable como "primeras mejoras" (el primer despliegue espera a tener mejoras
listas). El inglés puede publicarse después, sin bloquear el español.

## Pendientes del owner

- Número real de WhatsApp, texto de privacidad (y su versión en inglés, si la habrá).
- Revisar el texto en inglés antes de publicarlo (FR-031).
- Opcional: capturas de lotes/vencimientos, roles, configurar productos y temas, y capturas en
  inglés (`x-en.png`); sin ellas esas funcionalidades se muestran solo con texto e ícono.

Resueltos en la aclaración del 2026-11-10: idioma de la app (español e inglés), lotes y
vencimientos (existen), funcionalidades a incluir (todas), precios (gratis + planes pagados),
Contadores → "Sé partner".

## Complexity Tracking

Sin violaciones que justificar.
