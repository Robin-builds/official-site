---

description: "Tareas de la spec 010: refinamiento de conversión del sitio oficial"
---

# Tasks: Refinamiento de conversión del sitio oficial

**Input**: documentos de diseño en `specs/010-refinamiento-conversion/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: SÍ. La spec es el verificador: cada criterio automático (SC-001 a SC-011) tiene un test
e2e (Playwright + axe-core, aprobado por el owner; research R8). En cada historia los tests se
escriben primero y deben **fallar** contra el código actual antes de implementar.

**Organization**: tareas agrupadas por historia de usuario; cada una se puede probar por separado.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (otro archivo, sin depender de tareas pendientes)
- **[Story]**: historia a la que pertenece (US1 a US5)
- Rutas relativas a la raíz del repo

## Reglas para todas las tareas

- Los títulos de los tests empiezan con el id del SC (`test("SC-005 …")`). El test de trazabilidad
  depende de eso.
- Selectores por rol, `aria-label` o texto del contenido, nunca por clases de Tailwind
  ([contracts/verification.md](./contracts/verification.md), "Reglas").
- No se cambia copy (A-4). Colores y separaciones solo con tokens de `src/app/globals.css`
  (Principio III).
- Comentarios inline en todo bloque no obvio, en español, explicando qué hace y por qué.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: instalar y configurar la suite e2e.

- [x] T001 Pedir confirmación al owner y, con su OK, ejecutar `npm install -D @playwright/test @axe-core/playwright` y `npx playwright install chromium`. Verificar antes con Context7 la versión actual y la API de `@playwright/test` (`defineConfig`, `webServer`, `use.viewport`, `reducedMotion`) y de `@axe-core/playwright` (`new AxeBuilder({ page }).include().withRules(["color-contrast"]).analyze()`). Queda registrado en `package.json`
- [ ] T002 Crear `playwright.config.ts` en la raíz: `testDir: "tests/e2e"`, solo el proyecto Chromium, `use.baseURL: "http://localhost:3100"`, `webServer: { command: "npm run build && npm run start -- -p 3100", url: "http://localhost:3100", reuseExistingServer: !process.env.CI, timeout: 180_000 }`, `reporter: [["list"], ["html", { open: "never" }]]`
- [ ] T003 [P] Agregar el script `"test:e2e": "playwright test"` en `package.json`, y en `.gitignore` las entradas `/test-results/`, `/playwright-report/` y `/playwright/.cache/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: utilidades compartidas por todos los tests y el test de trazabilidad.

**⚠️ CRITICAL**: ninguna historia empieza sin esta fase.

- [ ] T004 Crear `tests/e2e/fixtures.ts` con:
  - (a) `VIEWPORTS = { w360: {width:360,height:800}, w390: {width:390,height:844}, w1023: {width:1023,height:768}, w1024: {width:1024,height:768}, w1440: {width:1440,height:900} }`;
  - (b) `setTheme(page, theme: "light" | "dark")`, con `page.addInitScript` que escribe `localStorage.setItem("storeflow-theme", theme)` antes de cargar (la clave sale de `src/components/ui/theme.ts`, `THEME_STORAGE_KEY`);
  - (c) `publishedRoutes("es")`, que importa el registro de `src/content/site.ts` y `pageHref`/`isPublished` de `src/lib/i18n.ts` y devuelve las rutas publicadas en español. Si el import de TS con alias `@/` no resuelve en Playwright, replicar el alias en `playwright.config.ts` o usar rutas relativas;
  - (d) `gotoReady(page, path)`, que navega y espera `document.fonts.ready`;
  - (e) la constante `CTA_LABEL`, tomada de `ui.es.nav.cta.label` en `src/content/site.ts` (no escrita a mano).
- [ ] T005 Crear `tests/e2e/traceability.spec.ts`: lee `specs/010-refinamiento-conversion/spec.md`, extrae los `FR-0NN` definidos en "Functional Requirements" y las filas de la tabla "Trazabilidad requisito → criterio". Falla si algún FR no tiene fila. Para cada SC marcado `auto` en la sección "Measurable Outcomes", busca en `tests/e2e/*.spec.ts` un título de test que empiece con ese id y falla si no existe. Título: `"Trazabilidad FR → SC"`
- [ ] T006 Ejecutar `npm run test:e2e` y confirmar que la configuración levanta el servidor en :3100 y que el test de trazabilidad corre (en este punto falla por los SC aún sin test: es lo esperado)

**Checkpoint**: la suite corre; se pueden escribir los tests de cada historia.

---

