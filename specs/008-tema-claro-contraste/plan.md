# Implementation Plan: Más contraste y bordes naranjos en el tema claro

**Branch**: `008-tema-claro-contraste` | **Date**: 2026-11-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/008-tema-claro-contraste/spec.md`

## Summary

En el tema claro `canvas` y `surface` valen ambos `#ffffff`, así que las secciones no alternan y
las tarjetas quedan blanco sobre blanco. El plan separa tres niveles de superficie (página gris
`#e9edf2`, blanco, y `surface-2` durazno `#f8dcb8`), refuerza el borde neutro y agrega dos tokens de
tema: `--card-border` (borde naranjo claro en reposo, `#f2a240`) y `--card-accent` (borde/brillo de
resalte naranjo oscuro, `#b45309`). En oscuro ambos tokens apuntan a los valores actuales, así el tema oscuro
no cambia. Los textos y el primario que bajan de 4.5:1 sobre los nuevos grises se oscurecen dentro de
su misma familia. Detalle en [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5 (strict), CSS

**Primary Dependencies**: Next.js 16.4.5 (App Router), React 19.3, Tailwind CSS 4 (`@theme inline`)

**Storage**: N/A

**Testing**: `npm run build`; verificador de contraste en Node sin dependencias
(`specs/008-tema-claro-contraste/contrast-check.mjs`); revisión manual y Lighthouse según
[quickstart.md](quickstart.md)

**Target Platform**: navegadores modernos, móvil primero (360 / 768 / 1440 px)

**Project Type**: sitio web estático (Next.js)

**Performance Goals**: Lighthouse móvil Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95 (sin cambio)

**Constraints**: tema oscuro idéntico; AA en todo texto; sin dependencias nuevas; solo tokens de tema

**Scale/Scope**: 1 archivo de tokens (`globals.css`) + ~10 componentes que cambian una clase de borde

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|-----------|------------|--------|
| I. Veracidad | No cambia contenido ni copy | ✅ |
| II. Una conversión principal | CTA y enlaces siguen en primario cian; el naranjo es solo borde/acento de tarjetas (FR-010). El primario claro se oscurece (#0e7490 → #155e75), conserva su rol | ✅ |
| III. Contenido separado / tokens en un solo lugar | Todo en `globals.css`; los componentes solo cambian `border-line` → `border-card-line` (token, no color literal). Naranjo derivado de la marca de la app | ✅ |
| IV. Simplicidad | Sin dependencias; 2 tokens nuevos, justificados por FR-009 (no tocar oscuro) y FR-010 (no teñir todo); el verificador de contraste es un script Node sin dependencias dentro de la spec | ✅ |
| V. Mobile-first y accesible | AA verificado por cálculo para todos los pares (contrato); bordes de resalte ≥ 3:1; foco visible sigue cian; movimiento reducido y táctil heredados de la spec 007 | ✅ |
| VI. Performance | Solo cambian valores de variables CSS; sin impacto | ✅ |
| VII. Idiomas | Sin cambios de texto; se valida en es y en | ✅ |
| Flujo | Rama propia `008-tema-claro-contraste`; commits `style:` | ✅ |

**Post-design re-check**: sin violaciones. Complexity Tracking vacío.

## Project Structure

### Documentation (this feature)

```text
specs/008-tema-claro-contraste/
├── spec.md
├── plan.md               # este archivo
├── research.md           # R1–R6: causa, paleta, tokens nuevos, cobertura
├── data-model.md         # tokens como entidad + reglas de validación
├── quickstart.md         # validación end-to-end
├── contracts/
│   └── theme-tokens.md   # valores claros y pares de contraste obligatorios
├── checklists/
│   └── requirements.md
└── tasks.md              # /speckit-tasks (pendiente)
```

### Source Code (repository root)

```text
src/app/globals.css                         # tokens claros (2 bloques), tokens nuevos, @theme inline,
                                            # reglas .card-hover / .phone-bezel → --card-accent
src/components/sections/Problems.tsx        # border-line → border-card-line
src/components/sections/Testimonials.tsx    # idem
src/components/sections/Shortcuts.tsx       # idem
src/components/sections/BusinessList.tsx    # idem (2 tarjetas)
src/components/sections/FaqGroups.tsx       # caja de la FAQ (divisores siguen en divide-line)
src/components/sections/ContactForm.tsx     # aviso sin JavaScript
src/components/sections/ContactAlternatives.tsx  # caja del QR
src/components/sections/FeatureIndex.tsx    # chip: hover:border-primary → hover:border-card-accent
src/components/pages/HelpPage.tsx           # índice de guías
specs/008-tema-claro-contraste/contrast-check.mjs  # verificador (lee globals.css)
```

**Structure Decision**: proyecto único Next.js existente; el cambio se concentra en el archivo de
tokens y en clases de borde de las tarjetas. No se crean componentes ni carpetas nuevas en `src/`.

## Complexity Tracking

Sin violaciones de la constitución.
