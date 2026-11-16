# Data Model: tokens de tema (008-tema-claro-contraste)

No hay datos persistentes. La única "entidad" es el conjunto de tokens de diseño en
`src/app/globals.css` (Principio III: un solo lugar).

## Entidad: Token de tema

| Campo | Descripción |
|-------|-------------|
| nombre | variable CSS (`--surface`, `--card-accent`…) |
| valor oscuro | bloque `:root, [data-theme="dark"]` |
| valor claro | bloques `[data-theme="light"]` y `@media (prefers-color-scheme: light) :root:not([data-theme])` (idénticos) |
| utilidad | alias en `@theme inline` (`--color-…`) cuando un componente lo usa como clase |

### Reglas de validación

- V1: valor oscuro de todo token existente = valor actual (FR-009). Tokens nuevos en oscuro
  apuntan a un token existente (`--card-border: var(--border)`, `--card-accent: var(--primary)`).
- V2: los dos bloques claros declaran exactamente los mismos pares nombre/valor (FR-011).
- V3: todo par texto/fondo listado en [contracts/theme-tokens.md](contracts/theme-tokens.md) ≥ 4.5:1.
- V4: `--card-accent` ≥ 3:1 contra canvas, bg-mid, bg-bottom, surface y surface-2 (FR-007).
- V5: `--card-border` ≥ 1.5:1 contra canvas, surface y surface-2 (SC-001).

## Tokens nuevos

| Nombre | Utilidad Tailwind | Oscuro | Claro |
|--------|-------------------|--------|-------|
| `--card-border` | `border-card-line` (`--color-card-line`) | `var(--border)` | `#f2a240` |
| `--card-accent` | `border-card-accent` (`--color-card-accent`) | `var(--primary)` | `#b45309` |

## Tokens modificados (solo claro)

Ver tabla de [research.md R2](research.md#r2-paleta-clara-elegida). Sombras claras:
`--elev-card-hover` y `--elev-phone-float` mezclan `--card-accent` (en oscuro también, con el mismo
valor resultante porque `--card-accent` = `--primary`).