## Phase 3: User Story 1 - Encabezado que no distrae (Priority: P1) 🎯 MVP

**Goal**: con ≥ 1024px el encabezado tiene solo logo, Funcionalidades, Para tu negocio, Planes,
Ingresar y "Pruébala gratis". FAQ, Ayuda, Contacto y el selector de tema solo están en el pie.

**Independent Test**: `npx playwright test tests/e2e/header.spec.ts tests/e2e/footer.spec.ts -g "SC-001|SC-002|SC-009"`

### Tests for User Story 1 ⚠️ (escribir primero; deben fallar)

- [ ] T007 [P] [US1] En `tests/e2e/header.spec.ts`, test `"SC-001 …"`: para cada ruta de `publishedRoutes("es")` × {w1024, w1440} × light, `page.getByRole("banner").getByRole("navigation", { name: "Navegación principal" }).getByRole("link")` tiene exactamente 3 elementos con textos `["Funcionalidades", "Para tu negocio", "Planes"]` en ese orden. Tomar los textos de `navLabel` del registro
- [ ] T008 [P] [US1] En `tests/e2e/header.spec.ts`, test `"SC-002 …"`: en cada ruta × {w1024, w1440} y × w390 con el menú abierto (clic en el `summary` del encabezado), dentro de `getByRole("banner")` hay 0 elementos con el nombre accesible del ThemeToggle (`ui.es.a11y.themeToggle`) y 0 enlaces cuyo `href` sea la ruta de `faq`, `help` o `contact` (`pageHref(key, "es")`)
- [ ] T009 [P] [US1] Crear `tests/e2e/footer.spec.ts`, test `"SC-009 …"`: en cada ruta × w1440, `getByRole("contentinfo")` contiene un enlace a cada ruta de `publishedRoutes("es")` (incluida Inicio), uno a `URLS.webAppLogin` y uno de privacidad (`pageHref("privacy","es")` si está publicada, si no `URLS.privacyPolicy`); `URLS` sale de `src/content/site.ts`

### Implementation for User Story 1

- [ ] T010 [US1] En `src/content/site.ts`, cambiar a `inNav: false` las páginas `faq`, `help` y `contact`, con un comentario que cite spec 010 FR-001/FR-002 ("Ya no en el encabezado: solo en el pie"). Debe quedar, según data-model.md: "Exactamente 3 páginas con `inNav: true` y `published: true`, en el orden features → business → plans"
- [ ] T011 [US1] En `src/components/layout/Navbar.tsx`:
  - (a) quitar `<ThemeToggle>` del grupo de escritorio y del panel del menú móvil, y su import. En el panel, la fila final queda solo con `{languageSwitch}`; si es `null`, la fila no se renderiza;
  - (b) cambiar `hidden xl:block` → `hidden lg:block`, `hidden items-center gap-2 xl:flex` → `hidden items-center gap-2 lg:flex` y `xl:hidden` → `lg:hidden` (research R2);
  - (c) reescribir el comentario JSDoc con el nuevo contrato: ≥ 1024px marca · 3 páginas · Ingresar (ghost) · ES/EN · CTA; < 1024px marca · CTA · menú (páginas, CTA, Ingresar, ES/EN). Citar spec 010 y contracts/header-footer.md.
- [ ] T012 [P] [US1] En `src/components/layout/MobileMenu.tsx`, actualizar el comentario "Menú desplegable bajo 1024 px (research R3)" para citar spec 010 R2 (corte `lg` = 1024px). Sin cambios de lógica
- [ ] T013 [P] [US1] En `src/components/layout/Footer.tsx`, actualizar el comentario del selector de tema: ahora es el único lugar donde está (spec 010 FR-003). Sin cambios de estructura
- [ ] T014 [US1] Correr `npx playwright test -g "SC-001|SC-002|SC-009"` hasta verde

**Checkpoint**: US1 lista y demostrable sola (el MVP de la feature).

---

## Phase 4: User Story 2 - Celular sin fricción (Priority: P1)

**Goal**: sin scroll horizontal entre 360 y 1023px; bajo 1024px, el menú hamburguesa abre y cierra
y "Pruébala gratis" sigue visible.

**Independent Test**: `npx playwright test tests/e2e/responsive.spec.ts tests/e2e/header.spec.ts -g "SC-003|SC-004"`

### Tests for User Story 2 ⚠️

