# Contract: rutas y estructura de la página Contacto

## Rutas

| Ruta | Idioma | Estado |
|------|--------|--------|
| `/contacto` | es-CL | publicada |
| `/en/contact` | en | 404 mientras `languages.en.published = false` (guardia del layout `(en)`) |

Cada ruta: `page.tsx` con `pageMetadata("contact", locale)` y `opengraph-image.tsx` con
`pageOgImage("contact", locale)`. Ambas estáticas (sin `dynamic`, sin `searchParams`).

## Navegación

- Menú de escritorio (≥ 1280 px) y menú desplegable: "Contacto" como enlace normal, último de la
  lista, mismo estilo que los demás; `aria-current="page"` en `/contacto` (ya lo resuelve
  `NavLinks`).
- Pie: "Contacto" (enlace interno, misma pestaña) primero en "Contacto y cuenta"; no se repite en
  "Sitio". Desaparece "Contacto por WhatsApp".
- Selector ES/EN, hreflang y sitemap: automáticos desde el registro de páginas.

## Estructura de la página

```text
<main>
  PageHeader (H1 "Conversemos" + bajada; sin CTA)
  <section>  grid: 1 columna < 1024 px; 2 columnas (≈ 3fr / 2fr) ≥ 1024 px
    ├── Columna formulario (primero en el orden de lectura)
    │     H2 · <noscript> aviso
    │     <form noValidate> <fieldset disabled={!hidratado}>
    │        Nombre* · Empresa* · Teléfono · Correo · ¿En qué te podemos ayudar? (textarea)
    │        [región role="status": resumen de errores / aviso de enviado + enlace]
    │        <button type="submit"> primario "Enviar por WhatsApp" + nota de privacidad
    └── Columna alternativas (visualmente subordinada)
          H2 · texto · Button secondary "Escribir por WhatsApp" (enlace, pestaña nueva)
          Bloque QR (hidden < 768 px):
            tarjeta bg-qr-bg (token blanco en ambos temas) con imagen 200×200
            caption fuera de la tarjeta, text-fg-2 sobre el fondo de la página
```

## Componentes

| Componente | Tipo | Responsabilidad |
|------------|------|-----------------|
| `components/pages/ContactPage.tsx` | servidor | arma PageHeader + grid; pasa el contenido del idioma |
| `components/sections/ContactForm.tsx` | **cliente** (`"use client"`) | estado, validación, `window.open`, avisos |
| `components/sections/ContactAlternatives.tsx` | servidor | botón directo + QR (`next/image`) |
| `lib/contact.ts` | utilidades puras | `validateContact`, `buildContactMessage` |
| `components/ui/Button.tsx` | cambio | exporta `buttonClasses(variant, size)` |
| `components/layout/Footer.tsx` | cambio | Contacto interno en la 2.ª columna; sin enlace WhatsApp |

## Comportamiento del envío (contrato con WhatsApp)

- Destino: `https://wa.me/56957596588?text=<mensaje codificado>`, en pestaña nueva
  (`window.open(url, "_blank")`, luego `opener = null`).
- Ninguna petición de red del sitio al enviar (SC-005): ni `fetch`, ni envío de `<form>`, ni
  `localStorage`, ni eventos de medición.
- El formulario no se limpia tras el envío.
