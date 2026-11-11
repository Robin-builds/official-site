# Research: Sitio oficial de StoreFlow (spec 005)

APIs verificadas contra `node_modules/next/dist/docs/` (Next.js 16.4.5) el 2026-11-10.

## R1. Direcciones del sitio

- **Decision**: rutas estáticas en español en la raíz:
  `/`, `/funcionalidades`, `/para-tu-negocio`, `/se-partner`, `/preguntas-frecuentes`,
  `/descargar`, `/privacidad`, `/ayuda`, `/ayuda/[guia]`; y sus equivalentes en inglés bajo `/en`
  con direcciones en inglés (tabla en [contracts/routes.md](./contracts/routes.md); ver R16).
  Los rubros son anclas dentro de
  `/para-tu-negocio` (`#minimarket`, `#ferreteria`, `#distribuidora`, `#bodega`) y cada
  funcionalidad es un ancla dentro de `/funcionalidades` (`#escaneo`, `#movimientos`, …).
- **Rationale**: FR-023 pide direcciones legibles en español. Rubros y funcionalidades son
  secciones cortas: una página por cada una multiplicaría metadata y OG sin contenido que lo
  justifique (Principio IV), y las anclas igual permiten compartir cada tema.
- **Alternatives considered**: `/rubros/[rubro]` y `/funcionalidades/[slug]` (más páginas finas,
  más mantenimiento); `/faq` (no es español de Chile, Principio VII).

## R2. Encabezado y pie compartidos, página actual

- **Decision**: `Navbar` y `Footer` pasan a los layouts raíz de cada idioma (FR-002, R16). La marca de página actual
  (`aria-current="page"` + estilo) la pone un componente de cliente `NavLinks` con `usePathname()`.
- **Rationale**: según `use-pathname.md`, en rutas estáticas y en rutas con `generateStaticParams`
  el pathname se resuelve durante el prerender, así que el HTML ya trae `aria-current` y funciona
  sin JavaScript (edge case). No hay `rewrites` ni Proxy, así que no hay riesgo de desajuste al
  hidratar. `cacheComponents` no está activo: no se necesita `Suspense`.
- **Alternatives considered**: pasar `current` como prop desde cada `page.tsx` (obligaría a
  renderizar el header en cada página, duplicando el layout); `useSelectedLayoutSegment` (no
  distingue `/ayuda` de `/ayuda/x` sin lógica extra).

## R3. Menú móvil sin JavaScript

- **Decision**: bajo 1024 px el menú es un `<details>`/`<summary>` nativo dentro de un
  componente de cliente pequeño (`MobileMenu`) que solo agrega: cerrar con Escape (devolviendo el
  foco al `<summary>`), cerrar al cambiar de ruta (`usePathname`) y cerrar al tocar fuera.