- [ ] T015 [P] [US2] Crear `tests/e2e/responsive.spec.ts`, test `"SC-003 …"`: para cada ruta × {w360, w390, w1023} × light, `await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)` es `true`. Si falla, el mensaje dice la ruta y el ancho
- [ ] T016 [US2] En `tests/e2e/header.spec.ts`, test `"SC-004 …"`: en `/` × {w390, w1023}:
  - clic en el `summary` del encabezado → el `details` tiene `open`; clic de nuevo → sin `open`;
  - abrir y presionar Escape → sin `open`;
  - con foco en el `summary`, Enter → `open`;
  - con el menú cerrado, el enlace `getByRole("banner").getByRole("link", { name: CTA_LABEL })` visible está dentro del viewport (`boundingBox` con `y >= 0` y `x + width <= viewport.width`).

  Va después de T007/T008 porque es el mismo archivo.

### Implementation for User Story 2

- [ ] T017 [US2] Correr `npx playwright test -g "SC-003|SC-004"`. Con T011 ya hecho, el corte a 1024px debería cumplir. Si SC-003 falla a 1023px u otro ancho, encontrar el elemento que desborda (`[...document.querySelectorAll("*")].filter(e => e.getBoundingClientRect().right > innerWidth)`) y corregirlo en su componente con utilidades responsivas (sin `overflow-x: hidden` global, que solo oculta el síntoma)
- [ ] T018 [US2] Verificar a 360px (SC-003) que el logo, "Pruébala gratis" y el botón de menú caben en `src/components/layout/Navbar.tsx` sin desbordar (caso borde "Etiquetas largas a 360px"); ajustar solo espaciados si hace falta

**Checkpoint**: US1 y US2 en verde por separado.

---

## Phase 5: User Story 3 - Apariencia consistente (Priority: P2)

**Goal**: los tres "Pruébala gratis" (encabezado, hero, cierre) tienen el mismo color en cada tema:
teal `#155e75` en claro y cian `#2ec6da` en oscuro.

**Independent Test**: `npx playwright test tests/e2e/cta.spec.ts tests/e2e/a11y.spec.ts`

### Tests for User Story 3 ⚠️

- [ ] T019 [P] [US3] Crear `tests/e2e/cta.spec.ts`, test `"SC-005 …"`: en `/` × w1440 × {light, dark}, recorrer `page.getByRole("link", { name: CTA_LABEL, exact: false })` filtrando los visibles (con `scrollIntoViewIfNeeded`), leer `getComputedStyle(el).backgroundColor` de cada uno y afirmar que hay ≥ 3 enlaces, que el `Set` de colores tiene tamaño 1 y que ese color es `rgb(21, 94, 117)` en light y `rgb(46, 198, 218)` en dark. Usar `exact: false` porque el CTA del hero lleva un ícono
- [ ] T020 [P] [US3] Crear `tests/e2e/a11y.spec.ts`, test `"SC-006 …"`: en `/` × {w1440, w390 con el menú abierto} × {light, dark}, `new AxeBuilder({ page }).include("header").include("section[aria-labelledby='cta-final-title']").withRules(["color-contrast"]).analyze()` da `violations.length === 0`. Si falla, el mensaje lista `target` y `failureSummary`

### Implementation for User Story 3

- [ ] T021 [US3] En `src/app/globals.css`, después del bloque `:root, [data-theme="dark"]` y de los bloques claros, agregar una regla **separada** `:root { --page-primary: var(--primary); --page-primary-hover: var(--primary-hover); --page-on-primary: var(--on-primary); }`. El comentario debe explicar que una propiedad personalizada se resuelve en `<html>` y los descendientes heredan el color ya resuelto, y que no puede ir dentro de `:root, [data-theme="dark"]` porque ese selector también calza con el bloque de cierre (research R4)
- [ ] T022 [US3] En `src/app/globals.css`, agregar la clase `.page-primary { --primary: var(--page-primary); --primary-hover: var(--page-primary-hover); --on-primary: var(--page-on-primary); }` y `.page-primary :focus-visible { outline-color: var(--text-1); }`. Comentario: el teal sobre la tinta da ~2.5:1, bajo los 3:1 de un indicador de foco (research R4). Depende de T021
- [ ] T023 [US3] En `src/components/sections/FinalCta.tsx`, agregar `page-primary` al `div` que envuelve el `<Button>` (`className="page-primary mt-9 flex justify-center"`) y actualizar el JSDoc: el bloque fuerza tokens oscuros, salvo el botón, que toma el primario del tema de la página (spec 010 FR-008)
- [ ] T024 [US3] Correr `npx playwright test -g "SC-005|SC-006"` hasta verde, en ambos temas. Revisar también a mano que el foco con Tab sobre el botón del cierre se vea en tema claro

**Checkpoint**: US3 en verde; el cierre de las páginas internas (que usan `FinalCta`) queda corregido también.

