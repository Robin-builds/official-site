# Quickstart: validar la spec 010

## Requisitos

- Node 22 o superior y dependencias instaladas (`npm install`).
- Una sola vez, con confirmación del owner: `npx playwright install chromium`.

## 1. Verificación automática

```bash
npm run lint
npm run build
npm run test:e2e          # levanta next start en :3100 y corre tests/e2e/
```

**Resultado esperado**: lint y build sin errores, y todos los tests en verde. Cada título de test
empieza con el SC que cubre (ver [contracts/verification.md](./contracts/verification.md)). El
test de trazabilidad confirma que los 15 FR tienen criterio.

Para revisar un solo grupo: `npx playwright test tests/e2e/header.spec.ts`.
Para ver el reporte: `npx playwright show-report`.

## 2. Revisión manual (owner)

Con `npm run start` (o la preview de Vercel de la rama), en tema claro y en tema oscuro:

| # | Dónde | Qué mirar | Pasa si |
|---|---|---|---|
| M1 | Inicio a 1440×900 y en un celular real | Hero completo | Se ve equilibrado y sin hueco notorio sobre el título (SC-012) |
| M2 | Encabezado en cualquier página | Ingresar frente a "Pruébala gratis" | "Pruébala gratis" es claramente la acción; Ingresar se lee como enlace (SC-013) |
| M3 | Inicio de arriba a abajo | Paleta, botones y ritmo | Nada se siente como "fin de página" antes del cierre; los 3 "Pruébala gratis" tienen el mismo color (SC-014) |
| M4 | Inicio sin JavaScript (DevTools → desactivar JS) a 390px | Menú | Abre y cierra con toque; los 3 enlaces navegan (Principio V) |
| M5 | Lector de pantalla (NVDA o TalkBack) en el hero | Carrusel | Al cambiar de captura se anuncia su descripción |

## 3. Lighthouse (Principio VI)

Lighthouse móvil en `/` y `/planes`: Performance ≥ 90, Accessibility ≥ 95 y SEO ≥ 95. Esta spec
no debería bajarlos: quita nodos y no agrega recursos en tiempo de ejecución.

## Resultados

**2026-11-17, rama `010-refinamiento-conversion`**

- **Automático**: `npm run lint` sin problemas; `npm run build` sin errores; `npm run test:e2e`
  **97/97 en verde** (SC-001 a SC-011 en todas sus combinaciones, más "Trazabilidad FR → SC").
- **Línea base** (tests contra el código previo, antes de implementar): fallaban SC-001, SC-002,
  SC-005 (claro), SC-006 (claro, 1440), SC-010 y SC-011 (1440). SC-003, SC-004, SC-007, SC-008
  y SC-009 ya pasaban y quedan como guardas de regresión. SC-008 no detecta la franja bajo el
  cierre (mide entre contenidos, no hasta el pie); esa franja se redujo igual (FR-012, R7).
- **SC-006**: axe excluye el logotipo del encabezado. El "FLOW" naranja sobre el canvas claro da
  2.29:1 (ya pasaba antes de esta spec), pero WCAG 1.4.3 exime a los logotipos y SC-006 mide los
  CTA, Ingresar y los enlaces de sección.
- **Capturas revisadas** (1440×900, 1024×768 y 360×800, en claro): encabezado en una línea con
  3 enlaces; hero alineado arriba y sin leyenda bajo el teléfono; a 360px caben el ícono, el CTA y
  el menú; el foco con Tab sobre el botón del cierre se ve claro sobre la tinta.
- **Lighthouse (§3)**, móvil, local (`next start`, Chromium headless), con OK del owner:
  - `/`: Performance 99 · Accessibility 100 · Best Practices 100 · SEO 100.
  - `/planes`: Accessibility 98 · Best Practices 100 · SEO 100. Performance varía entre corridas
    (72, 81, 92) solo por el Total Blocking Time (2110, 830 y 360 ms); LCP 0,8 s y CLS 0 estables.
    Es ruido de CPU local: esta spec no agrega JS a Planes. Queda por confirmar Performance ≥ 90
    en la preview de Vercel.
- **Revisión manual M1 a M5 (§2)**: PENDIENTE con el owner.