- **Rationale**: `<details>` abre y cierra con Enter/Espacio y toque sin JS (edge case "JS
  deshabilitado", FR-003). Como el layout persiste entre navegaciones de `<Link>`, sin el cierre
  por ruta el menú quedaría abierto en la página nueva. Mismo patrón nativo que la FAQ (spec 004).
- **Alternatives considered**: botón + estado React (no funciona sin JS); `popover` API (sin
  respaldo sin JS para cerrar al navegar y soporte aún desigual en Android antiguos).

## R4. Anclas de la landing anterior (FR-005, SC-004)

- **Decision**: la landing solo exponía dos anclas enlazables: `#inicio` (logo) y
  `#como-funciona` (CTA secundaria del hero). Inicio conserva ambos `id`: `#inicio` en el hero y
  `#como-funciona` en el bloque resumido de 3 pasos, que además enlaza a `/funcionalidades`.
- **Rationale**: el fragmento `#...` nunca llega al servidor, así que no se puede redirigir con
  `redirects` de `next.config`. Mantener los `id` en Inicio resuelve el 100 % de los enlaces sin JS.
  Inventario hecho con búsqueda de `id=` en `src/components/sections/` (los demás `id` son de
  títulos para `aria-labelledby`, no se enlazaban).
- **Alternatives considered**: script que traduce el hash a otra página (no funciona sin JS y
  agrega un salto extra).

## R5. Metadata por página (FR-020, SC-007)

- **Decision**: cada layout raíz define `title: { template: "%s · StoreFlow", default: … }`. Cada
  página exporta `metadata` construida con una función `pageMetadata(key, locale)` que arma
  `title`, `description`, `alternates.canonical`, `alternates.languages` (hreflang `es-CL`, `en`
  y `x-default` → español) y un objeto `openGraph`/`twitter` **completo** con `locale` `es_CL` o
  `en_US` y `alternateLocale` del otro idioma.
- **Rationale**: `generate-metadata.md` indica que la metadata de segmentos se fusiona de forma
  **superficial**: si una página define `openGraph`, reemplaza entero el del layout (se perderían
  `locale`, `siteName`, `type`). La función evita repetirlo en 9+ páginas; se justifica por uso en
  2+ lugares (Principio IV).
- **Alternatives considered**: repetir el objeto en cada página (fácil de desincronizar).

## R6. Imagen para compartir por página

- **Decision**: el render actual de `opengraph-image.tsx` se mueve a una función compartida
  `renderOgImage({ title, note })`. Cada segmento tiene su `opengraph-image.tsx` de 5 líneas que la
  llama con el título de esa página; las guías la generan con `params` (`generateStaticParams`).
- **Rationale**: US4 pide imagen propia para "Sé partner"; la convención de archivo por segmento
  (`opengraph-image.md`) genera la imagen en el build, sin servidor (FR-024). Sin dependencias.
- **Alternatives considered**: una sola imagen para todo (incumple US4); imágenes PNG hechas a mano
  (se desincronizan del copy).

## R7. Contenido repartido por página (Principio III)

- **Decision**: cada módulo exporta un objeto `{ es, en }` del mismo tipo (`Localized<T>`), así
  una traducción faltante rompe el typecheck (constitución III). `src/content/landing.ts` se divide en:
  `site.ts` (URLS, marca, navegación, pie, a11y, CTA principal, registro de páginas),
  `inicio.ts`, `funcionalidades.ts`, `negocios.ts`, `partner.ts`, `preguntas.ts`,
  `descargar.ts`, `privacidad.ts`, `guias.ts`, y `types.ts` para los tipos compartidos.
- **Rationale**: la constitución 2.0.0 permite un archivo por página y exige lo compartido en un
  solo archivo común. `URLS` sigue siendo una sola constante (Principio II).
- **Alternatives considered**: mantener un único `landing.ts` (pasaría de ~430 a ~1.200 líneas);
  MDX para guías (dependencia nueva, prohibida sin aprobación).

## R8. Revisión de veracidad del copy heredado (FR-016, Principio I)

- **Decision**: se corrige el copy actual que contradice la constitución 2.0.0 y la guía del owner:

  | Dónde (hoy en `landing.ts`) | Problema | Corrección |
  |---|---|---|
  | `meta.description` | "registrada con quién la hizo" | "queda registrada con su fecha" |
  | `hero.subtitle` | "y quién lo movió" | quitar la cláusula |
  | `credibility` "Historial…" | "con usuario y fecha" | "con fecha; no se edita ni se borra" |
  | `benefits` "Sabes quién movió qué" | afirmación prohibida | "Un historial que no se puede borrar": los movimientos no se editan; un error se corrige con un AJUSTE |
  | `benefits` "Pierdes menos por vencimiento" | no está en la guía, pero el owner lo confirmó (aclaración 2026-11-10) | se mantiene |
  | `useCases` Minimarket | "controla vencimientos por lote" | se mantiene (confirmado) |
  | `useCases` Distribuidora / Bodega | "con quién lo hizo" / "con usuario" | "con su fecha" |
  | `accountants.reasons[0]` (pasa a "Sé partner") | "con usuario y fecha" | "con fecha" |
  | `faq` bodegas y usuarios | "registrado con quién lo hizo" | roles Administrador/Operador según la guía |
  | `benefits` "Revisas desde el computador" | correcto, pero falta aclarar | "panel web de solo lectura" |

- **Rationale**: Principio I es NON-NEGOTIABLE y la guía manda sobre el copy heredado; la app
  manda sobre la guía.
- **Alternatives considered**: ninguna; no es opcional.

## R9. Funcionalidades permitidas para Funcionalidades y Guías

- **Decision**: la lista sale de la guía del owner. Con captura real disponible (`/public/screens/`):
  bodegas (`bodega.png`), escaneo (`escanear.png`), entradas y salidas (`movimiento.png`),
  alertas de stock (`alerta-stock.png`), historial (`historial.png`), inicio (`inicio.png`).
  Sin captura (solo texto e ícono, FR-008 / US3-2): productos y búsqueda, ajustes, configurar
  productos, usuarios y roles, alerta "sin actividad 7 días", lotes y fechas de vencimiento,
  funcionamiento sin internet, panel web de solo lectura, exportar a Excel (solo Administrador),
  temas de color (3 paletas × 3 niveles de oscuridad).
  Lotes y vencimientos no están en la guía, pero el owner confirmó que existen en la app
  (aclaración 2026-11-10). Escaneo no está en la guía pero tiene captura real: queda permitido.
  Todas entran (aclaración: opción B, temas incluidos).
- **Rationale**: Principio I: "una afirmación que no esté en la guía MUST verificarse contra la
  app"; la confirmación del owner cuenta como esa verificación.
- **Alternatives considered**: dejar fuera los temas de color (rechazado por el owner).

## R22. Agrupación de Funcionalidades (FR-008)

- **Decision**: 15 funcionalidades en 5 grupos, cada grupo con su título y ancla:

  | Grupo (es / en) | Funcionalidades |
  |---|---|
  | Registrar / Record | escaneo, entradas y salidas, ajustes, lotes y vencimientos |
  | Controlar / Stay on top | bodegas, productos y búsqueda, alertas de stock bajo, alerta sin actividad |
  | Trabajar en equipo / Work as a team | usuarios y roles, funcionamiento sin internet |
  | Revisar / Review | historial, panel web de solo lectura, exportar a Excel (solo Administrador) |
  | Personalizar / Customize | configurar productos, temas de color |

  Al inicio de la página, un índice con los 5 grupos (anclas) para saltar sin recorrer todo.
- **Rationale**: 15 bloques seguidos repiten el problema de la landing larga; los grupos y el
  índice permiten llegar directo a lo que se busca. `Feature` gana el campo `group`.
- **Alternatives considered**: una página por grupo (más rutas sin necesidad, Principio IV).

## R10. Guías (FR-014, US7)

- **Decision**: 4 guías estáticas con `generateStaticParams` y `dynamicParams = false` (rutas no
  listadas → 404):
  1. `primeros-pasos`: crear cuenta, primer producto, primera ENTRADA, revisar el inicio.
  2. `registrar-movimientos`: ENTRADA, SALIDA y AJUSTE, con el ejemplo de la harina.
  3. `varias-bodegas`: crear bodegas y cambiar la bodega activa.
  4. `alertas-de-stock`: stock mínimo, alerta de menor stock y alerta sin actividad.
  Cada guía tiene `ready: boolean`; las que no están listas no generan ruta ni aparecen (FR-014).
- **Rationale**: son los capítulos de la guía rápida con pasos concretos; usuarios/roles y
  configurar productos no traen pasos suficientes para una guía sin inventar (Principio I).
  `generate-static-params.md`: `params` es una `Promise` en Next 16.
- **Alternatives considered**: guía de usuarios y roles (la guía no explica cómo invitar).

## R11. Privacidad condicional (FR-019, US6)

- **Decision**: `privacidad.ts` exporta `text: string | null`. Con `null`, `/privacidad` llama a
  `notFound()` y no entra al sitemap; el pie enlaza a `URLS.privacyPolicy` (destino vigente).
  Con texto, el pie enlaza a `/privacidad`.
- **Rationale**: nunca se publica texto legal inventado; un solo dato decide todo.

## R12. Página no encontrada (FR-006)

- **Decision**: `app/global-not-found.tsx` con `experimental.globalNotFound: true`, bilingüe
  (texto en español y debajo en inglés, enlaces a Inicio/Home y Descargar/Download). Importa
  `globals.css`, la fuente y el script de tema por su cuenta. Además, `not-found.tsx` dentro de
  cada grupo de idioma atiende los `notFound()` explícitos (guía inexistente, Privacidad sin
  texto) con encabezado y pie del idioma correcto.
- **Rationale**: con un layout raíz por idioma (R16) no hay layout común para una 404 de URLs que
  no calzan con ninguna ruta; `not-found.md` indica `global-not-found` justo para ese caso. Es
  experimental: la constitución 3.0.0 lo permite solo para esto.
- **Riesgo y alternativa**: si el flag falla en el build o en Vercel, se reemplaza por un
  `[...resto]/page.tsx` en cada grupo que llama a `notFound()`; funciona estable, pero esas URLs
  se resuelven en una función en vez de un archivo estático.
- **Alternatives considered**: `app/not-found.tsx` raíz (imposible sin layout raíz común).

## R13. Mapa del sitio (FR-023, FR-027)

- **Decision**: `sitemap.ts` recorre el registro de páginas de `site.ts` + guías listas, emite
  la URL en español de cada una con `alternates.languages` (`es-CL`, `en`), más la URL en inglés,
  y omite Privacidad del idioma que no tenga texto.
- **Rationale**: una sola fuente para menú, pie y sitemap; agregar una página la publica en los tres.

## R14. Dirección del sitio (`URLS.site`)

- **Decision**: `URLS.site` pasa de `storeflow-landing-eight.vercel.app` a la dirección de
  producción del proyecto Vercel `storeflow-official-site`, que se conoce recién en el primer
  despliegue. Se deja marcado como PLACEHOLDER y se confirma en ese despliegue (quickstart).
- **Rationale**: canonical, OG y sitemap usan `URLS.site`; apuntar al dominio de la landing haría
  que buscadores vean el sitio nuevo como duplicado del viejo.

## R15. Altura de Inicio (SC-003)

- **Decision**: Inicio queda con: hero, credibilidad, problemas (3 ítems), beneficios (3 ítems),
  cómo funciona (3 pasos, `#como-funciona`), accesos a páginas (4 tarjetas: Funcionalidades, Para
  tu negocio, Ayuda, Preguntas frecuentes), testimonios (oculta) y CTA final. Salen de Inicio:
  casos de uso, contadores y FAQ (pasan a sus páginas; contadores a "Sé partner", enlazada solo
  desde el pie).
- **Rationale**: la medición (scroll a 360 px antes y después, quickstart) valida el ≥ 40 %; los
  ítems que salen de Inicio siguen completos en Funcionalidades / Para tu negocio.

## R16. Estructura bilingüe: un layout raíz por idioma

- **Decision**: dos grupos de rutas, cada uno con su propio layout raíz:
  `app/(es)/layout.tsx` (`<html lang="es-CL">`, rutas en la raíz) y
  `app/(en)/en/layout.tsx` (`<html lang="en">`, rutas bajo `/en`). Cada `page.tsx` es una línea
  que renderiza un componente de página compartido con el idioma (`<FeaturesPage locale="en" />`).
  Fuente, `globals.css` y script de tema van en un componente común `RootDocument` que ambos
  layouts usan.
- **Rationale**: `<html lang>` correcto por idioma (accesibilidad y SEO, FR-027) y direcciones
  propias por idioma (`/funcionalidades` ↔ `/en/features`) sin `rewrites` ni Proxy: todo sigue
  estático y `usePathname` no corre riesgo de desajuste al hidratar (`use-pathname.md`).
  `route-groups.md` documenta los varios layouts raíz; el costo es una recarga completa al cambiar
  de idioma, aceptable porque pasa una vez por visita.
- **Alternatives considered**:
  - `app/[lang]/...` con `rewrites` para dejar el español sin prefijo (guía de i18n de Next): las
    carpetas serían iguales en ambos idiomas (`/en/funcionalidades`) y `use-pathname.md` advierte
    desajustes de hidratación con rewrites.
  - Un solo layout con `lang="es-CL"` y `<div lang="en">` en las páginas en inglés: válido en HTML
    pero el documento declararía el idioma equivocado a buscadores.
  - Librerías de i18n (next-intl, etc.): dependencia nueva sin necesidad (Principio IV).

## R17. Registro de páginas bilingüe y selector de idioma

- **Decision**: `pages` en `site.ts` se indexa por clave estable (`home`, `features`,
  `business`, `partner`, `faq`, `help`, `download`, `privacy`) y guarda por idioma `href`,
  `navLabel`, `title`, `description`. Las guías tienen `slug` por idioma. El selector ES/EN
  (`LanguageSwitch`, componente de servidor) recibe la clave de página (o guía) desde el layout de
  cada página y enlaza a `pages[key][otroIdioma].href`. Es un `<a>` normal (recarga completa entre
  layouts raíz), con `hreflang` y `lang` en el enlace.
- **Rationale**: una sola tabla resuelve menú, pie, sitemap, hreflang y selector; el selector
  funciona sin JS. Para no pasar la clave por props en cada página, `NavLinks`/selector derivan la
  clave del pathname con una búsqueda inversa en `pages` (componente de cliente que ya usa
  `usePathname`, R2).
- **Alternatives considered**: traducir la URL con reglas de texto (frágil con slugs distintos).

## R18. Traducción y revisión del inglés (FR-029, FR-031)

- **Decision**: el agente traduce desde el español ya corregido (R8), con las mismas exclusiones de
  veracidad. Las guías citan los nombres de la app tal como aparecen, con traducción la primera vez
  (ENTRADA (stock in)). Antes del primer despliegue con inglés, el owner revisa todo el texto `en`
  (quickstart); hasta entonces `languages.en.published = false` en `site.ts` oculta selector,
  hreflang y sitemap en inglés **y** hace que el layout `(en)` llame a `notFound()`, de modo que
  ninguna dirección `/en/...` exista en el sitio publicado (FR-031; hallazgo C1 de
  `/speckit-analyze`). Ocultar solo los enlaces no basta: las páginas seguirían siendo públicas.
- **Rationale**: la constitución 3.0.0 exige revisión del owner; un interruptor único evita
  publicar inglés sin revisar sin bloquear el resto del sitio.

## R19. Idioma de la app en el sitio (FR-029, FR-011, US8-3)

- **Decision**: la app está en español e inglés según el idioma del celular (aclaración
  2026-11-10). Ambos idiomas del sitio tienen una FAQ "¿La app está en inglés?" / "Is the app
  available in English?". En inglés, Inicio y Descargar llevan además una nota corta: la app se
  muestra en inglés si el celular está en inglés, y las capturas del sitio muestran la versión en
  español. Las capturas aceptan variante por idioma con la misma convención que la oscura
  (`x.png` → `x-en.png`, y `x-oscuro-en.png`); si no existe, se usa la española.
- **Rationale**: Principio I: el inglés no puede afirmar nada que el español no diga, por eso la
  FAQ va en ambos idiomas; la nota evita que las capturas en español confundan.
- **Alternatives considered**: ocultar las capturas en inglés (pierde la prueba visual del producto).

## R20. WhatsApp por idioma (FR-030)

- **Decision**: `URLS` reemplaza `whatsappContador` por `whatsappPartner` y agrega
  `whatsappPartnerEn` y `whatsappGeneralEn`; el número es el mismo.
  `site.ts` expone por idioma qué enlace usa cada CTA.
- **Rationale**: el mensaje precargado es copy visible y va en el idioma de la página; las URLs
  siguen en la constante única (Principio II).

## R21. Anclas por idioma

- **Decision**: los `id` de rubros y funcionalidades se traducen (`#ferreteria` ↔
  `#hardware-store`, `#escaneo` ↔ `#scanning`). `#inicio` y `#como-funciona` existen solo en
  español (enlaces heredados); en inglés Inicio usa `#home` y `#how-it-works`.
- **Rationale**: anclas legibles en el idioma de la URL (FR-023); el selector cambia de página, no
  de ancla (edge case de la spec).

## R23. "Sé partner" (FR-010, US4)

- **Decision**: página simple en `/se-partner` y `/en/partner`, clave `partner`, `inNav: false`
  (solo pie). Contenido: título, bajada, las 4 razones de la sección Contadores actual (corregidas
  por R8) dirigidas a "contadores y asesores de pymes", y la CTA "Quiero ser partner" /
  "Become a partner" → WhatsApp con mensaje para partners. Sin comisiones ni beneficios
  (aclaración 2026-11-10). No aparece en los accesos de Inicio.
- **Rationale**: el owner la considera exploratoria; una página corta y compartible basta, y
  queda fuera de la navegación principal para no competir con la descarga.
- **Alternatives considered**: mantener `/contadores` destacada (rechazado por el owner);
  quitarla (pierde la dirección compartible).