---

## Phase 6: User Story 4 - Mensaje en el primer viewport (Priority: P2)

**Goal**: título, bajada y CTA del hero visibles sin desplazarse a 1440×900 y 390×844; sin hueco
superior mayor que la separación estándar; sin texto visible bajo el teléfono.

**Independent Test**: `npx playwright test tests/e2e/hero.spec.ts`

### Tests for User Story 4 ⚠️

- [ ] T025 [P] [US4] Crear `tests/e2e/hero.spec.ts`, test `"SC-007 …"`: en `/` × {w1440 (1440×900), w390 (390×844)} × light, sin desplazar, `#hero-title`, el `p` de la bajada (primer `p` después de `#hero-title` dentro de `section#<hero.id>`) y el enlace CTA del hero (`section[aria-labelledby="hero-title"]` → `getByRole("link", { name: CTA_LABEL, exact: false })`) tienen `boundingBox` con `y >= 0` y `y + height <= viewport.height`
- [ ] T026 [US4] En `tests/e2e/hero.spec.ts`, test `"SC-011 …"`: en `/` × {w390, w1440}, la distancia `primerHijoDeLaColumnaDeTexto.top − banner.bottom` es ≤ al valor en px de `--spacing-section`. Para leerlo, un elemento temporal con `style.height = "var(--spacing-section)"` y su `getBoundingClientRect().height`
- [ ] T027 [US4] En `tests/e2e/hero.spec.ts`, test `"SC-010 …"` (sin `reducedMotion`): en `/` × w1440, para cada punto del carrusel (`section[data-carousel] button[aria-current], button[aria-label]` con `aria-label` de `goTo`) hacer clic y afirmar que (a) el texto visible de `section[data-carousel]`, excluyendo `.sr-only` y los nombres de los botones (`innerText` de los nodos que no son `button` ni `.sr-only`), es vacío, y (b) la región `[aria-live="polite"]` contiene la descripción (`caption`) de esa captura, tomada de `inicio.es.hero.screens` en `src/content/inicio.ts`

### Implementation for User Story 4

- [ ] T028 [US4] En `src/components/sections/ScreensCarousel.tsx`, eliminar el `<p>` "Leyenda fuera de la pantalla" (número y caption visibles) y ajustar el `mt-1` de la fila de controles a `mt-4` para conservar la distancia al teléfono. Mantener sin cambios la prop `captions`, `copy.goTo`, `copy.announce` y la región `aria-live` (research R5). Comentario: spec 010 FR-011, descripción solo para lectores
- [ ] T029 [P] [US4] En `src/app/globals.css`, borrar `.carousel-caption-in` y `@keyframes carousel-caption-in`, que quedan sin uso tras T028 (confirmar con una búsqueda en `src/` que no hay otros usos)
- [ ] T030 [US4] En `src/components/sections/Hero.tsx`, en la `className` del `Container`, cambiar `items-center` → `items-start` en `lg` (`grid items-center … lg:items-start`) y bajar el padding superior a `pt-8 sm:pt-12 lg:pt-12`. Al `div` del teléfono agregar `lg:mt-4` para equilibrar los bordes superiores (research R6). Actualizar el JSDoc citando spec 010 FR-010
- [ ] T031 [US4] Correr `npx playwright test tests/e2e/hero.spec.ts`. Si SC-007 o SC-011 fallan, ajustar en `src/components/sections/Hero.tsx` solo los paddings y márgenes de T030 (no los tamaños de texto, porque A-4 no cambia el copy ni su jerarquía) hasta verde a 390×844 y 1440×900, y revisar a 1024×768 que el hero no se vea roto

**Checkpoint**: US4 en verde.

---

## Phase 7: User Story 5 - Flujo sin vacíos (Priority: P3)

**Goal**: la misma separación entre secciones de contenido contiguas de Inicio, y sin franja vacía
bajo el bloque de cierre.

**Independent Test**: `npx playwright test tests/e2e/rhythm.spec.ts`

### Tests for User Story 5 ⚠️

- [ ] T032 [P] [US5] Crear `tests/e2e/rhythm.spec.ts`, test `"SC-008 …"`: en `/` × {w360, w1440} × light, tomar en orden las `main > section` posteriores a la franja de credibilidad (`section[aria-labelledby="credibilidad-title"]`) y que tengan contenido visible. Para cada par contiguo (A, B), medir la separación como `B.firstContent.top − A.lastContent.bottom`, donde "contenido" es el primer o último hijo del `div` contenedor de la sección; en el cierre es el bloque `div[data-theme="dark"]`. Afirmar `max − min <= 1`. Si falla, el mensaje lista cada par con sus px

