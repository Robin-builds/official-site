# Contrato: direcciones y ruta de servidor (spec 009)

## Páginas

| Idioma | Dirección | Notas |
|---|---|---|
| es | `/planes` | En el menú entre "Para tu negocio" y "Preguntas frecuentes"; también en el pie |
| en | `/en/plans` | Compila siempre; responde 404 mientras `languages.en.published` sea `false` |

- El apartado de planes tiene `id="planes"` en ambos idiomas: `/planes#planes` y `/en/plans#planes`
  llevan a él (FR-020, SC-013).
- Generadas de forma estática. Metadata propia por idioma (`pageMetadata("plans", locale)`),
  imagen Open Graph propia, hreflang y sitemap desde el registro de páginas.

## `POST /api/plan-intent`

Segunda y última ruta de servidor permitida (constitución 5.0.0, Principio IV).

**Petición** (`Content-Type: application/json`):

```json
{
  "locale": "es",
  "plan": "standard",
  "period": "annual",
  "email": "dueno@ferreteria.cl",
  "whatsapp": "+56 9 1234 5678",
  "origin": { "utm_source": "google", "utm_campaign": "precios-1", "referrer": "https://www.google.com/" },
  "website": ""
}
```

**Respuestas**:

| Caso | Código | Cuerpo | Correo enviado |
|---|---|---|---|
| Cuerpo no es JSON | 400 | `{ "ok": false }` | No |
| Campo trampa con texto | 200 | `{ "ok": true }` | No |
| `plan`/`period` inválido (incluye `free`) | 400 | `{ "ok": false, "errors": { "plan": "invalid" } }` | No |
| Correo vacío o inválido, o WhatsApp inválido | 400 | `{ "ok": false, "errors": { "email": "required" \| "email", "whatsapp": "whatsapp" } }` | No |
| Faltan `RESEND_API_KEY` o `CONTACT_TO_EMAIL` | 500 | `{ "ok": false }` | No |
| Resend responde error | 502 | `{ "ok": false }` | No |
| Válido | 200 | `{ "ok": true }` | **Exactamente 1** |

**Reglas**:
- Valida con las mismas funciones que el navegador (`src/lib/planes.ts`).
- Recalcula el precio en el servidor (research R3); ignora cualquier precio que venga del navegador.
- No guarda, registra ni mide los datos; `console.error` solo registra fallas sin datos del visitante.
- Ninguna petición sale hacia medios de pago (SC-007): los únicos destinos de red de la página son
  esta ruta, el script de medición y Google Play/WhatsApp por enlace.
