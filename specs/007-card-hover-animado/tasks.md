# Tasks: Hover animado y atractivo en todas las tarjetas del sitio

**Input**: Design documents from `/specs/007-card-hover-animado/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/interaction-states.md](contracts/interaction-states.md), [quickstart.md](quickstart.md)

**Tests**: la spec no pide tests automatizados y el proyecto no tiene suite; cada historia cierra con
una tarea de verificación manual según [quickstart.md](quickstart.md).

**Organization**: tareas agrupadas por historia de usuario. Casi todo el CSS vive en
`src/app/globals.css`, en la sección "Estados de interacción (spec 004)": las tareas que tocan ese
archivo NO son paralelas entre sí.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (archivo distinto, sin dependencias pendientes)
- **[Story]**: historia de la spec (US1–US4)

---

## Phase 1: Setup

- [ ] T001 Crear y cambiar a la rama `007-card-hover-animado` desde `main` (constitución: una rama por spec); no requiere instalar nada

---

## Phase 2: Foundational (bloquea todas las historias)

**Purpose**: tokens compartidos de movimiento y sombra (research R2, R3).

- [ ] T002 En `src/app/globals.css`, agregar antes del bloque de tema oscuro una regla `:root { --motion-hover-duration: 300ms; --motion-hover-ease: cubic-bezier(0.22, 1, 0.36, 1); }` con un comentario que explique que tarjetas y capturas comparten exactamente esta animación (spec 007 FR-006, FR-020) y que no depende del tema
- [ ] T003 En `src/app/globals.css`, redefinir `--elev-card-hover` en los TRES bloques de tema, agregando la capa de brillo derivada del primario (FR-017, sin hexadecimales nuevos): oscuro (`:root, [data-theme="dark"]`) → `0 2px 4px rgb(0 0 0 / 0.35), 0 24px 48px -16px rgb(0 0 0 / 0.7), 0 14px 36px -14px color-mix(in srgb, var(--primary) 35%, transparent)`; claro (`[data-theme="light"]` y `:root:not([data-theme])` dentro de `@media (prefers-color-scheme: light)`) → `0 2px 4px rgb(15 23 42 / 0.06), 0 20px 40px -12px rgb(15 23 42 / 0.2), 0 14px 36px -14px color-mix(in srgb, var(--primary) 25%, transparent)`. Actualizar el comentario "(spec 004)" a "(spec 004, brillo spec 007)"
- [ ] T004 En `src/app/globals.css`, agregar `--elev-phone-float` junto a `--elev-phone` en los TRES bloques de tema: oscuro → `0 4px 8px rgb(0 0 0 / 0.45), 0 56px 100px -24px rgb(0 0 0 / 0.75), 0 24px 60px -20px color-mix(in srgb, var(--primary) 35%, transparent)`; claro (ambos bloques) → `0 4px 8px rgb(15 23 42 / 0.1), 0 56px 100px -24px rgb(15 23 42 / 0.4), 0 24px 60px -20px color-mix(in srgb, var(--primary) 25%, transparent)`
- [ ] T005 En `src/app/globals.css`, en la regla compartida `.card-hover, .card-icon, .faq-toggle { transition-… }`, reemplazar `transition-duration: 200ms` por `var(--motion-hover-duration)` y `ease-out` por `var(--motion-hover-ease)`; actualizar el comentario de cabecera de la sección para decir que la spec 007 reemplaza los valores de la 004 (300 ms, elevación 5 px, brillo, giro de ícono) y listar las clases nuevas `.card-arrow`, `.phone-hover` y `.phone-bezel`

**Checkpoint**: tokens listos; las tarjetas existentes ya animan a 300 ms con la curva nueva y la sombra con brillo.

---

## Phase 3: User Story 1 - Las tarjetas responden de forma visible y suave al mouse (Priority: P1) 🎯 MVP

**Goal**: todas las tarjetas del inventario se elevan, muestran sombra con brillo y borde primario.

**Independent Test**: [quickstart.md](quickstart.md) pasos 1 y 2 en `/`, `/ayuda`, `/para-tu-negocio`, `/se-partner` (y `/en/...`), claro y oscuro.

- [ ] T006 [US1] En `src/app/globals.css`, cambiar `translate: 0 -3px` por `translate: 0 var(--card-lift, -5px)` en los DOS bloques de movimiento (`@media (prefers-reduced-motion: no-preference)` con `:has(:focus-visible)` y el combinado con `(hover: hover) and (pointer: fine)` con `:hover`); comentar que los paneles grandes fijan `--card-lift: -4px` (FR-005)
- [ ] T007 [P] [US1] En `src/components/sections/BusinessList.tsx`, agregar `card-hover [--card-lift:-4px]` al `className` de los DOS `div` "rounded-card border border-line bg-surface-2 p-6" (panel de problemas y panel de soluciones); no agregar `card-icon` a las alertas ni a los checks (FR-011)
- [ ] T008 [P] [US1] En `src/components/sections/PartnerPanel.tsx`, agregar `card-hover [--card-lift:-4px]` al `div` del panel "grid gap-10 rounded-[2rem] border border-accent/40 bg-surface-2 …"; el borde `accent/40` pasa a primario al resaltarse (research R7); no tocar los checks ni el botón
- [ ] T009 [US1] Verificar US1 con [quickstart.md](quickstart.md) pasos 1–2: elevación 5 px (paneles 4 px), borde primario, brillo visible sin parecer neón en oscuro, 300 ms en Computed, sin saltos al interrumpir, sin scroll horizontal a 360 px; ajustar el % del brillo en T003/T004 solo si se ve excesivo

**Checkpoint**: US1 entregable sola (MVP).

---

## Phase 4: User Story 2 - El contenido de la tarjeta acompaña el resaltado (Priority: P2)

**Goal**: el ícono crece, gira y se llena; la flecha de Atajos avanza.

**Independent Test**: pasar el mouse por el texto de una tarjeta lejos del ícono (Problemas, Beneficios, Atajos, guías de Ayuda).

- [ ] T010 [US2] En `src/app/globals.css`, en los DOS bloques de movimiento donde está `scale: 1.1` de `.card-icon`, agregar `rotate: -6deg` (FR-009, ≤ 6°)
- [ ] T011 [US2] En `src/app/globals.css`, crear `.card-arrow`: agregarla a la lista de la regla de transición compartida (T005) y, en los DOS bloques de movimiento, `.card-hover:has(:focus-visible) .card-arrow` / `.card-hover:hover .card-arrow` → `translate: 3px 0`; además `.card-hover .card-icon:has(.card-arrow) { rotate: 0deg; }` en esos mismos bloques (una flecha inclinada apunta mal, research R4). Comentar el porqué
- [ ] T012 [US2] En `src/components/sections/Shortcuts.tsx`, agregar `card-arrow` al `className` del `svg` de la flecha (hoy `size-4`); no agregar flechas a `HelpPage.tsx` (FR-010)
- [ ] T013 [US2] Verificar US2: ícono escala + gira y se llena de primario al pasar por cualquier parte de la tarjeta; en Atajos la flecha avanza 3 px y su contenedor no gira; checks, alertas y números de paso de Cómo funciona no cambian; contraste del ícono resaltado ≥ 3:1 en ambos temas

---

## Phase 5: User Story 3 - Teclado, táctil y movimiento reducido equivalentes (Priority: P2)

**Goal**: mismo resaltado con foco; hundimiento al presionar en táctil; nada se mueve con movimiento reducido.

**Independent Test**: [quickstart.md](quickstart.md) pasos 4, 5 y 6.

- [ ] T014 [US3] En `src/app/globals.css`, agregar el estado Presionado (FR-013a): `@media (hover: none) { .card-hover:active { border-color: var(--primary); transition-duration: 120ms; } .card-ghost.card-hover:active { background-color: var(--card-lit-bg, var(--surface)); } }` y `@media (hover: none) and (prefers-reduced-motion: no-preference) { .card-hover:active { scale: 0.98; } }`; comentar que `:active` se quita al soltar, cancelar o empezar el scroll (research R5)
- [ ] T015 [US3] En `src/components/sections/Shortcuts.tsx` y `src/components/pages/HelpPage.tsx`, agregar `[-webkit-tap-highlight-color:transparent]` al `className` del `Link` de cada tarjeta para que el gris del sistema no se superponga al hundimiento (depende de T012 en Shortcuts: misma línea de archivo, hacer después)
- [ ] T016 [US3] Verificar US3: Tab por Atajos, guías de Ayuda y panel de Sé partner (resaltado con foco, sin tabindex nuevos); `prefers-reduced-motion: reduce` (sin translate/scale/rotate); `forced-colors: active`; Android e iPhone reales (hundimiento, nada pegado tras scroll, un toque navega). Si en iPhone no hay hundimiento, aplicar el fallback de research R5 (atributo `ontouchstart=""` en el `<body>` del layout raíz) y documentarlo con un comentario

---

## Phase 6: User Story 4 - Las capturas de la app flotan (Priority: P2)

**Goal**: el teléfono hace zoom 4%, muestra anillo primario y sombra flotante en hero, Funcionalidades y guías.

**Independent Test**: [quickstart.md](quickstart.md) paso 3.

- [ ] T017 [US4] En `src/app/globals.css`, crear las clases del contrato ([contracts/interaction-states.md](contracts/interaction-states.md)): `.phone-hover, .phone-bezel` en la regla de transición compartida (propiedades `scale` y `box-shadow`); `.phone-bezel { box-shadow: 0 0 0 1px var(--border), var(--elev-phone); }` (reposo idéntico a hoy); resaltado `box-shadow: 0 0 0 2px var(--primary), var(--elev-phone-float)` en `@media (hover: hover) and (pointer: fine) { .phone-hover:hover .phone-bezel }` y en `[data-carousel]:has(:focus-visible) .phone-bezel`; `scale: 1.04` en `.phone-hover:hover` y `[data-carousel]:has(:focus-visible) .phone-hover` solo dentro de `prefers-reduced-motion: no-preference`; Presionado táctil en `@media (hover: none)`: `.phone-hover:active .phone-bezel` anillo primario y, sin movimiento reducido, `.phone-hover:active { scale: 0.98; }` con 120 ms
- [ ] T018 [US4] En `src/components/sections/PhoneMockup.tsx` (`PhoneFrame`): agregar `phone-hover` al `div` exterior (`relative ${className}`) y, en el bisel, reemplazar `shadow-phone ring-1 ring-line` por `phone-bezel`; actualizar el comentario de `PhoneFrame` (hover de spec 007, el zoom se aplica al teléfono completo, FR-021). No tocar `ScreensCarousel.tsx`, `FeatureGroups.tsx` ni `GuideSteps.tsx`
- [ ] T019 [US4] Verificar US4: hero, `/funcionalidades` y una guía; zoom ~4%, anillo primario 2 px, sombra flotante en ambos temas; el texto de la fila no reacciona; el carrusel pausa con el mouse y sigue igual (avance, botones, indicadores); Tab en los controles del carrusel resalta el teléfono; captura pendiente (placeholder) se comporta igual; reposo idéntico a antes del cambio

---

## Phase 7: Polish & Cross-Cutting

- [ ] T020 [P] Actualizar `specs/004-hover-interaction-states/contracts/interaction-states.md` con una nota al inicio: "Valores reemplazados por la spec 007; ver specs/007-card-hover-animado/contracts/interaction-states.md"
- [ ] T021 Ejecutar `npm run lint` y `npm run build` sin errores ni warnings nuevos
- [ ] T022 Revisión final con [quickstart.md](quickstart.md) pasos 7–8: CLS 0, contraste ≥ 3:1 de bordes e íconos en ambos temas, sin scroll horizontal a 360 px, Lighthouse móvil en `/`, `/funcionalidades` y `/para-tu-negocio` con Performance ≥ 90 y Accessibility ≥ 95; ambos idiomas
- [ ] T023 Commit en Conventional Commits (`style: hover animado en tarjetas y capturas (spec 007)`) en la rama `007-card-hover-animado`

---

## Dependencies & Execution Order

- **Setup (T001)** → **Foundational (T002–T005)** → historias.
- **US1 (T006–T009)**: depende solo de Foundational. MVP.
- **US2 (T010–T013)**: depende de T005 (lista de transición). Independiente de US1 en archivos de componentes, pero comparte `globals.css`.
- **US3 (T014–T016)**: depende de Foundational; T015 va después de T012 (mismo archivo `Shortcuts.tsx`).
- **US4 (T017–T019)**: depende de T002 y T004; independiente de US1–US3.
- **Polish (T020–T023)**: al final; T020 en cualquier momento.

### Parallel Opportunities

- T007 y T008 (archivos distintos) en paralelo, mientras otra persona hace T006 en `globals.css`.
- T018 (`PhoneMockup.tsx`) en paralelo con cualquier tarea de componentes de US1–US3.
- T020 (documentación) en paralelo con todo.
- Las tareas en `globals.css` (T002–T006, T010, T011, T014, T017) son secuenciales.

### Parallel Example: User Story 1

```text
Tarea A: T007 BusinessList.tsx (card-hover en los 2 paneles)
Tarea B: T008 PartnerPanel.tsx (card-hover en el panel)
```

## Implementation Strategy

### MVP First (User Story 1)

1. T001 → T002–T005 → T006–T008.
2. Verificar con T009: el owner ya ve el efecto nuevo en todas las tarjetas.
3. Se puede mostrar o desplegar aquí.

### Incremental Delivery

1. US1 (tarjetas) → US2 (ícono y flecha) → US3 (táctil y accesibilidad) → US4 (capturas).
2. Cada historia se verifica sola antes de seguir; US4 puede adelantarse si se prioriza lo visual de las capturas.
