# Data Model: Refinamiento de conversión del sitio oficial

Sin datos persistidos. El único "modelo" que cambia es el registro de páginas, que es contenido
estático (`src/content/site.ts`). No hay tipos nuevos.

## Página del registro (`SitePage`, existente)

| Campo | Uso en esta feature |
|---|---|
| `key` | Identifica el destino (`home`, `features`, `business`, `plans`, `faq`, `help`, `contact`, `download`, `partner`, `privacy`). |
| `inNav` | **Cambia**: `true` solo en `features`, `business` y `plans`. Decide qué va en el encabezado (escritorio y menú móvil). |
| `published` | Sin cambios. Una página no publicada no aparece ni en el encabezado ni en el pie (Ayuda depende de `readyGuides()`). |
| `locales[locale].navLabel` | Sin cambios. Texto del enlace en el encabezado y el pie. |

### Estado de `inNav` antes y después

| key | antes | después | ¿Dónde se llega después? |
|---|---|---|---|
| home | false | false | logo del encabezado, pie |
| features | true | **true** | encabezado, pie |
| business | true | **true** | encabezado, pie |
| plans | true | **true** | encabezado, pie |
| faq | true | **false** | pie |
| help | true | **false** | pie (si está publicada) |
| contact | true | **false** | pie (columna "Contacto y cuenta") |
| download | false | false | pie |
| partner | false | false | pie |
| privacy | false | false | pie (propia o externa, según `published`) |

**Reglas de validación** (las verifica la suite, ver [contracts/verification.md](./contracts/verification.md)):
- Exactamente 3 páginas con `inNav: true` y `published: true`, en el orden features → business → plans (SC-001).
- El pie enlaza todas las páginas publicadas, más Ingresar a la versión web y Política de privacidad (SC-009).

## Tokens de color (CSS, `src/app/globals.css`)

| Token | Nuevo | Dónde se declara | Qué contiene |
|---|---|---|---|
| `--page-primary` | sí | regla `:root` propia | primario del tema activo de la página, resuelto en `<html>` |
| `--page-primary-hover` | sí | ídem | hover del primario de la página |
| `--page-on-primary` | sí | ídem | texto sobre el primario de la página |

Clase `.page-primary`: reasigna `--primary`, `--primary-hover` y `--on-primary` a los tokens
`--page-*`, y pone el contorno de foco en `--text-1`. Solo se usa en el botón del bloque de cierre
(research R4).