### Implementation for User Story 5

- [ ] T033 [US5] En `src/components/sections/FinalCta.tsx`, cambiar `py-section` de la `<section>` por `pt-section pb-[calc(var(--spacing-section)/2)]`. Verificar que Tailwind 4 genera la utilidad (alternativa: una clase en `globals.css` que use el token). Comentario: spec 010 FR-012, evita la franja de canvas vacía antes del pie (research R7)
- [ ] T034 [US5] Correr `npx playwright test tests/e2e/rhythm.spec.ts`. Si algún par difiere, corregirlo con el token `py-section` en el componente de esa sección (`src/components/sections/*.tsx` o `src/components/ui/Section.tsx`), nunca con un número suelto (research R7)

**Checkpoint**: las 5 historias en verde.

---

## Phase 8: Polish & Cross-Cutting Concerns

- [ ] T035 Correr la suite completa `npm run test:e2e`, incluido `"Trazabilidad FR → SC"`: todo en verde
- [ ] T036 [P] Correr `npm run lint` y `npm run build`, sin errores ni advertencias nuevas
- [ ] T037 [P] Lighthouse móvil en `/` y `/planes` (quickstart §3): Performance ≥ 90, Accessibility ≥ 95 y SEO ≥ 95. Anotar los valores en `specs/010-refinamiento-conversion/quickstart.md`, sección "Resultados"
- [ ] T038 Revisión manual M1 a M5 de `specs/010-refinamiento-conversion/quickstart.md` con el owner (SC-012, SC-013, SC-014, sin JS, lector de pantalla); anotar el resultado en la misma sección "Resultados"
- [ ] T039 [P] En `specs/005-official-site/contracts/routes.md`, agregar al inicio de la sección "Encabezado" una nota de una línea: "Reemplazado por specs/010-refinamiento-conversion/contracts/header-footer.md (3 enlaces, corte 1024px)"
- [ ] T040 Commits en Conventional Commits sobre la rama `010-refinamiento-conversion`: `test:` (suite y config), `feat:`/`style:` por historia y `docs:` (spec 010 y nota en 005). Push y merge a `main` solo cuando el owner lo pida

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Fase 1)**: T001 requiere la confirmación del owner; T002 y T003 dependen de T001.
- **Foundational (Fase 2)**: depende de Setup; bloquea todas las historias.
- **US1 (Fase 3)**: depende de la Fase 2.
- **US2 (Fase 4)**: depende de la Fase 2. Su implementación depende de T011 (US1), porque el corte a
  1024px vive en `Navbar.tsx`; sus tests (T015) pueden escribirse en paralelo con US1.
- **US3, US4 y US5 (Fases 5 a 7)**: dependen solo de la Fase 2 y son independientes entre sí y de US1.
- **Polish (Fase 8)**: depende de todas las historias.

### Archivos compartidos (no paralelizar entre sí)

- `tests/e2e/header.spec.ts`: T007, T008 y T016.
- `tests/e2e/hero.spec.ts`: T025, T026 y T027.
- `src/app/globals.css`: T021, T022 y T029.
- `src/components/sections/FinalCta.tsx`: T023 y T033.

### Within Each User Story

Tests (deben fallar) → implementación → correr el subconjunto hasta verde → checkpoint.

## Parallel Example: User Story 1

```text
# Tests de US1, en paralelo (archivos distintos):
T007/T008 en tests/e2e/header.spec.ts   ‖   T009 en tests/e2e/footer.spec.ts

# Implementación de US1 (T010 y T011 en serie; T012 y T013 en paralelo con ellos):
T010 site.ts → T011 Navbar.tsx   ‖   T012 MobileMenu.tsx   ‖   T013 Footer.tsx
```

## Parallel Example: después de la Fase 2

```text
US1 (Navbar/site.ts)  ‖  US3 (globals.css + FinalCta)  ‖  US4 (ScreensCarousel + Hero)
# US5 después de US3 (comparte FinalCta.tsx); US2 después de T011.
```

## Implementation Strategy

### MVP First (solo US1)

1. Fase 1 → Fase 2 → Fase 3 (US1).
2. **Parar y validar**: SC-001, SC-002 y SC-009 en verde, y revisión rápida del encabezado.
3. Ya se puede mostrar o desplegar en preview: es el cambio de mayor impacto en la conversión.

### Entrega incremental

US1 → US2 (cierra los P1) → US3 → US4 (cierra los P2) → US5 → Polish. Cada historia agrega su
grupo de tests en verde sin romper los anteriores.
