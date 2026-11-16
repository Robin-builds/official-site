# Tasks: Más contraste y bordes naranjos en el tema claro

**Input**: Design documents from `/specs/008-tema-claro-contraste/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/theme-tokens.md](contracts/theme-tokens.md), [quickstart.md](quickstart.md)

**Tests**: la spec no pide tests automatizados y el proyecto no tiene suite. Se crea un verificador
de contraste en Node sin dependencias (plan, Testing) y cada historia cierra con una verificación
manual según [quickstart.md](quickstart.md).

**Organization**: tareas agrupadas por historia. Los tokens viven en `src/app/globals.css`: las
tareas que tocan ese archivo NO son paralelas entre sí. El tema claro está declarado DOS veces
(`[data-theme="light"]` y `:root:not([data-theme])` dentro de `@media (prefers-color-scheme: light)`):
toda tarea que cambia un valor claro lo cambia en AMBOS bloques con el mismo valor (FR-011, V2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (archivo distinto, sin dependencias pendientes)
- **[Story]**: historia de la spec (US1–US3)

---

## Phase 1: Setup

- [X] T001 Rama `008-tema-claro-contraste` creada desde `main` (constitución: una rama por spec); no requiere instalar nada
- [ ] T002 [P] Crear `specs/008-tema-claro-contraste/contrast-check.mjs` (Node, sin dependencias, módulo ES): (a) leer `src/app/globals.css`; (b) extraer los pares `--nombre: #hex;` del bloque `[data-theme="light"] { … }` y del bloque `:root:not([data-theme]) { … }`; (c) imprimir "bloques claros idénticos: OK" o la lista de diferencias, ignorando comentarios y espacios; (d) calcular contraste WCAG 2.x (luminancia relativa sRGB) de cada par de la tabla "Pares obligatorios" de [contracts/theme-tokens.md](contracts/theme-tokens.md) con los valores del bloque `[data-theme="light"]` (fondos F = `--bg-top`, `--bg-mid`, `--bg-bottom`, `--surface`, `--surface-2`) e imprimir `PASS`/`FAIL` con la razón a 2 decimales; (e) calcular también la diferencia de color ΔE (CIE76 en CIELAB, iluminante D65) para la tabla "Secciones vecinas reales" del contrato e imprimir PASS si contraste ≥ 1.08 o ΔE ≥ 10 (SC-002); (f) terminar con código 1 si hay algún FAIL o diferencia. Comentario de cabecera explicando qué verifica y por qué (FR-004, FR-007, FR-011, SC-001–SC-003). Con los tokens actuales debe fallar (es la línea base)

---

## Phase 2: Foundational (bloquea US2 y US3)

**Purpose**: los dos tokens nuevos, con valores que dejan el tema oscuro idéntico (research R3, data-model V1).

- [ ] T003 En `src/app/globals.css`, bloque `:root, [data-theme="dark"]`, agregar después de `--border`: `--card-border: var(--border);` y después de `--accent-text`: `--card-accent: var(--primary);`, con un comentario: "Bordes de tarjeta (spec 008): en oscuro son los mismos de siempre; el tema claro los cambia a naranjo"
- [ ] T004 En `src/app/globals.css`, agregar a `@theme inline` (después de `--color-line`) `--color-card-line: var(--card-border);` y `--color-card-accent: var(--card-accent);` para exponer las utilidades `border-card-line` y `border-card-accent`

**Checkpoint**: `npm run build` sin errores; nada cambia visualmente en ningún tema.

---

## Phase 3: User Story 1 - Distinguir secciones y tarjetas en el tema claro (Priority: P1) 🎯 MVP

**Goal**: tres niveles de superficie distinguibles y todo texto en AA (FR-001, FR-002, FR-004).

**Independent Test**: [quickstart.md](quickstart.md) pasos 2 (sin la parte de `--card-*`) y 3 (primer punto): página gris, secciones blancas alternas visibles, textos legibles.

