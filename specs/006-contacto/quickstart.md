# Quickstart: validar la página de Contacto (spec 006)

## Requisitos

- `npm run build` y `npm run lint` sin errores.
- `npm run start` (o el deploy de vista previa) y un navegador con DevTools.
- Un celular Android y un iPhone con WhatsApp (para el QR y la apertura de la app).
- Para el inglés: cambiar temporalmente `languages.en.published` a `true` en local (no se
  commitea).

Referencias: [contracts/routes.md](./contracts/routes.md), [contracts/content.md](./contracts/content.md),
[data-model.md](./data-model.md).

## Escenarios

| # | Pasos | Resultado esperado | Spec |
|---|-------|--------------------|------|
| 1 | Abrir cualquier página a 1440 px | "Contacto" es el último enlace del menú, mismo estilo que los demás | FR-002, SC-001 |
| 2 | A 360 px abrir el menú desplegable | "Contacto" aparece; un toque lleva a `/contacto` | FR-002, SC-001 |
| 3 | En `/contacto`, mirar menú y pie | Contacto marcado como página actual; en el pie, "Contacto" primero en "Contacto y cuenta", sin "Contacto por WhatsApp" y sin repetirse en "Sitio" | FR-002 |
| 4 | Completar nombre, empresa, teléfono y correo y enviar | WhatsApp abre en pestaña nueva hacia +56 9 5759 6588 con saludo y las 4 líneas rotuladas; la pestaña del sitio conserva lo escrito y muestra el aviso con "Abrir WhatsApp" | US1-2, FR-004 |
| 5 | Enviar solo con nombre y empresa | El mensaje no tiene líneas de teléfono, correo ni mensaje | FR-004 |
| 6 | Enviar vacío | Errores en texto bajo Nombre y Empresa; foco en Nombre; el lector de pantalla anuncia "Revisa 2 campos."; no se abre WhatsApp | US1-3, FR-006 |
| 7 | Correo `ana@`, teléfono `1234` | Error bajo cada campo con cómo corregirlo; al corregir, el error desaparece al escribir | US1-4, FR-006 |
| 8 | Teléfonos `+56 9 1234 5678`, `912345678`, `56912345678` | Los tres válidos; el mensaje los trae tal como se escribieron | Edge cases |
| 9 | Campos con espacios al inicio/fin y saltos extra | Llegan recortados | Edge cases |
| 10 | Nombre `Peña & Hijos #1 🛠️`, mensaje con tildes | Llegan intactos en WhatsApp | SC-003 |
| 11 | Pegar 600 caracteres en el mensaje | Se corta en 500; el enlace abre bien | Edge cases |
| 12 | DevTools → Red, limpiar, enviar formulario válido | Ninguna petición del sitio; solo la navegación de la pestaña nueva a `wa.me` | FR-005, SC-005 |
| 13 | DevTools → Application | Sin `localStorage`/`sessionStorage`/cookies nuevas por el formulario | FR-005 |
| 14 | Bloquear ventanas emergentes para el sitio y enviar | Si no abre la pestaña, el enlace "Abrir WhatsApp" del aviso abre el chat | Edge cases, R6 |
| 15 | Tocar "Escribir por WhatsApp" | Abre el chat en pestaña nueva con "Hola, quiero saber más de StoreFlow" | US2-2, FR-007 |
| 16 | A 1440 px y 768 px, escanear el QR con Android y con iPhone a 30 cm, tema claro y oscuro | Abre el mismo chat al primer intento | US2-1, FR-008, SC-004 |
| 17 | A 360 px y a 767 px | El QR no se ve; el botón directo sí | FR-008 |
| 18 | Desactivar JavaScript y recargar | Formulario deshabilitado con aviso de JavaScript; botón directo y QR funcionan; Enter en un campo no recarga ni cambia la URL | US2-3, FR-013 |
| 19 | Navegar solo con teclado | Orden lógico: campos → enviar → botón directo; foco visible en todos | SC-006 |
| 20 | Celular real: enviar formulario | Abre la app de WhatsApp con el mensaje; al volver, el formulario sigue completo | Aclaración 2026-11-15 |
| 21 | Ver código fuente / compartir `/contacto` | Title, description y vista previa propias; `lang="es-CL"` | FR-001 |
| 22 | `/sitemap.xml` | Incluye `/contacto` (sin `/en/contact` mientras el inglés esté oculto) | FR-014 |
| 23 | Abrir `/en/contact` con el inglés oculto | 404 como el resto del inglés | US3-2 |
| 24 | Con el inglés habilitado en local: ES/EN en Contacto, enviar formulario | Lleva a `/en/contact` y viceversa; el mensaje y los rótulos van en inglés; el QR en inglés abre el mensaje general en inglés | US3-1, FR-011 |
| 25 | Buscar `56900000000` en el repo | Sin resultados; pie y "Sé partner" abren +56 9 5759 6588 | FR-009 |
| 26 | Lighthouse móvil en `/contacto` (claro y oscuro: contraste con axe/DevTools) | Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95; sin scroll horizontal a 360/768/1440 | SC-006 |
| 27 | Releer el copy | Sin promesas de tiempos de respuesta, llamadas ni demos; tuteo; sin jerga | FR-012, Principios I y VII |
