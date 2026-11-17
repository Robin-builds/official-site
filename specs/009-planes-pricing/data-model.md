# Data Model: Página "Planes" (spec 009)

Nada se persiste en el sitio. Hay tres formas de datos: el **contenido** (archivo en
`src/content/planes.ts`), la **intención** (viaja del navegador a la ruta y sale como correo) y el
**clic** (evento de la herramienta de medición).

## 1. Plan (contenido)

| Campo | Tipo | Regla |
|---|---|---|
| `id` | `"free" \| "standard" \| "premium"` | Único; orden fijo Free → Standard → Premium (FR-001) |
| `name` | string | "Free", "Standard", "Premium" (iguales en ambos idiomas) |
| `tagline` | string (localizado) | Frase de posicionamiento, no vacía (FR-002) |
| `monthlyPrice` | entero ≥ 0, CLP sin IVA | Free = 0; pagos > 0 (FR-005) |
| `warehouses` | entero ≥ 1 \| `"unlimited"` | Límite principal, en bodegas (FR-004) |
| `includesFrom` | `"free" \| "standard" \| null` | Encabeza la lista con "Todo lo de X" (FR-002b) |
| `items` | `{ text: string; soon?: true }[]` (localizado) | ≥ 1 ítem; `soon` = "Próximamente" (FR-010) |
| `recommended` | boolean | Exactamente uno, Standard (FR-003, SC-009) |

El texto del límite ("1 bodega", "Hasta 3 bodegas", "Bodegas ilimitadas") y el del botón salen de
plantillas del contenido localizado a partir de `warehouses` e `id`, así cambiar un número no toca
el texto.

**Valores iniciales** (FR-002b, Assumptions):

| Plan | Mensual | Bodegas | Lista |
|---|---|---|---|
| Free | $0 | 1 | 1 usuario · productos · movimientos (entradas, salidas y ajustes) · alertas de stock mínimo · funciona sin internet |
| Standard | $9.990 + IVA | 3 | Todo lo de Free · usuarios con roles (Administrador y Operador) · panel web · reportes y exportar a Excel |
| Premium | $19.990 + IVA | ilimitadas | Todo lo de Standard · varias empresas en una cuenta (Próximamente) · atención prioritaria |

## 2. Contenido de la página (localizado)

`PlansContent` (contrato en [contracts/content.md](./contracts/content.md)): encabezado, selector
de periodicidad, plantillas de precio y de límite, aviso "Precios referenciales, pueden cambiar",
bloque de prueba de 14 días (`soon: true`), textos del formulario, errores, confirmación, aviso de
privacidad, mensaje de WhatsApp sin JavaScript y rótulos del correo al owner.

## 3. Periodicidad y precio (derivados)

- `Period = "monthly" | "annual"`; por defecto `monthly` (FR-008).
- `priceFor(plan, period)`: `monthly → monthlyPrice`; `annual → monthlyPrice × 10`.
- `formatCLP(n)`: `$` + entero con punto de miles (es-CL), sin decimales.
- Free siempre $0 y sin "+ IVA"; pagos con "+ IVA" (research R4).

## 4. Intención de plan (petición → correo)

Petición `POST /api/plan-intent` ([contracts/routes.md](./contracts/routes.md)):

| Campo | Regla de validación (navegador **y** servidor) |
|---|---|
| `plan` | `"standard"` o `"premium"`; cualquier otro (incluido `free`) → 400 |
| `period` | `"monthly"` o `"annual"` |
| `email` | Obligatorio, ≤ 254, forma `algo@algo.algo` (FR-013) |
| `whatsapp` | Opcional, ≤ 30; si no está vacío: celular chileno (research R8) |
| `locale` | `"es"` o `"en"`; otro valor → `"es"` |
| `origin` | `utm_source/medium/campaign/term/content` (≤ 100 c/u) y `referrer` (≤ 500); opcionales; se recortan, no invalidan |
| `website` | Campo trampa: si trae texto → respuesta `ok` sin enviar correo |

Correo resultante (lo lee el owner, siempre en español):

- **Asunto**: `Planes · <Plan> · <Mensual|Anual>`.
- **Cuerpo** (texto plano, una línea por dato, omitiendo opcionales vacíos): plan, periodicidad,
  precio mostrado (recalculado en el servidor, research R3), correo, WhatsApp, fecha y hora de
  recepción (America/Santiago), idioma de la página, origen.
- **Responder a**: el correo del visitante.

**Estados en el navegador**: `idle → sending → sent | failed | errors`. `errors` vuelve a `idle`
al corregir; `failed` conserva lo escrito para reintentar; `sent` muestra la confirmación en la
misma ventana (FR-016).

## 5. Clic de plan (evento de medición)

| Propiedad | Valores |
|---|---|
| nombre del evento | `plan-cta` (enviado con `umami.track`) |
| `plan` | `free`, `standard`, `premium` |
| `period` | `monthly`, `annual` (la visible al tocar) |
| `kind` | `intent` (pagos) o `activation` (Free) (FR-015) |
| `lang` | `es`, `en` |

Sin datos personales. Contrato en [contracts/events.md](./contracts/events.md).
