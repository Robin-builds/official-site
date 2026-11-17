# Contrato: conteo de clics (Umami, research R1)

## Carga

- `next/script` con `src={URLS.umamiScript}`, `data-website-id={NEXT_PUBLIC_UMAMI_WEBSITE_ID}` y
  `data-auto-track="false"`, renderizado **solo** por la página Planes (ambos idiomas).
- Sin `NEXT_PUBLIC_UMAMI_WEBSITE_ID` no se renderiza el script.
- `data-auto-track="false"` apaga **todo** el seguimiento automático de Umami: páginas, cambios de
  ruta y también los atributos `data-umami-event` (documentación de Umami, "Tracker
  configuration"). Por eso no se usan atributos: el clic se envía a mano (corrección de T023).

## Evento `plan-cta`

Se envía al tocar cualquiera de los 3 botones de plan (FR-015), desde `PlansGrid.tsx`:

```ts
window.umami?.track("plan-cta", { plan, period, kind, lang });
```

| Propiedad | Valores |
|---|---|
| `plan` | `free`, `standard`, `premium` |
| `period` | `monthly`, `annual` (la seleccionada al tocar) |
| `kind` | `activation` (Free) o `intent` (pagos) |
| `lang` | `es`, `en` |

- Sin datos personales: nunca se adjunta correo, WhatsApp ni nada escrito en el formulario.
- Si el script no carga (bloqueador, sin variable), `window.umami` no existe y los botones funcionan
  igual; la llamada va en `try/catch` para que la medición nunca rompa el botón.
- Sin JavaScript no hay medición (tampoco hay script).

## Lectura (SC-015)

En el panel de Umami: Eventos → `plan-cta`, desglosado por `plan`, `period` y `kind`, en el
período de la prueba. Las intenciones se cuentan buscando en el correo el asunto
`Planes · <Plan> · <Periodicidad>`. Tasa = intenciones / clics `kind=intent`, por plan y periodicidad.
