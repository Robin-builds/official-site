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
