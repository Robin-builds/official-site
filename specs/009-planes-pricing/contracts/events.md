# Contrato: conteo de clics (Umami, research R1)

## Carga

- `next/script` con `src={URLS.umamiScript}`, `data-website-id={NEXT_PUBLIC_UMAMI_WEBSITE_ID}` y
  `data-auto-track="false"`, renderizado **solo** por la página Planes (ambos idiomas).
- Sin `NEXT_PUBLIC_UMAMI_WEBSITE_ID` no se renderiza el script.
- Ninguna otra página ni componente lleva atributos `data-umami-event`.

## Evento `plan-cta`

Se dispara al tocar cualquiera de los 3 botones de plan (FR-015), mediante atributos en el propio
elemento:

```html
<button data-umami-event="plan-cta"
        data-umami-event-plan="standard"
        data-umami-event-period="annual"
        data-umami-event-kind="intent"
        data-umami-event-lang="es">Quiero el plan Standard</button>

<a href="https://play.google.com/..." data-umami-event="plan-cta"
   data-umami-event-plan="free" data-umami-event-period="monthly"
   data-umami-event-kind="activation" data-umami-event-lang="es">Empezar gratis</a>
```

- `period` refleja la periodicidad seleccionada en ese momento (se re-renderiza con el selector).
- Sin datos personales: nunca se adjunta correo, WhatsApp ni nada escrito en el formulario.
- Si el script no carga (bloqueador, sin variable), los botones funcionan igual.

## Lectura (SC-015)

En el panel de Umami: Eventos → `plan-cta`, desglosado por `plan`, `period` y `kind`, en el
período de la prueba. Las intenciones se cuentan buscando en el correo el asunto
`Planes · <Plan> · <Periodicidad>`. Tasa = intenciones / clics `kind=intent`, por plan y periodicidad.
