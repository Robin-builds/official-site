# Contrato: tokens del tema claro y pares de contraste

Interfaz que la feature expone: los tokens de `globals.css` que consumen todos los componentes.
Cualquier cambio futuro de estos valores MUST seguir cumpliendo esta tabla.

## Valores del tema claro

```text
--bg-top        #e9edf2     --text-1          #0f172a
--bg-mid        #e3e8ee     --text-2          #475569
--bg-bottom     #dce2e9     --text-3          #526072
--surface       #ffffff     --text-muted-on-2 #475569
--surface-2     #f8dcb8     --primary         #155e75
--border        #c3cdd9     --primary-hover   #164e63
--card-border   #f2a240     --link            #155e75
--card-accent   #b45309     --accent          #f0921e  (sin cambio; solo decorativo)
--on-primary    #ffffff     --accent-text     #92400e
--qr-bg         #ffffff     --danger          #b91c1c
--ok            #065f46     --on-ok           #ffffff
```

## Pares obligatorios (mínimo exigido)

Fondos F = { #e9edf2, #e3e8ee, #dce2e9, #ffffff, #f8dcb8 }.

| Primer plano | Contra | Mínimo |
|--------------|--------|--------|
| text-1, text-2, text-3, primary, link, accent-text, danger, ok | cada fondo de F | 4.5:1 |
| on-primary | primary | 4.5:1 |
| on-ok | ok | 4.5:1 |
| card-accent | cada fondo de F | 3:1 |
| card-border | #e9edf2, #ffffff, #f8dcb8 | 1.5:1 |
| surface | bg-top | 1.15:1 |
| surface | surface-2 | 1.10:1 |
| bg-bottom | bg-top | 1.08:1 |
| surface-2 | bg-top | 1.10:1 |

## Secciones vecinas reales (SC-002: contraste ≥ 1.08:1 **o** ΔE CIELAB ≥ 10)

| Vecindad | Tokens |
|----------|--------|
| Hero (final del gradiente) → Credibilidad | bg-bottom → surface-2 |
| Credibilidad → Problemas | surface-2 → bg-top |
| Encabezado de página (final del gradiente) → sección canvas / surface | bg-bottom → bg-top, bg-bottom → surface |
| Secciones alternas (Inicio, Funcionalidades, Para tu negocio) | bg-top → surface |
| Última sección canvas → pie | bg-top → bg-bottom |

## Excepción

El panel de "Sé partner" conserva su borde de marca (`border-accent/40`, ≈ 1.3:1) y se separa de
su sección por el fondo (surface-2 sobre bg-top ≥ 1.10:1). No se mide su borde contra SC-001.

## Tema oscuro

Sin cambios de valor. Tokens nuevos: `--card-border: var(--border)`, `--card-accent: var(--primary)`.
