# Contrato: direcciones del sitio (español e inglés)

Todas las rutas se generan estáticas en `next build` (salida `○` o `●` en el resumen del build).
Español en la raíz con `<html lang="es-CL">`; inglés bajo `/en` con `<html lang="en">` (research R16).

| Clave | Español | Inglés | CTA principal | En menú | Sitemap |
|---|---|---|---|---|---|
| `home` | `/` | `/en` | Pruébala gratis / Try it free | marca/logo | sí |
| `features` | `/funcionalidades` | `/en/features` | Pruébala gratis | sí | sí |
| `business` | `/para-tu-negocio` | `/en/for-your-business` | Pruébala gratis | sí | sí |
| `accountants` | `/contadores` | `/en/accountants` | Soy contador / I'm an accountant (WhatsApp) | sí | sí |
| `faq` | `/preguntas-frecuentes` | `/en/faq` | Pruébala gratis | sí | sí |
| `help` | `/ayuda` | `/en/help` | Pruébala gratis | sí, si hay ≥ 1 guía lista | igual |
| guía | `/ayuda/[guia]` | `/en/help/[guide]` | Pruébala gratis | no | por guía lista |
| `download` | `/descargar` | `/en/download` | Pruébala gratis | botón destacado | sí |
| `privacy` | `/privacidad` | `/en/privacy` | — | solo pie | solo con texto en ese idioma |
| — | cualquier otra | cualquier otra | Inicio/Home + Descargar/Download | — | no (404 bilingüe, noindex) |

Slugs de guías por idioma:

| Clave | Español | Inglés |
|---|---|---|
| `primeros-pasos` | `primeros-pasos` | `getting-started` |
| `movimientos` | `registrar-movimientos` | `recording-stock-movements` |
| `bodegas` | `varias-bodegas` | `multiple-warehouses` |
| `alertas` | `alertas-de-stock` | `stock-alerts` |

## Anclas que MUST existir

| Español | Inglés | Página | Origen |
|---|---|---|---|
| `#inicio` | `#home` | Inicio | logo de la landing anterior |
| `#como-funciona` | `#how-it-works` | Inicio | CTA secundaria de la landing anterior |
| `#contenido` | `#content` | todas | "Saltar al contenido" |
| `#<feature.id.es>` | `#<feature.id.en>` | Funcionalidades | guías e Inicio |
| `#minimarket`, `#ferreteria`, `#distribuidora`, `#bodega` | `#minimarket`, `#hardware-store`, `#distributor`, `#warehouse` | Para tu negocio | accesos desde Inicio |

## Encabezado (todas las páginas)

- ≥ 1024 px: marca · enlaces de páginas · Ingresar/Log in (secundario) · ES/EN · tema · CTA principal.
- < 1024 px: marca · CTA principal · botón de menú (`<details>`). El panel abierto muestra
  páginas, CTA destacada, Ingresar secundario, selector ES/EN y selector de tema.
- La página actual lleva `aria-current="page"` en el HTML estático.
- Selector ES/EN: dos enlaces; el del idioma actual con `aria-current="true"`, el otro apunta a la
  misma clave de página en ese idioma, con `hreflang` y `lang`. Funciona sin JS.
- Teclado: Tab llega al botón de menú; Enter/Espacio abre; Escape cierra y devuelve el foco.

## Pie (todas las páginas)

Enlaces a todas las páginas publicadas del idioma, Contacto (WhatsApp con mensaje en ese idioma),
Privacidad (interna o externa según R11), Ingresar y chileapps.cl (FR-004). Externos con
`target="_blank"` y aviso para lectores en el idioma de la página.

## `<head>` de cada página

`<link rel="canonical">` a sí misma; `<link rel="alternate" hreflang="es-CL">`,
`hreflang="en"` y `hreflang="x-default"` (→ español). Open Graph con `og:locale` del idioma y
`og:locale:alternate` del otro. Si el inglés no está publicado (R18), sin hreflang a `en`.
