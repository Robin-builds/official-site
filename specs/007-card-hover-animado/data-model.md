# Data Model: Hover animado en tarjetas y capturas (spec 007)

No hay datos persistentes ni contenido nuevo. El "modelo" son las superficies interactivas y sus
estados visuales.

## Entidades

### Superficie tipo tarjeta

| Campo | Valores |
|-------|---------|
| Variante | `visible` (borde y fondo en reposo) · `ghost` (caja invisible en reposo) · `panel` (superficie grande, elevación 4 px) |
| Ícono principal | sí / no |
| Indicador de dirección | sí (flecha) / no |
| Contiene interactivos | sí (se resalta con `:has(:focus-visible)`) / no (solo hover) |

| Página | Componente | Variante | Ícono | Flecha | Interactivos |
|--------|------------|----------|-------|--------|--------------|
| Inicio | `Problems.tsx` | visible | sí | no | no |
| Inicio | `Benefits.tsx` | ghost | sí | no | no |
| Inicio | `HowItWorks.tsx` | ghost | sí (≥ md) | no | no |
| Inicio | `Credibility.tsx` | ghost | sí | no | no |
| Inicio | `Testimonials.tsx` | visible | no | no | no |
| Inicio | `Shortcuts.tsx` | visible (enlace) | sí | **sí** | sí |
| Ayuda | `HelpPage.tsx` | visible (enlace) | sí (número) | no | sí |
| Para tu negocio | `BusinessList.tsx` (2 por rubro) | panel | no | no | no |
| Sé partner | `PartnerPanel.tsx` | panel | no | no | sí |

### Captura de la app

| Página | Componente | Interactivos dentro del teléfono | Disparador de foco |
|--------|------------|------------------------------------|--------------------|
| Inicio (hero) | `PhoneMockup` → `PhoneFrame` | no (controles debajo) | `[data-carousel]:has(:focus-visible)` |
| Funcionalidades | `FeatureGroups.tsx` → `PhoneFrame` | no | ninguno (solo hover) |
| Guías | `GuideSteps.tsx` → `PhoneFrame` | no | ninguno (solo hover) |

## Estados

```text
Reposo ──puntero entra / foco visible dentro──▶ Resaltado ──puntero sale / foco sale──▶ Reposo
Reposo ──dedo presiona (hover: none)──▶ Presionado ──suelta / cancela / scroll──▶ Reposo
```

| Estado | Tarjeta | Ícono | Flecha | Captura |
|--------|---------|-------|--------|---------|
| Reposo | como hoy | como hoy | como hoy | anillo `--border` 1 px, `--elev-phone` |
| Resaltado | `translate: 0 var(--card-lift)`, borde `--primary`, `--elev-card-hover` (con brillo), ghost: fondo | `scale 1.1`, `rotate -6deg` (no si tiene flecha), fondo `--primary`, color `--on-primary` | `translate 3px 0` | `scale 1.04`, anillo `--primary` 2 px, `--elev-phone-float` |
| Presionado (táctil) | `scale 0.98`, borde `--primary`, ghost: fondo | sin cambio | sin cambio | `scale 0.98`, anillo `--primary` |
| Movimiento reducido | sin translate/scale/rotate; colores, borde y sombra sí | solo colores | sin desplazamiento | sin scale; anillo y sombra sí |

Transiciones: Resaltado 300 ms `cubic-bezier(0.22, 1, 0.36, 1)`; Presionado 120 ms. Ver
[research.md](research.md) R2 y R5.

## Tokens

| Token | Estado | Temas |
|-------|--------|-------|
| `--motion-hover-duration` | nuevo (300ms) | común (`:root`) |
| `--motion-hover-ease` | nuevo | común (`:root`) |
| `--elev-card-hover` | redefinido (+ capa de brillo primario) | oscuro, claro, claro sin JS |
| `--elev-phone-float` | nuevo | oscuro, claro, claro sin JS |
| `--card-lift` | parámetro por elemento (por defecto -5px) | — |
