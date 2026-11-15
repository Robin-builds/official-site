# Implementation Plan: Hover animado y atractivo en todas las tarjetas del sitio

**Branch**: `007-card-hover-animado` | **Date**: 2026-11-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/007-card-hover-animado/spec.md`

## Summary

Reforzar el resaltado de tarjetas de la spec 004 (más elevación, sombra con brillo de marca,
animación de 300 ms con frenado suave, ícono que gira, flecha que avanza) y extenderlo a las
tarjetas que no lo tienen (paneles de Para tu negocio y Sé partner). Agregar un hover propio a las
capturas de la app (anillo primario, zoom del 4% y sombra flotante) en el marco de teléfono
compartido, y una respuesta al presionar en pantallas táctiles. Todo con CSS en `globals.css`
y clases en los componentes: sin JavaScript nuevo ni dependencias. Detalle en [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5 (strict), React 19.3, CSS

**Primary Dependencies**: Next.js 16.4.5 (App Router), Tailwind CSS 4. Sin dependencias nuevas.

**Storage**: N/A

**Testing**: no hay suite automatizada en el proyecto; validación manual guiada por
[quickstart.md](quickstart.md) + `npm run build`, `npm run lint` y Lighthouse móvil.

**Target Platform**: navegadores evergreen (Chrome/Edge/Firefox/Safari recientes) en escritorio y
móvil; requiere `:has()`, `color-mix()` y las propiedades `translate`/`scale`/`rotate`, ya usadas
por la spec 004.

**Project Type**: sitio web estático (Next.js, Server Components)

**Performance Goals**: animaciones a 60 fps sin cuadros perdidos visibles; Lighthouse móvil
Performance ≥ 90 y Accessibility ≥ 95 por página.

**Constraints**: CLS 0; solo propiedades de composición, color y sombra; colores solo desde tokens;
`prefers-reduced-motion`; sin hover pegado en táctil; sin `"use client"` nuevo.

**Scale/Scope**: 9 tipos de tarjeta en 4 páginas (× 2 idiomas) y 3 usos de `PhoneFrame`; ~1 archivo
CSS y 6 componentes tocados.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|-----------|------------|--------|
| I. Veracidad | No cambia contenido; las capturas siguen siendo reales | ✅ |
| II. Una conversión por página | El resaltado no compite con la CTA: no cambia botones ni jerarquía. En Sé partner, el botón de WhatsApp queda dentro del panel resaltado, sin cambio de estilo | ✅ |
| III. Contenido separado / tokens en un lugar | Sin copy nuevo; tokens nuevos solo en `globals.css`, definidos en los tres bloques de tema | ✅ |
| IV. Simplicidad | Sin dependencias ni componentes nuevos; se reutilizan las clases de la 004 | ✅ |
| V. Mobile-first y accesible | Foco visible = resaltado; respuesta táctil al presionar; movimiento reducido; AA ≥ 3:1 en bordes; sin scroll horizontal a 360 px | ✅ |
| VI. Performance | Sin JS nuevo ni `"use client"`; solo propiedades baratas; sin `will-change` permanente | ✅ |
| VII. Idioma | Sin texto nuevo | ✅ |
| Restricciones técnicas | Sintaxis de Tailwind 4 (propiedades `translate`/`scale`/`rotate`, `[--var:valor]`) ya usada y verificada en la 004 | ✅ |

**Post-diseño (Phase 1)**: sin cambios; ninguna violación. Complexity Tracking vacío.

## Project Structure

### Documentation (this feature)

```text
specs/007-card-hover-animado/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── interaction-states.md
├── checklists/
│   └── requirements.md
└── tasks.md              # /speckit-tasks
```

### Source Code (repository root)

```text
src/app/globals.css                      # tokens (--motion-*, --elev-card-hover, --elev-phone-float)
                                         # y clases .card-hover/.card-icon/.card-arrow/.phone-hover/.phone-bezel
src/components/sections/PhoneMockup.tsx  # PhoneFrame: .phone-hover + .phone-bezel (hero, Funcionalidades, guías)
src/components/sections/Shortcuts.tsx    # .card-arrow en la flecha + tap-highlight transparente
src/components/pages/HelpPage.tsx        # tap-highlight transparente (ya tiene card-hover)
src/components/sections/BusinessList.tsx # card-hover [--card-lift:-4px] en los 2 paneles
src/components/sections/PartnerPanel.tsx # card-hover [--card-lift:-4px] en el panel
```

Sin cambios: `Problems`, `Benefits`, `HowItWorks`, `Credibility`, `Testimonials` (heredan los
valores nuevos de las clases), `FeatureGroups`, `GuideSteps` (heredan vía `PhoneFrame`),
`ScreensCarousel`, `FaqGroups`.

**Structure Decision**: proyecto único de Next.js existente; el cambio vive en el CSS global
(contrato en [contracts/interaction-states.md](contracts/interaction-states.md)) y en clases de
los componentes listados.

## Orden sugerido de implementación

1. Tokens y clases en `globals.css` (US1: las 7 tarjetas existentes ya se ven con el efecto nuevo).
2. Paneles de `BusinessList` y `PartnerPanel` (US1, cobertura total).
3. `.card-arrow` en Atajos y rotación del ícono (US2).
4. Estado presionado táctil y verificación en iPhone (US3, research R5).
5. `PhoneFrame` con `.phone-hover` / `.phone-bezel` y foco del carrusel (US4).
6. Validación completa con [quickstart.md](quickstart.md).

## Complexity Tracking

Sin violaciones de la constitución.
