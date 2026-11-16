# Implementation Plan: Página "Planes" (precios y prueba de disposición a pagar)

**Branch**: `009-planes-pricing` | **Date**: 2026-11-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/009-planes-pricing/spec.md`

## Summary

Se agrega la página "Planes" (`/planes`; `/en/plans` oculta mientras el inglés no se publique)
como una entrada más del registro de páginas, entre "Para tu negocio" y "Preguntas frecuentes".
Muestra Free, Standard (recomendado) y Premium desde un único archivo de contenido
(`src/content/planes.ts`), con un selector Mensual/Anual (anual = 10 × mensual), precios
"+ IVA", aviso de precios referenciales y las funciones que aún no existen marcadas
"Próximamente". El botón de cada plan pago abre un `<dialog>` nativo con correo (obligatorio) y
WhatsApp (opcional) que envía la intención a una ruta nueva `POST /api/plan-intent`, gemela de
`/api/contact`: valida, recalcula el precio y manda **un** correo al owner con Resend, sin guardar
nada. Los clics de los 3 botones se cuentan con Umami Cloud (sin cookies ni datos personales),
cargado solo en esta página. Sin JavaScript, los botones pagos son enlaces a WhatsApp con el plan
en el mensaje. Además se corrige la FAQ "Precio" para no insinuar que hoy se pueden contratar planes.

## Technical Context

**Language/Version**: TypeScript 5 (strict), React 19.3, Node 22.19 (scripts de verificación)

**Primary Dependencies**: Next.js 16.4.5 (App Router, `next/script`, `next/og`), Tailwind CSS 4.
Sin dependencias npm nuevas. Servicios externos: Resend (ya en uso) y Umami Cloud (nuevo, script
externo sin paquete; aprobado por la constitución 5.0.0, elegido en research R1).

**Storage**: N/A. La intención sale como correo; los clics viven en Umami; el sitio no persiste nada.

**Testing**: sin suite automatizada (sin dependencias nuevas). `node specs/009-planes-pricing/planes-check.mjs`
(invariantes del contenido y de precios), `npm run lint`, `npm run build` y los 17 escenarios de
[quickstart.md](./quickstart.md), incluido Lighthouse móvil.

**Target Platform**: navegadores móviles y de escritorio modernos (`<dialog>` con `showModal()`),
360 a 1440 px; Vercel (`storeflow-official-site`).

**Project Type**: sitio web estático (Next.js App Router) con dos rutas de servidor.

**Performance Goals**: Lighthouse móvil en `/planes`: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.
El script de medición (~2 KB) carga después de la hidratación.

**Constraints**: `"use client"` solo en el bloque interactivo (selector + tarjetas + ventana). Todo
texto en `src/content/planes.ts` en ambos idiomas. URLs externas (script de Umami) en `URLS`.
`NEXT_PUBLIC_UMAMI_WEBSITE_ID` como variable de Vercel. La ruta no guarda ni registra datos del visitante.

**Scale/Scope**: 1 página × 2 idiomas, 1 ruta de servidor, 1 archivo de contenido, ~4 componentes
nuevos, 1 FAQ corregida. Volumen de una prueba de precios (cientos a pocos miles de visitas/mes).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.* — Constitución **5.0.0**.

| Principio | Cómo se cumple | Estado |
|---|---|---|
| **I. Veracidad** | Montos solo en Planes, con "Precios referenciales, pueden cambiar"; prueba de 14 días y varias empresas con "Próximamente"; confirmación sin prometer cobro; la FAQ "Precio" se corrige para no insinuar que hoy se puede contratar (R11). Las funciones de Free/Standard existen hoy en la app (guía rápida: bodegas, usuarios y roles, panel web, reportes y exportar Excel, alertas, sin internet). | PASS |
| **II. Una conversión por página** | Excepción "Planes": el botón de Standard es el primario; Free y Premium usan estilo secundario. Script de Umami y Google Play en `URLS`. | PASS |
| **III. Contenido separado** | Precios, listas y textos en `src/content/planes.ts`, `Localized<PlansContent>`; los componentes no tienen copy. Tokens existentes. | PASS |
| **IV. Simplicidad** | Única ruta nueva `/api/plan-intent`, autorizada; valida en servidor y no guarda. Medición solo de clics de Planes, sin cookies ni datos personales, sin paquete npm. Sin abstracciones: se reutiliza el patrón de Contacto y la regla de correo exportada de `lib/contact.ts`. | PASS |
| **V. Mobile-first y accesible** | Tarjetas apiladas en 360 px, 3 columnas desde 1024 px; selector con radios nativos; `<dialog>` modal (Esc, foco atrapado, foco de vuelta); errores con texto e ícono; animación de apertura respeta `prefers-reduced-motion`. La navegación funciona sin JS (enlace del registro). | PASS |
| **VI. Performance** | Página estática; un solo componente de cliente; script de medición `afterInteractive`, ~2 KB, solo en Planes. Lighthouse en quickstart #16. | PASS |
| **VII. Español de Chile e inglés** | Copy con tuteo; inglés equivalente, sin decir más (invariante 9 de `planes-check`). Sin jerga ("panel web", "funciona sin internet"). | PASS |
| **Restricciones técnicas** | Ruta lee `RESEND_API_KEY`/`CONTACT_TO_EMAIL` del entorno; metadata, OG, hreflang y sitemap por el registro; APIs de Next verificadas contra `node_modules/next/dist/docs` (`next/script`); atributos de Umami a verificar con Context7 al implementar. | PASS |
| **Flujo** | Rama `009-planes-pricing`; ningún `npm install`/`npx` (Umami es un script externo). | PASS |

**Re-evaluación post-diseño**: PASS, sin violaciones. Dos dependencias externas al repo, que el owner
debe resolver antes de **publicar** (no de implementar):
1. Crear el sitio en Umami Cloud y cargar `NEXT_PUBLIC_UMAMI_WEBSITE_ID` en Vercel.
2. Actualizar la política de privacidad externa (`URLS.privacyPolicy`) con el correo y WhatsApp del
   formulario de Planes y el conteo de clics (FR-017, research R12).

## Project Structure

### Documentation (this feature)

```text
specs/009-planes-pricing/
├── plan.md              # Este archivo
├── research.md          # Fase 0: R1–R12
├── data-model.md        # Fase 1: plan, precio, intención, clic
├── quickstart.md        # Fase 1: 17 escenarios de validación
├── contracts/
│   ├── routes.md        # /planes, /en/plans, POST /api/plan-intent
│   ├── content.md       # PlansContent + invariantes
│   └── events.md        # evento plan-cta de Umami
├── checklists/requirements.md
├── planes-check.mjs     # (implementación) verificador de invariantes, sin dependencias
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (es)/planes/
│   │   ├── page.tsx                 # nuevo: pageMetadata("plans","es") + <PlansPage locale="es">
│   │   └── opengraph-image.tsx      # nuevo
│   ├── (en)/en/plans/
│   │   ├── page.tsx                 # nuevo
│   │   └── opengraph-image.tsx      # nuevo
│   └── api/plan-intent/route.ts     # nuevo: POST, Resend, sin almacenamiento
├── components/
│   ├── pages/PlansPage.tsx          # nuevo (servidor): encabezado, bloque de planes, prueba, script Umami
│   └── sections/
│       ├── PlansGrid.tsx            # nuevo ("use client"): selector, 3 tarjetas, botones
│       ├── PlanCard.tsx             # nuevo: tarjeta de un plan (sin estado)
│       └── PlanIntentDialog.tsx     # nuevo ("use client"): <dialog> + formulario
├── content/
│   ├── planes.ts                    # nuevo: plans + Localized<PlansContent> (solo import type)
│   ├── site.ts                      # cambia: entrada "plans" en pages, URLS.umamiScript
│   ├── types.ts                     # cambia: "plans" en PageKey
│   └── preguntas.ts                 # cambia: FAQ "Precio" (R11)
└── lib/
    ├── pricing.ts                   # nuevo: priceFor, formatCLP (sin imports en ejecución)
    ├── planes.ts                    # nuevo: validateIntent, isChileanMobile, buildIntentEmail
    └── contact.ts                   # cambia: exporta isEmail para reutilizarla
```

**Structure Decision**: misma estructura que las specs 005–006: página por idioma en `app/(es)` y
`app/(en)/en`, componente de página compartido en `components/pages`, secciones en
`components/sections`, contenido en `src/content`, lógica pura en `src/lib`. `PlanCard` se separa de
`PlansGrid` para que la tarjeta no tenga estado; no se crean componentes base nuevos.

## Complexity Tracking

Sin violaciones de la constitución que justificar.
