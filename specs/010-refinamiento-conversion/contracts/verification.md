# Contrato de verificación: suite e2e (Playwright + axe-core)

Ubicación: `tests/e2e/`. Corre contra el build de producción (`next build && next start`,
puerto 3100). Solo Chromium.

## Matriz

- **Anchos**: 360×800, 390×844, 1023×768, 1024×768, 1440×900.
- **Temas**: `light` y `dark`, fijados con `localStorage["storeflow-theme"]` antes de cargar.
- **Páginas**:
  - "todas": las rutas publicadas en español. Se obtienen del registro (`src/content/site.ts`),
    no se escriben a mano en el test.
  - "inicio": `/`.

## Un test por criterio

| SC | Archivo | Páginas × anchos × temas | Qué afirma |
|---|---|---|---|
| SC-001 | `header.spec.ts` | todas × 1024, 1440 × light | `header nav[aria-label] a` tiene 3 elementos con textos [Funcionalidades, Para tu negocio, Planes] |
| SC-002 | `header.spec.ts` | todas × 1024, 1440, 390 (menú abierto) × light | dentro de `header`: 0 botones de tema (`aria-label` del ThemeToggle) y 0 enlaces a las rutas de faq, help y contact |
| SC-003 | `responsive.spec.ts` | todas × 360, 390, 1023 × light | `documentElement.scrollWidth <= clientWidth` |
| SC-004 | `header.spec.ts` | inicio × 390, 1023 × light | clic en `summary` abre (`details[open]`); clic de nuevo y Escape cierran; con el menú cerrado, el enlace "Pruébala gratis" del encabezado está dentro del viewport; Enter sobre el `summary` con foco abre |
| SC-005 | `cta.spec.ts` | inicio × 1440 × light, dark | todos los enlaces con texto exacto "Pruébala gratis" visibles tras desplazarse comparten 1 solo `background-color` computado, igual al de `--page-primary` |
| SC-006 | `a11y.spec.ts` | inicio × 1440, 390 (menú abierto) × light, dark | `AxeBuilder` con `withRules(["color-contrast"])`, incluido `header` y `#cta-final-title` y su bloque, da 0 violaciones |
| SC-007 | `hero.spec.ts` | inicio × 1440×900, 390×844 × light | el `boundingBox` de `#hero-title`, de la bajada y del CTA primario del hero cumple `y >= 0` y `y + height <= viewport.height`, sin desplazar |
| SC-008 | `rhythm.spec.ts` | inicio × 360, 1440 × light | separación R7 entre pares contiguos desde Problemas hasta el cierre: `max − min <= 1px` |
| SC-009 | `footer.spec.ts` | todas × 1440 × light | `footer` contiene un enlace a cada página publicada del registro, más `URLS.webAppLogin` y la privacidad (propia o `URLS.privacyPolicy`) |
| SC-010 | `hero.spec.ts` | inicio × 1440 × light | a lo largo de un ciclo (o avanzando con los puntos), el `section[data-carousel]` no tiene texto visible fuera de botones y de `.sr-only`; la región `aria-live` termina con la descripción de la captura activa |
| SC-011 | `hero.spec.ts` | inicio × 390×844, 1440×900 × light | `firstHeroChild.top − header.bottom <= valor computado de --spacing-section` |

`traceability.spec.ts` lee la tabla "Trazabilidad requisito → criterio" de `spec.md` y falla si
algún `FR-0NN` definido en la spec no tiene fila, o si una fila cita un SC automático sin test que
lo nombre (los títulos de los tests empiezan con el id: `"SC-005 …"`).

## Manuales (fuera de la suite)

SC-012, SC-013 y SC-014: revisión visual del owner con [quickstart.md](../quickstart.md), escenarios M1 a M3.

## Reglas

- Los selectores usan roles, `aria-label` y textos del contenido (importados de `src/content`
  cuando el test corre en Node), nunca clases de Tailwind.
- Antes de medir se esperan las fuentes (`document.fonts.ready`); las animaciones se desactivan con
  `reducedMotion: "reduce"`, salvo en el test del carrusel.
- Un FAIL bloquea el merge a `main`.
