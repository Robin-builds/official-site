# Quickstart: validar la página "Planes" (spec 009)

## Requisitos

- Node 22.18 o superior (quita tipos de TypeScript sin flag; el repo usa 22.19).
- `.env.local` con `RESEND_API_KEY` y `CONTACT_TO_EMAIL` (los mismos de Contacto) y, para contar
  clics, `NEXT_PUBLIC_UMAMI_WEBSITE_ID` de un sitio creado en Umami Cloud.
- Sin Resend configurado igual se validan los escenarios 1–9 y 13–15.

## Comandos

```bash
node specs/009-planes-pricing/planes-check.mjs   # invariantes del contenido (contracts/content.md)
npm run lint
npm run build                                    # condición necesaria, no suficiente
npm run dev                                      # http://localhost:3000/planes
```

## Escenarios

| # | Qué hacer | Resultado esperado | Cubre |
|---|---|---|---|
| 1 | `node specs/009-planes-pricing/planes-check.mjs` | Todas las líneas PASS, código 0. Cambiar a 2 planes o quitar `recommended` a Standard → FAIL, código 1 | SC-002, SC-009, SC-010, SC-011, SC-012, SC-014 |
| 2 | Abrir `/planes` y luego `/planes#planes` | Menú y pie muestran "Planes"; el ancla baja al apartado | SC-013 |
| 3 | Leer los 3 planes | Free, Standard, Premium en orden; solo Standard "Recomendado"; límites en bodegas; Free "Gratis para siempre"; aviso "Precios referenciales, pueden cambiar"; prueba 14 días con "Próximamente"; "Varias empresas en una cuenta · Próximamente" solo en Premium | US-1, US-5 |
| 4 | Cambiar a Anual | Standard $99.900 + IVA, Premium $199.900 + IVA, "2 meses gratis"; Free $0 | SC-006 |
| 5 | Cambiar `monthlyPrice` de Standard en `src/content/planes.ts` | La página refleja el nuevo precio mensual y anual sin otro cambio | FR-005 |
| 6 | Ventana a 360, 768 y 1440 px | Sin desplazamiento horizontal; a 1440 los 3 planes lado a lado | SC-001 |
| 7 | Solo teclado: Tab al botón de Standard, Enter, escribir correo, Esc | La ventana abre con foco en el correo; Tab no sale de ella; Esc la cierra y el foco vuelve al botón. Repetir cerrando con "Cerrar" y tocando el fondo | SC-007b, US-2 esc. 2 |
| 8 | Enviar con correo vacío, luego con `hola@` | Error en el correo, no hay petición a `/api/plan-intent` | SC-005 |
| 9 | Correo válido + WhatsApp `123` | Error en WhatsApp, no hay petición. Con WhatsApp vacío sí se envía | SC-005, US-2 esc. 4b |
| 10 | Envío válido (Standard, Anual, con `?utm_source=prueba` en la dirección) | Confirmación en la ventana; llega **1** correo "Planes · Standard · Anual" con precio $99.900 + IVA, correo, fecha y hora, idioma y `utm_source: prueba` | SC-004, FR-016 |
| 11 | `curl -X POST localhost:3000/api/plan-intent -H "Content-Type: application/json" -d '{"plan":"free","period":"monthly","email":"a@b.cl"}'` | 400 con error de plan, 0 correos | contrato |
| 12 | Igual que 11 con `"plan":"standard","email":"malo"` y luego con `"website":"x"` y datos válidos | 400 con error de correo y 0 correos; luego 200 y 0 correos | SC-005, contrato |
| 13 | DevTools → Red, tocar los 3 botones y enviar un formulario | Solo peticiones a `/api/plan-intent` y al script/eventos de Umami; ninguna a medios de pago | SC-007 |
| 14 | Con Umami configurado: tocar Free, Standard (Mensual) y Premium (Anual) | En Umami aparecen 3 eventos `plan-cta` con `plan`/`period`/`kind` correctos (Free = `activation`) | SC-003, SC-015 |
| 15 | Desactivar JavaScript y recargar | Precios mensuales visibles; botones pagos son enlaces a WhatsApp con "Hola, quiero el plan Standard (mensual)"; Free va a Google Play | Caso borde sin JS |
| 16 | Lighthouse móvil en `/planes`, tema claro y oscuro; contraste con DevTools | Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95; sin fallas de contraste en precios y listas | SC-008, SC-017 |
| 17 | Revisar `/preguntas-frecuentes` → Precio | Ya no dice que hoy hay planes pagados; enlaza a Planes | research R11 |
