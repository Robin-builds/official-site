# Implementation Plan: Página de Contacto

**Branch**: `006-contacto` | **Date**: 2026-11-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-contacto/spec.md`

## Summary

Se agrega la página "Contacto" (`/contacto`, `/en/contact` oculta mientras el inglés no se
publique) como una entrada más del registro de páginas, así aparece sola al final del menú, en
el pie, en el selector de idioma, en hreflang y en el sitemap. La página tiene un formulario
(nombre y empresa obligatorios; teléfono, correo y "¿En qué te podemos ayudar?" opcionales) en
un único componente de cliente: valida con mensajes propios y accesibles, arma un mensaje
rotulado y abre `wa.me` en una pestaña nueva, sin ninguna petición al servidor ni
almacenamiento. Sin JavaScript, el formulario queda deshabilitado y sus campos no tienen `name`,
así que nada puede salir por GET. Como alternativas subordinadas: un botón secundario
"Escribir por WhatsApp" y un QR SVG fijo por idioma, generado una vez y visible solo desde
768 px, sobre una tarjeta blanca para que se lea en tema oscuro. El número real
(+56 9 5759 6588) reemplaza el placeholder en su única constante, y el "Contacto por WhatsApp"
del pie pasa a ser un enlace a la página.

## Technical Context

**Language/Version**: TypeScript 5 (strict), React 19.3

**Primary Dependencies**: Next.js 16.4.5 (App Router, `next/image`, `next/og`), Tailwind CSS 4.
Sin dependencias nuevas. El QR se genera una sola vez con `npx qrcode@1.5.4` (pide confirmación
del owner, no entra a `package.json`).

**Storage**: N/A. El formulario vive en memoria del navegador; nada se persiste.

**Testing**: sin suite automatizada; `npm run build`, `npm run lint` y
[quickstart.md](./quickstart.md) (27 escenarios) + Lighthouse móvil en `/contacto`.

**Target Platform**: navegadores móviles y de escritorio modernos, 360 a 1440 px; Vercel
(`storeflow-official-site`).

**Project Type**: sitio web estático (Next.js App Router, todo prerenderizado).

**Performance Goals**: Lighthouse móvil Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95 en
`/contacto`. Un solo componente de cliente nuevo (`ContactForm`); QR SVG < 10 KB y oculto (sin
cargar) bajo 768 px.

**Constraints**: 100 % estático (Principio IV); ningún dato sale del navegador salvo dentro del
enlace de WhatsApp (FR-005, SC-005); sin JS, botón directo y QR funcionan (FR-013); AA en claro
y oscuro; todo copy en `src/content/` en ambos idiomas.

**Scale/Scope**: 2 rutas (1 por idioma), 1 módulo de contenido nuevo, 3 componentes nuevos
(1 de cliente), 1 utilidad pura, 2 SVG, 1 token de color, cambios menores en `site.ts`, `types.ts`,
`Button.tsx`, `Footer.tsx` y `globals.css`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.* Constitución 3.1.0.

| Principio | Evaluación | Estado |
|-----------|------------|--------|
| I. Veracidad | La página no afirma funcionalidades; copy sin tiempos de respuesta, llamadas ni demos (FR-012); el inglés no dice más que el español. | ✅ |
| II. Una conversión por página | Excepción "Contacto" (3.1.0): envío del formulario como botón primario; botón directo `secondary` y QR subordinados (R10). "Contacto" en el menú es un enlace normal (aclaración). El número vive en `WHATSAPP_NUMBER` y todos los enlaces salen de `whatsappLink` (R2). | ✅ |
| III. Contenido separado | Todo el copy, rótulos del mensaje, errores y rutas del QR en `src/content/contacto.ts` como `Localized<…>`; componentes sin strings visibles (obligatorios con `aria-required`, opcionales con la ayuda "Opcional" del contenido). El fondo del QR es un token nuevo `--qr-bg` en `globals.css`, no un color suelto. | ✅ |
| IV. Simplicidad | Sin backend, sin dependencias; el formulario solo arma un enlace en el navegador (justificación de IV en 3.1.0). Sin JS no se envía nada (R7). Una utilidad pura y un helper de clases, ambos con 2+ usos o requisito explícito. | ✅ |
| V. Mobile-first y accesible | 1 columna a 360 px; errores en texto con `aria-invalid`/`aria-describedby`, foco al primer error, región `status`; etiquetas visibles; teclado; navegación sin JS (registro existente). | ✅ |
| VI. Performance | `next/image` para el QR; `"use client"` solo en `ContactForm`; Lighthouse en quickstart #26. | ✅ |
| VII. Idiomas y tono | Tuteo, sin jerga; inglés tras revisión del owner (sigue oculto). | ✅ |
| Restricciones técnicas | Metadata, OG y hreflang por idioma vía `pageMetadata`/`pageOgImage`; sitemap automático; sin flags experimentales nuevos; firma de `next/image` con SVG verificada en la doc instalada. | ✅ |
| Flujo | `npx qrcode` requiere confirmación del owner antes de correrlo. | ✅ (con confirmación) |

**Re-check post-diseño (Phase 1)**: sin cambios; ninguna violación. Complexity Tracking vacío.

## Project Structure

### Documentation (this feature)

```text
specs/006-contacto/
├── plan.md              # este archivo
├── research.md          # Phase 0 (R1–R12)
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1 (27 escenarios)
├── contracts/
│   ├── routes.md        # rutas, navegación, estructura y componentes
│   └── content.md       # forma de contacto.ts y copy propuesto
├── checklists/requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
public/contact/
├── whatsapp-es.svg                 # NUEVO: QR del mensaje general en español
└── whatsapp-en.svg                 # NUEVO: QR del mensaje general en inglés

