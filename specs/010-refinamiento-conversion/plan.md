# Implementation Plan: Refinamiento de conversión del sitio oficial

**Branch**: `010-refinamiento-conversion` | **Date**: 2026-11-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/010-refinamiento-conversion/spec.md`

## Summary

Se despeja todo lo que compite con "Pruébala gratis":
- **Encabezado**: queda con logo, 3 enlaces de sección (Funcionalidades, Para tu negocio, Planes),
  Ingresar y el botón. Se apaga `inNav` de FAQ, Ayuda y Contacto, que siguen en el pie. El selector
  de tema sale del encabezado y del menú móvil. El corte del menú baja de 1280 a 1024px.
- **Botón del cierre**: deja de heredar el cian del bloque forzado a oscuro. Toma el primario del
  tema de la página mediante tokens `--page-primary` capturados en `<html>`.
- **Hero**: pierde el pie visible del carrusel, que queda solo para lectores de pantalla. Su texto
  se alinea arriba con un padding superior ≤ a la separación estándar.
- **Cierre**: se reduce el canvas vacío bajo el bloque.

Todo se verifica con una suite nueva Playwright + axe-core, aprobada por el owner, con un test por
criterio de éxito y un test de trazabilidad FR → SC.

## Technical Context

**Language/Version**: TypeScript 5 (strict), React 19.3, Node 22 o superior.

**Primary Dependencies**: Next.js 16.4.5 (App Router), Tailwind CSS 4. **Nuevas (devDependencies,
aprobadas por el owner el 2026-11-17)**: `@playwright/test` y `@axe-core/playwright`. Sin
dependencias nuevas en tiempo de ejecución.

**Storage**: N/A.

**Testing**: `npm run test:e2e` (Playwright, solo Chromium, contra `next build && next start` en
:3100), más `npm run lint`, `npm run build` y la revisión manual M1 a M5 de [quickstart.md](./quickstart.md).

**Target Platform**: navegadores móviles y de escritorio modernos, 360 a 1440px; Vercel
(`storeflow-official-site`).

**Project Type**: sitio web estático (Next.js App Router) con dos rutas de servidor existentes, que no se tocan.

**Performance Goals**: Lighthouse móvil en `/` y `/planes`: Performance ≥ 90, Accessibility ≥ 95 y
SEO ≥ 95, sin bajar respecto de `main`.

**Constraints**: sin cambios de copy (A-4). Colores solo por tokens de `globals.css`. `"use client"`
no aumenta. La navegación funciona sin JS (`<details>` nativo).

**Scale/Scope**: ~7 archivos de `src/` modificados (`site.ts`, `Navbar.tsx`, `MobileMenu.tsx`
(comentario), `FinalCta.tsx`, `Hero.tsx`, `ScreensCarousel.tsx`, `globals.css`); suite nueva de ~8
archivos; `package.json`, `playwright.config.ts` y `.gitignore`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.* Constitución **5.0.0**.

| Principio | Cómo se cumple | Estado |
|---|---|---|
| **I. Veracidad** | No cambia ningún texto ni afirmación. | PASS |
| **II. Una conversión por página** | Es el objetivo de la feature: menos enlaces junto a la CTA, el mismo color de CTA en toda la página, e Ingresar como `ghost` (utilitario, subordinado). | PASS |
| **III. Contenido separado** | El encabezado se decide con `inNav` en `src/content/site.ts`. El color sale de tokens en `globals.css` (`--page-primary`), sin hex en componentes. Separación con `--spacing-section`. | PASS |
| **IV. Simplicidad** | Dos devDependencies nuevas, aprobadas explícitamente por el owner. **Justificación en una línea**: los criterios son geométricos y de estilos computados en 4 anchos × 2 temas, y no se repiten sin un navegador automatizado. Sin dependencias en tiempo de ejecución, sin componentes ni variantes nuevas; una sola clase CSS (`.page-primary`). | PASS |
| **V. Mobile-first y accesible** | Sin scroll horizontal de 360 a 1440px (SC-003). Contraste AA en ambos temas verificado con axe (SC-006). El foco del botón de cierre usa `--text-1` (R4). El menú es `<details>` nativo y funciona sin JS, con la página actual marcada. El pie del carrusel sigue en `aria-live`. | PASS |
| **VI. Performance** | Quita nodos (pie del carrusel, ThemeToggle del encabezado) y no agrega JS ni recursos. Lighthouse en quickstart §3. | PASS |
| **VII. Español de Chile e inglés** | Sin cambios de copy. `inNav` aplica a ambos idiomas por igual. | PASS |
| **Restricciones técnicas** | Breakpoint `lg` de Tailwind 4 verificado (por defecto 64rem; sin `@theme --breakpoint-*` propio). La API de Playwright y axe se verifica con Context7 al instalar (R8). | PASS |
| **Flujo** | Rama `010-refinamiento-conversion`. `npm install -D …` y `npx playwright install chromium` requieren confirmación del owner en la sesión de implementación. Commits convencionales. | PASS |

**Re-evaluación post-diseño**: PASS, sin violaciones. Nota para el owner: la spec
`005-official-site` (contrato "Encabezado", corte 1280 y 6 enlaces) queda superada por
[contracts/header-footer.md](./contracts/header-footer.md).

## Project Structure

### Documentation (this feature)

```text
specs/010-refinamiento-conversion/
├── plan.md                  # Este archivo
├── research.md              # Fase 0: R1–R9
├── data-model.md            # Fase 1: registro de páginas (inNav) y tokens --page-*
├── quickstart.md            # Fase 1: verificación automática + revisión manual M1–M5
├── contracts/
│   ├── header-footer.md     # Encabezado, pie, hero y cierre
│   └── verification.md      # Un test por SC, matriz anchos × temas
├── checklists/
│   └── requirements.md
└── tasks.md                 # Fase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── content/site.ts                       # inNav: false en faq, help, contact (R1)
├── app/globals.css                       # :root --page-*, .page-primary; borrar .carousel-caption-in (R4, R5)
└── components/
    ├── layout/Navbar.tsx                 # xl: → lg:, sin ThemeToggle (R2, R3)
    ├── layout/MobileMenu.tsx             # solo comentario del corte (R2)
    └── sections/
        ├── FinalCta.tsx                  # envoltorio .page-primary; pb reducido (R4, R7)
        ├── Hero.tsx                      # padding superior y alineación (R6)
        └── ScreensCarousel.tsx           # sin pie visible; aria-live intacto (R5)

tests/e2e/                                # nuevo (R8, contracts/verification.md)
├── fixtures.ts                           # tema por localStorage, anchos, rutas desde el registro
├── header.spec.ts                        # SC-001, SC-002, SC-004
├── footer.spec.ts                        # SC-009
├── responsive.spec.ts                    # SC-003
├── cta.spec.ts                           # SC-005
├── a11y.spec.ts                          # SC-006
├── hero.spec.ts                          # SC-007, SC-010, SC-011
├── rhythm.spec.ts                        # SC-008
└── traceability.spec.ts                  # FR → SC desde spec.md

playwright.config.ts                      # webServer build+start :3100, Chromium
package.json                              # devDeps + script test:e2e
.gitignore                                # /test-results, /playwright-report, /playwright/.cache
```

**Structure Decision**: proyecto Next.js único existente. Los tests e2e viven en `tests/e2e/` en la
raíz, fuera de `src/`, para que no entren en el build de Next. Su tsconfig hereda el de la raíz;
`tests/**/*.ts` ya entra en el `include` (`**/*.ts`).

## Complexity Tracking

Sin violaciones de la constitución que justificar.
