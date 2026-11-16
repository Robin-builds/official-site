# Research: Más contraste y bordes naranjos en el tema claro

**Feature**: 008-tema-claro-contraste | **Date**: 2026-11-15

Contrastes calculados con la fórmula de luminancia relativa de WCAG 2.x (sRGB). Abreviaturas:
`canvas` = `--bg-top`, `s2` = `--surface-2`.

## R1. Causa del "blanco y grises sin diferencia"

**Hallazgo**: en el tema claro `--bg-top` (canvas) y `--surface` valen ambos `#ffffff`. Las secciones
que "alternan" canvas/surface (Inicio, Funcionalidades, listas por rubro) no alternan nada, y las
tarjetas `bg-surface` (Problemas, Testimonios) son blanco sobre blanco, separadas solo por un borde
`#e2e8f0` (≈ 1.25:1) y una sombra al 4–12%. Las tarjetas `bg-surface-2` (`#f1f5f9`) sobre secciones
blancas quedan a ≈ 1.10:1.

**Decision**: separar los tres niveles de superficie en el tema claro: página gris, secciones/tarjetas
blancas, y `surface-2` con tono cálido durazno (derivado del naranjo de marca).

**Rationale**: corrige la causa (dos tokens con el mismo valor) sin tocar la estructura de las páginas,
que ya alternan tonos pensando en un tema donde sí difieren (el oscuro).

**Alternatives considered**:
- *Mantener canvas blanco y oscurecer `surface`*: las tarjetas `bg-surface` (Problemas, Testimonios)
  pasarían a gris sobre blanco y los inputs/encabezado también se agrisan; se ve menos "tarjeta".
- *Solo bordes más oscuros, sin tocar fondos*: no resuelve el ritmo de secciones (canvas = surface).

## R2. Paleta clara elegida

| Token | Antes | Después | Motivo |
|-------|-------|---------|--------|
| `--bg-top` (canvas) | #ffffff | **#e9edf2** | página gris; blanco sobre ella = 1.18:1 |
| `--bg-mid` | #f8fafc | **#e3e8ee** | gradientes del hero/encabezados |
| `--bg-bottom` | #f1f5f9 | **#dce2e9** | pie y final de gradientes; vs canvas 1.11:1 |
| `--surface` | #ffffff | #ffffff | sin cambio: tarjetas, secciones alternas, inputs |
| `--surface-2` | #f1f5f9 | **#f8dcb8** | durazno; vs blanco 1.32:1, vs canvas 1.12:1, vs bg-bottom ΔE 25.9 |
| `--border` | #e2e8f0 | **#c3cdd9** | borde neutro visible (vs blanco 1.61:1) |
| `--text-3` | #64748b | **#526072** | #64748b cae a 4.09:1 sobre el nuevo canvas |
| `--text-muted-on-2` | #475569 | #475569 | sin cambio (6.8:1 sobre s2) |
| `--primary` / `--link` | #0e7490 | **#155e75** | #0e7490 cae a 4.11:1 sobre bg-bottom (pie) |
| `--primary-hover` | #155e75 | **#164e63** | sigue un paso más oscuro que el primario |
| `--accent-text` | #b45309 | **#92400e** | #b45309 cae a 3.85–4.27:1 sobre los grises |
| `--danger` | #dc2626 | **#b91c1c** | #dc2626 cae a 3.70–4.11:1 sobre los grises |
| `--ok` | #047857 | **#065f46** | #047857 cae a 4.20:1 sobre bg-bottom |