src/
├── app/
│   ├── globals.css                 # CAMBIO: token --qr-bg (blanco en ambos temas) → bg-qr-bg
│   ├── (es)/contacto/
│   │   ├── page.tsx                # NUEVO
│   │   └── opengraph-image.tsx     # NUEVO
│   └── (en)/en/contact/
│       ├── page.tsx                # NUEVO
│       └── opengraph-image.tsx     # NUEVO
├── components/
│   ├── pages/ContactPage.tsx       # NUEVO (servidor)
│   ├── sections/ContactForm.tsx    # NUEVO ("use client")
│   ├── sections/ContactAlternatives.tsx  # NUEVO (servidor)
│   ├── ui/Button.tsx               # CAMBIO: exporta buttonClasses()
│   └── layout/Footer.tsx           # CAMBIO: Contacto interno, sin enlace WhatsApp
├── content/
│   ├── contacto.ts                 # NUEVO
│   ├── site.ts                     # CAMBIO: número real, whatsappLink exportada, entrada "contact", sin footer.contactLabel
│   └── types.ts                    # CAMBIO: PageKey + "contact"
└── lib/contact.ts                  # NUEVO: validateContact(), buildContactMessage()
```

**Structure Decision**: se sigue la estructura del sitio de la spec 005 (rutas finas por idioma
que delegan en `components/pages/*Page.tsx`, contenido bilingüe en `src/content/`, utilidades en
`src/lib/`). No hay estructura nueva.

## Orden sugerido de implementación

1. `site.ts` (número real + `whatsappLink` exportada) → verifica FR-009 de inmediato en pie y
   "Sé partner".
2. `types.ts` + entrada `contact` + `contacto.ts` + rutas con `ContactPage` mínima → la página
   existe en menú, pie, sitemap.
3. `lib/contact.ts` + `ContactForm` (US1).
4. QR (confirmar `npx` con el owner) + `ContactAlternatives` (US2).
5. Pie (R9), inglés (US3), quickstart completo y Lighthouse.

## Complexity Tracking

Sin violaciones de la constitución.
