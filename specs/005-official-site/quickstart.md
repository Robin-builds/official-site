# Quickstart: validar la spec 005

## Preparación

```bash
npm run build      # MUST terminar sin errores; todas las rutas como estáticas (○ / ●)
npm run start      # http://localhost:3000
```

Antes de empezar, en `main` (landing anterior) medir en DevTools a 360 px:
`document.documentElement.scrollHeight` → anotar como **H0**.

Revisar cada escenario en tema claro y oscuro.

## Escenarios

| # | Paso | Resultado esperado | Cubre |
|---|------|--------------------|-------|
| 1 | 360 px, abrir `/` | Titular, recorrido de capturas y "Pruébala gratis" visibles sin scroll; un toque abre Google Play | US1, SC-001 |
| 2 | 360 px, medir `scrollHeight` de `/` | ≤ 0,6 × H0 | SC-003 |
| 3 | Abrir `/#como-funciona` y `/#inicio` | Llega al bloque de 3 pasos y al hero; nunca a un 404 | FR-005, SC-004 |
| 4 | Desde cada página, ir a cada otra usando solo el menú | ≤ 2 toques; la página actual está marcada | US2, SC-002 |
| 5 | 360 px, Tab hasta el menú, Enter, Tab por los enlaces, Escape | Abre, recorre con foco visible, cierra y el foco vuelve al botón | FR-003 |
| 6 | Abrir el menú móvil y tocar una página | Navega y el menú queda cerrado en la página nueva | R3 |
| 7 | JavaScript deshabilitado: abrir menú, navegar, abrir una FAQ | Todo funciona; la página actual sigue marcada | edge case |
| 8 | Cambiar a tema claro en `/`, ir a `/contadores` y recargar | Sigue en claro | FR-022 |
| 9 | `/funcionalidades` | Cada funcionalidad con título, descripción y beneficio; captura solo si es real; CTA de descarga a mano | US3, FR-008 |
| 10 | `/contadores` → "Soy contador" | WhatsApp con el mensaje para contadores | US4 |
| 11 | Ver el `<head>` de cada página (o un validador de OG) | Título, descripción, canonical e imagen propios; `/contadores` distinto de `/` | FR-020, SC-007 |
| 12 | `/para-tu-negocio#ferreteria` | Problemas y soluciones del rubro + CTA | US5 |
| 13 | `/preguntas-frecuentes` | Preguntas agrupadas por tema; "¿Sirve en iPhone?" responde que no; todas las FAQ de la landing están | US5, FR-011 |
| 14 | `/ayuda` → una guía | Lista de guías listas; pasos numerados; captura real cuando existe; enlace desde su funcionalidad | US7, FR-014 |
| 15 | `/ayuda/no-existe` y `/cualquier-cosa` | Página no encontrada con marca, menú, Inicio y Descargar | FR-006 |
| 16 | `/privacidad` con `text: null` | 404; el pie enlaza al destino vigente | FR-019 |
| 17 | `/sitemap.xml` | Todas las páginas publicadas y guías listas, con `URLS.site` | FR-023 |
| 18 | Buscar en `src/content/` "quién", "lote", "vencim", "usuario y fecha" | Sin resultados en copy visible | FR-016, R8 |
| 19 | Cada página a 360, 768 y 1440 px | Sin scroll horizontal | FR-021 |
| 20 | Lighthouse móvil en cada página (build de producción) | Performance ≥ 90, Accesibilidad ≥ 95, SEO ≥ 95 | SC-005 |
| 21 | DevTools → `prefers-reduced-motion: reduce`, navegar entre páginas | Sin animación de movimiento | edge case |
| 22 | En cada página en español, tocar "EN"; luego "ES" | Llega a la página equivalente (tabla de [routes.md](./contracts/routes.md)) y vuelve; nunca a Inicio ni a un 404 | US8, FR-026, SC-008 |
| 23 | Repetir escenarios 1, 4–7, 9–17 y 19 en `/en/...` | Mismo resultado, todo el texto en inglés (menú, pie, 404, avisos para lectores) | FR-025 |
| 24 | Ver `<html lang>` y `<head>` en `/funcionalidades` y `/en/features` | `es-CL` / `en`; canonical propio; hreflang `es-CL`, `en` y `x-default`; `og:locale` correcto | FR-027 |
| 25 | `/en/accountants` → "I'm an accountant"; pie → Contact | WhatsApp con mensaje en inglés | FR-030 |
| 26 | `/en`, `/en/download`, `/en/faq` | Se informa en qué idioma está la app | FR-029, US8-3 |
| 27 | Tema claro en `/`, tocar "EN" | `/en` sigue en claro | edge case |
| 28 | Comparar cantidad y orden de funcionalidades, rubros, FAQ y pasos de guía entre idiomas | Iguales | FR-029 |
| 29 | Buscar en el contenido `en` "who", "batch", "lot number", "expir" | Sin afirmaciones prohibidas | FR-029, R8 |
| 30 | `/en/xyz` y `/xyz` | La misma 404 bilingüe, con marca y tema | FR-006, R12 |
| 31 | **Revisión del owner**: leer todas las páginas y guías en inglés | Aprobado antes de poner `languages.en.published = true` | FR-031 |

## Primer despliegue

Al subir las primeras mejoras a `main` del repo `Robin-builds/official-site`, Vercel
(`storeflow-official-site`) publica solo. Confirmar la dirección de producción, actualizar
`URLS.site` (research R14) y repetir los escenarios 11 y 17 sobre esa dirección.
