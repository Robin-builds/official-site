# Contrato UI: clases de hover de tarjetas y capturas (spec 007)

Amplía y reemplaza los valores del contrato de la spec 004
([004 contracts](../../004-hover-interaction-states/contracts/interaction-states.md)). `globals.css`
define; los componentes solo agregan clases y nunca reimplementan el efecto con utilidades.
`.faq-toggle` no cambia.

## `.card-hover` (cambia)

- **Aplicar a**: el elemento que se ve como tarjeta o panel.
- **Requiere**: borde de 1 px si la tarjeta ya tiene borde.
- **Parámetro opcional**: `--card-lift` (por defecto `-5px`). Paneles grandes: `[--card-lift:-4px]`.
- **Garantiza**:
  - Resaltado con hover fino o `:has(:focus-visible)`: borde `--primary`, `--elev-card-hover` (con
    brillo), `translate: 0 var(--card-lift)` sin movimiento reducido.
  - Presionado con `hover: none` + `:active`: `scale: 0.98` (sin movimiento reducido) y borde
    `--primary`; 120 ms.
  - Transición: `--motion-hover-duration` / `--motion-hover-ease`.
- **No hace**: no vuelve enfocable la tarjeta; no cambia layout.

## `.card-ghost` (sin cambios de contrato)

Igual que en la 004. En Presionado también muestra su fondo.

## `.card-icon` (cambia)

- **Garantiza** con la tarjeta resaltada: fondo `--primary`, color `--on-primary`; sin movimiento
  reducido, `scale: 1.1` y `rotate: -6deg`. Si contiene `.card-arrow`, no gira.
- **No aplicar a**: checks, alertas, números de paso de Cómo funciona.

## `.card-arrow` (nueva)

- **Aplicar a**: el `svg` de la flecha dentro de una tarjeta-enlace (hoy: `Shortcuts.tsx`).
- **Garantiza**: con la tarjeta resaltada, `translate: 3px 0` sin movimiento reducido.

## `.phone-hover` (nueva)

- **Aplicar a**: el `div` exterior de `PhoneFrame` (único lugar).
- **Garantiza**: con hover fino, `scale: 1.04` (sin movimiento reducido) y activa el estado
  resaltado de su `.phone-bezel`; también cuando `[data-carousel]:has(:focus-visible)` lo contiene.
  Presionado táctil: `scale: 0.98` y anillo primario.

## `.phone-bezel` (nueva)

- **Aplicar a**: el bisel de `PhoneFrame`, en lugar de `shadow-phone ring-1 ring-line`.
- **Garantiza**: reposo `0 0 0 1px var(--border), var(--elev-phone)` (idéntico a hoy); resaltado
  `0 0 0 2px var(--primary), var(--elev-phone-float)`.

## Tokens

| Token | Uso |
|-------|-----|
| `--motion-hover-duration` | 300ms, compartido por tarjetas y capturas |
| `--motion-hover-ease` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--elev-card-hover` | sombra resaltada con brillo `color-mix(primary 35% oscuro / 25% claro)` |
| `--elev-phone-float` | sombra flotante del teléfono, mismo brillo |