- [ ] T005 [US1] En `src/app/globals.css`, en AMBOS bloques claros, cambiar: `--bg-top: #e9edf2`, `--bg-mid: #e3e8ee`, `--bg-bottom: #dce2e9`, `--surface-2: #f8dcb8`, `--border: #c3cdd9` (`--surface` sigue `#ffffff`). Agregar un comentario sobre `--bg-top`: "Página gris y superficies blancas: en claro canvas y surface eran el mismo blanco y las secciones no alternaban (spec 008 R1)". Sobre `--surface-2`: "durazno derivado del naranjo de marca: 1.32:1 contra blanco, 1.12:1 contra canvas (spec 008 R7)"
- [ ] T006 [US1] En `src/app/globals.css`, en AMBOS bloques claros, cambiar los colores de texto y semánticos para mantener AA sobre los nuevos grises (research R2): `--text-3: #526072`, `--primary: #155e75`, `--primary-hover: #164e63`, `--link: #155e75`, `--accent-text: #92400e`, `--danger: #b91c1c`, `--ok: #065f46`. Reemplazar el comentario de `--text-muted-on-2` ("text-3 sobre #F1F5F9 da 4.34:1…") por uno vigente: "text-3 cumple AA en todos los fondos claros (≥ 4.8:1); se mantiene text-2 como auxiliar sobre surface-2". No tocar `--accent` (#f0921e, decorativo), `--on-primary`, `--on-ok` ni `--qr-bg`
- [ ] T007 [US1] En `src/app/globals.css`, en AMBOS bloques claros, reforzar `--elev-card` a `0 1px 2px rgb(15 23 42 / 0.06), 0 8px 24px -12px rgb(15 23 42 / 0.18)` (research R2: sombras levemente más marcadas, misma forma)
- [ ] T008 [US1] Correr `node specs/008-tema-claro-contraste/contrast-check.mjs`: los pares de texto, `surface`/`bg-top` (≥ 1.15), `surface`/`surface-2` (≥ 1.10) y `bg-bottom`/`bg-top` (≥ 1.08) en PASS y bloques idénticos; los pares de `--card-border`/`--card-accent` pueden fallar aún (no hay valor claro). Luego verificar a ojo con [quickstart.md](quickstart.md) paso 3 en Inicio, Funcionalidades, Ayuda, Contacto y 404, en es y en, a 360 y 1440 px

**Checkpoint**: MVP: el tema claro ya tiene contraste entre secciones y tarjetas.

---

## Phase 4: User Story 2 - Bordes naranjos como identidad del tema claro (Priority: P1)

**Goal**: borde naranjo claro en reposo y naranjo oscuro + brillo cálido al resaltar; oscuro intacto (FR-003, FR-005, FR-006, FR-007, FR-009).

**Independent Test**: [quickstart.md](quickstart.md) pasos 2 (completo), 3 (tarjetas y capturas) y 5 (oscuro sin cambios).

- [ ] T009 [US2] En `src/app/globals.css`, en AMBOS bloques claros, agregar después de `--border`: `--card-border: #f2a240;` (comentario: "≈ 85% naranjo de marca + blanco; ≥ 1.5:1 contra canvas, surface y surface-2") y después de `--accent-text`: `--card-accent: #b45309;` (comentario: "naranjo oscuro de la familia del naranjo de marca; ≥ 3:1 contra todos los fondos claros, el naranjo puro no llega")
- [ ] T010 [US2] En `src/app/globals.css`, en los TRES bloques de tema, cambiar `var(--primary)` por `var(--card-accent)` dentro de `--elev-card-hover` y `--elev-phone-float` (la capa `color-mix(in srgb, var(--primary) NN%, transparent)`), conservando los porcentajes (35% oscuro, 25% claro). En oscuro el resultado es idéntico porque `--card-accent` = `--primary`
- [ ] T011 [US2] En `src/app/globals.css`, sección "Estados de interacción", cambiar `var(--primary)` por `var(--card-accent)` SOLO en: `.card-hover:has(:focus-visible) { border-color }`, `[data-carousel]:has(:focus-visible) .phone-bezel { box-shadow: 0 0 0 2px … }`, `.card-hover:hover { border-color }`, `.phone-hover:hover .phone-bezel { box-shadow: 0 0 0 2px … }`, `.card-hover:active { border-color }` y `.phone-hover:active .phone-bezel { box-shadow: 0 0 0 2px … }`. NO cambiar `.card-icon` (relleno), `.faq-toggle` ni `:focus-visible` global (research R4: el foco sigue cian). Actualizar el comentario de cabecera: ".card-hover … borde de acento de tarjeta (--card-accent: primario en oscuro, naranjo oscuro en claro, spec 008)"
- [ ] T012 [P] [US2] En `src/components/sections/Problems.tsx`, en el `li` "card-hover flex gap-4 rounded-card border border-line bg-surface …", cambiar `border-line` por `border-card-line`
- [ ] T013 [P] [US2] En `src/components/sections/Testimonials.tsx`, en el `figure` "card-hover h-full rounded-card border border-line bg-surface …", cambiar `border-line` por `border-card-line`
- [ ] T014 [P] [US2] En `src/components/sections/Shortcuts.tsx`, en el `li` "card-hover rounded-card border border-line bg-surface-2", cambiar `border-line` por `border-card-line`
- [ ] T015 [P] [US2] En `src/components/sections/BusinessList.tsx`, en los DOS `div` "card-hover rounded-card border border-line bg-surface-2 p-6 [--card-lift:-4px]", cambiar `border-line` por `border-card-line`
- [ ] T016 [P] [US2] En `src/components/pages/HelpPage.tsx`, en el `li` "card-hover rounded-card border border-line bg-surface-2", cambiar `border-line` por `border-card-line`
- [ ] T017 [P] [US2] En `src/components/sections/FaqGroups.tsx`, en el `div` "mt-6 divide-y divide-line rounded-card border border-line bg-surface-2 …", cambiar SOLO `border-line` por `border-card-line` (los divisores siguen en `divide-line`)
- [ ] T018 [P] [US2] En `src/components/sections/ContactForm.tsx`, en el `p` del aviso sin JavaScript "mb-6 rounded-card border border-line bg-surface-2 p-4 text-fg", cambiar `border-line` por `border-card-line`. NO tocar `inputClass` ni `border-danger`/`border-line` de los campos
- [ ] T019 [P] [US2] En `src/components/sections/ContactAlternatives.tsx`, en el `div` "rounded-card border border-line bg-qr-bg p-3", cambiar `border-line` por `border-card-line` (el fondo del QR sigue `bg-qr-bg` blanco)
- [ ] T020 [US2] Verificar US2: `node specs/008-tema-claro-contraste/contrast-check.mjs` todo PASS y bloques idénticos; [quickstart.md](quickstart.md) paso 3 (hover y Tab sobre tarjetas, tarjetas fantasma de Beneficios/Cómo funciona/Credibilidad, capturas del hero y de Funcionalidades), paso 5 (capturas de oscuro idénticas a `main`, incluido el CTA final) , paso 6 (movimiento reducido y táctil) y el caso límite de foco: con Tab, el anillo de foco cian se distingue del borde naranjo oscuro de la tarjeta

**Checkpoint**: el tema claro tiene identidad naranja; el oscuro sigue igual.

---

## Phase 5: User Story 3 - Coherencia del naranjo en el resto de elementos con borde (Priority: P3)

**Goal**: los chips que ya cambiaban de borde al resaltarse usan el acento de tarjeta (FR-008).

**Independent Test**: [quickstart.md](quickstart.md) paso 3: hover en un chip del índice de Funcionalidades (naranjo oscuro en claro, cian en oscuro); error en un campo de Contacto sigue rojo.

- [ ] T021 [US3] En `src/components/sections/FeatureIndex.tsx`, en el enlace-chip "inline-flex min-h-11 … border border-line bg-surface … hover:border-primary hover:text-primary", cambiar `hover:border-primary` por `hover:border-card-accent` (el texto sigue `hover:text-primary`; en oscuro el borde sigue cian porque `--card-accent` = `--primary`)
- [ ] T022 [US3] Verificar US3 con [quickstart.md](quickstart.md) paso 3 (chip y error de formulario) en claro y oscuro, es y en

---

## Phase 6: Polish & Cross-Cutting

- [ ] T023 Correr `npm run build`: sin errores ni warnings nuevos (Principio VI)
- [ ] T024 [quickstart.md](quickstart.md) paso 4: sin JavaScript y con `prefers-color-scheme: light`, Inicio y Contacto se ven idénticos al tema claro elegido a mano (FR-011)
- [ ] T025 [quickstart.md](quickstart.md) paso 7: Lighthouse móvil en tema claro sobre TODAS las páginas en español (Inicio, Funcionalidades, Para tu negocio, Ayuda, una guía, Sé partner, Descargar, Contacto, Privacidad) y sobre Inicio, Funcionalidades y Contacto en inglés: Accessibility ≥ 95, Performance ≥ 90, SEO ≥ 95 en cada una (SC-004; constitución, Principio VI y criterio "cada página afectada": el cambio de tokens afecta todas)
- [ ] T026 Revisar `git diff main -- src/components`: solo cambian clases de borde (`border-line` → `border-card-line`, `hover:border-primary` → `hover:border-card-accent`) y ningún color literal (Principio III, FR-012)
- [ ] T027 Mostrar Inicio en tema claro al owner y confirmar que identifica secciones y tarjetas en menos de 3 s y reconoce el naranjo como acento (SC-006); luego commit en Conventional Commits en la rama `008-tema-claro-contraste`: `docs:` para la spec/plan/tasks y `style:` para tokens y clases (merge a `main` solo con la aprobación del owner)

---

## Dependencies & Execution Order

- **Setup (T001–T002)**: T002 es independiente y puede hacerse en paralelo con Phase 2.
- **Foundational (T003–T004)**: antes de US2 y US3 (crean `--card-*` y sus utilidades). US1 no depende de ellas.
- **US1 (T005–T008)**: solo depende de T002 para su verificación. Es el MVP.
- **US2 (T009–T020)**: depende de T003–T004. T009–T011 tocan `globals.css` (secuenciales); T012–T019 son archivos distintos, todos [P] entre sí y con T009–T011.
- **US3 (T021–T022)**: depende de T004; independiente de US1 y US2.
- **Polish (T023–T027)**: al final.

Orden sugerido en un solo agente: T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012…T019 → T020 → T021 → T022 → T023…T027.

## Parallel Example: User Story 2

```text
# Con T003–T004 listos, en paralelo:
T012 Problems.tsx   T013 Testimonials.tsx   T014 Shortcuts.tsx   T015 BusinessList.tsx
T016 HelpPage.tsx   T017 FaqGroups.tsx      T018 ContactForm.tsx T019 ContactAlternatives.tsx
# Mientras otro hilo hace T009 → T010 → T011 en globals.css
```

## Implementation Strategy

1. **MVP (US1)**: T001–T008. Solo con esto el tema claro deja de verse "lavado": página gris,
   secciones alternas y tarjetas que se distinguen, textos en AA.
2. **Identidad (US2)**: T009–T020. Bordes naranjos en reposo y naranjo oscuro al resaltar; el oscuro se
   verifica idéntico.
3. **Coherencia (US3)**: T021–T022.
4. **Cierre**: T023–T027 y revisión del owner antes del merge.