Contrastes resultantes del texto (mínimo entre canvas, mid, bottom, surface, s2): text-1 13.69,
text-2 5.74, text-3 4.86, primary 5.51, accent-text 5.38, danger 4.91, ok 5.83 (los mínimos ahora los da surface-2 #f8dcb8; el primario #155e75 cumple también sobre él, no requiere oscurecerse más). Blanco sobre
primario 7.27; blanco sobre ok ≥ 7. Todos ≥ 4.5:1 (AA texto normal).

**Rationale**: el primario y los colores semánticos se oscurecen *dentro de su misma familia*
(cian, naranjo, rojo, verde), lo que FR-004 exige cuando un texto deja de cumplir; no hay colores de
familia nueva (FR-012). El botón principal sigue cian (FR-010).

**Alternatives considered**: canvas más claro (#eef1f5) evita oscurecer semánticos pero baja
blanco-sobre-canvas a 1.13:1, poco perceptible: es justo el problema que reporta el owner.

## R3. Naranjo de bordes: dos tokens nuevos

**Decision**: agregar dos tokens de tema, con valor idéntico al actual en oscuro:

| Token | Oscuro | Claro | Uso |
|-------|--------|-------|-----|
| `--card-border` | `var(--border)` | **#f2a240** | borde en reposo de las tarjetas con caja visible |
| `--card-accent` | `var(--primary)` | **#b45309** | borde/anillo/brillo de resalte de tarjetas, capturas y chips |

- `#f2a240` ≈ 85% naranjo de marca + 15% blanco: 2.10:1 vs blanco, 1.78:1 vs canvas, 1.59:1 vs s2
  (todos ≥ 1.5, SC-001). El primer candidato `#f5b362` caía a 1.38:1 sobre el durazno `#f8dcb8`.
- `#b45309` (el antiguo `accent-text`, naranjo oscuro de la misma familia): 3.81–5.02:1 contra
  todos los fondos claros (≥ 3:1 componente no textual, FR-007 / SC-003). El naranjo puro `#f0921e`
  da ≈ 2.3:1 y no sirve como borde de resalte.
- Brillo de la sombra de resalte (`--elev-card-hover`, `--elev-phone-float`) mezcla `--card-accent`
  en vez de `--primary`.

**Rationale**: en oscuro los valores son exactamente los de hoy, así FR-009 se cumple por
construcción. Un token separado del `--border` general evita teñir de naranjo el encabezado, el pie,
los divisores de la FAQ y los campos (sería ruido visual y competiría con la CTA, FR-010).

**Alternatives considered**:
- *Volver naranjo `--border` completo*: tiñe todo el sitio; demasiado.
- *Cambiar `--primary` a naranjo en claro*: viola FR-010 (botones y enlaces cambiarían).

## R4. Qué sigue en primario (cian)

**Decision**: siguen en `--primary`: anillo de foco global (`:focus-visible`), relleno del ícono de la
tarjeta resaltada (`.card-icon`), botón "+" de la FAQ, CTA y enlaces.

**Rationale**: el anillo de foco cian se distingue del borde naranjo (edge case "foco de teclado").
El ícono relleno es un elemento de contenido, no un borde; cambiarlo agrega alcance que la spec no pide.

## R5. Cobertura de componentes

Tarjetas con caja visible que pasan de `border-line` a `border-card-line` (utilidad nueva):
Problemas, Testimonios, Atajos, índice de guías de Ayuda, listas por rubro (2 por bloque), caja de
la FAQ, aviso sin JavaScript del formulario, caja del QR. `PartnerPanel` mantiene su borde propio
`border-accent/40`.

Las tarjetas "fantasma" (Beneficios, Cómo funciona, Credibilidad) no tienen borde en reposo; solo
heredan el resalte naranjo vía `--card-accent`.

Reglas de `globals.css` que cambian `var(--primary)` → `var(--card-accent)`: `.card-hover` (hover, foco,
`:active`), anillo de `.phone-bezel` (hover, foco del carrusel, `:active`). El chip de
`FeatureIndex` cambia `hover:border-primary` → `hover:border-card-accent`.

## R6. Sincronía de los dos bloques claros

El tema claro está declarado dos veces (`[data-theme="light"]` y `@media (prefers-color-scheme:
light) :root:not([data-theme])`). Ambos MUST recibir los mismos valores (FR-011); el quickstart lo
verifica comparando los bloques.

## R7. Corrección tras `/speckit-analyze` (opción a)

- **Problema**: con `--surface-2: #fdf0e1`, en Inicio la banda de Credibilidad (surface-2) y la sección
  Problemas (canvas) quedaban a 1.05:1; las tarjetas cálidas de las listas por rubro, igual.
- **Decision**: durazno más marcado `#f8dcb8` (1.12:1 vs canvas, 1.32:1 vs blanco) y borde de reposo
  `#f2a240` para seguir ≥ 1.5:1 sobre él. El cian `#155e75` no cambia (5.51:1 sobre el durazno).
- **Hero → Credibilidad**: el final del gradiente (`#dce2e9`) y el durazno tienen luminosidad casi
  igual (1.01:1), pero tono muy distinto (ΔE CIELAB 25.9). SC-002 acepta contraste ≥ 1.08:1 **o**
  ΔE ≥ 10, porque el contraste WCAG solo mide luminosidad y aquí la separación es de tono.
- **Sé partner**: su borde de marca (`border-accent/40`) queda a ≈ 1.3:1; se exceptúa en SC-001 y el
  panel se separa por fondo (durazno sobre gris, 1.12:1). Cambiarle el borde alteraría el tema oscuro.
