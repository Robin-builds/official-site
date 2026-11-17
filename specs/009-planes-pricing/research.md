# Research: Página "Planes" (spec 009)

Decisiones técnicas que resuelven las incógnitas del plan. Formato: decisión, por qué, alternativas.

## R1. Herramienta para contar clics

- **Decisión**: **Umami Cloud** (plan gratuito), cargado con `next/script` **solo en la página
  Planes**, con todo el seguimiento automático desactivado (`data-auto-track="false"`). Cada clic
  en los botones de los planes se envía con `umami.track("plan-cta", {...})`.
- **Por qué**:
  - No usa cookies ni guarda IP ni datos personales, así que no requiere aviso de cookies
    (constitución 5.0.0, Principio IV: "sin cookies de seguimiento ni datos personales").
  - Script de ~2 KB, sin paquete npm: no entra a `package.json`.
  - El evento lleva plan, periodicidad, tipo e idioma; el panel de Umami desglosa los eventos por
    esas propiedades (SC-015).
  - Con `data-auto-track="false"` no mide páginas ni nada automático; solo los clics que el código
    de Planes envía. Si el visitante sigue navegando, no se registra nada más.
  - El plan gratuito alcanza de sobra para el volumen de una prueba de precios (límite mensual de
    eventos a confirmar al crear la cuenta).
- **Alternativas**:
  - *Vercel Web Analytics*: los eventos propios (`track()`) requieren plan Pro; además mide todas
    las páginas.
  - *Plausible*: equivalente en privacidad, pero de pago.
  - *GoatCounter*: gratuito, pero los eventos con propiedades son más limitados.
  - *Contar clics con una ruta propia*: la constitución prohíbe guardar datos en el servidor.
- **Configuración**: `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (variable de Vercel; no es secreta). La URL
  del script vive en `URLS.umamiScript` (Principio II). Si la variable falta, no se carga el script:
  la página y el formulario funcionan igual, solo no se cuentan clics.
- **Verificado en la implementación (T023, Context7)**: según la documentación de Umami,
  `data-auto-track="false"` desactiva también el seguimiento de los atributos `data-umami-event`.
  El diseño inicial (atributos) no habría contado nada; se cambió a `umami.track()` explícito.

## R2. Envío de la intención

- **Decisión**: ruta nueva `POST /api/plan-intent`, gemela de `/api/contact`: misma API de Resend,
  mismo remitente, mismas variables (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`), mismo campo trampa
  `website`, `reply_to` con el correo del visitante. No guarda nada.
- **Por qué**: la constitución 5.0.0 autoriza exactamente esta ruta con las mismas reglas que
  Contacto; reutilizar el patrón probado reduce riesgo.
- **Alternativas**: *reutilizar `/api/contact` con un campo `plan`*: mezcla dos formularios con
  validaciones distintas y rompe la regla "una ruta por excepción".

## R3. Precio que va en el correo

- **Decisión**: el servidor **recalcula** el precio a partir de `plan` y `period` con el mismo
  contenido y la misma función que la página; el navegador no envía el precio.
- **Por qué**: lo que llega del navegador no es confiable. Como contenido y función son los mismos,
  el precio coincide con el que vio el visitante (salvo un despliegue de precios entre que abrió la
  página y envió, caso despreciable que además queda fechado).

## R4. Regla anual y formato

- **Decisión**: `annual = monthly × 10`. Formato `Intl.NumberFormat("es-CL")` sin decimales en
  **ambos idiomas** ("$9.990", "$99.900"), porque la moneda es CLP y el lector inglés de este
  sitio es igualmente un negocio chileno.
- **Interpretación de FR-006/SC-014**: "+ IVA" acompaña a los precios de **los planes pagos**.
  Free muestra "$0" y "Gratis para siempre", sin "+ IVA" (un "$0 + IVA" confunde). La verificación
  de SC-014 se aplica a Standard y Premium en ambas periodicidades.

## R5. Botón de plan pago sin JavaScript

- **Decisión**: mejora progresiva. El HTML del servidor trae un **enlace a WhatsApp** con el
  mensaje "Hola, quiero el plan Standard (mensual)" (o Premium). Al hidratar, el mismo lugar pasa a
  ser un **botón** que abre la ventana del formulario (patrón `useHydrated` de Contacto).
- **Por qué**: sin JavaScript el formulario de Contacto también queda deshabilitado, así que
  enviarlo ahí no sirve; WhatsApp es la vía que la spec acepta ("por ejemplo, la página de
  Contacto") y que funciona sin JS. Con JS, un `<button>` es el rol correcto para abrir una ventana.
- **Alternativas**: *un `<a>` interceptado con JS*: rol de enlace para algo que no navega (mala
  accesibilidad).

## R6. Ventana del formulario

- **Decisión**: `<dialog>` nativo abierto con `showModal()`.
- **Por qué**: el navegador da gratis Esc para cerrar, foco atrapado (el resto de la página queda
  inerte) y la capa superior. Se agrega: cerrar al tocar el fondo (clic cuyo destino es el propio
  `<dialog>`), botón "Cerrar", foco inicial en el correo (`autoFocus`) y devolución explícita del
  foco al botón que la abrió (algunos navegadores ya lo hacen; explicitarlo lo asegura).
- **Alternativas**: *librería de modales*: dependencia nueva sin necesidad (Principio IV).

## R7. Origen (campaña y procedencia)

- **Decisión**: al enviar, el navegador lee `utm_source`, `utm_medium`, `utm_campaign`,
  `utm_term` y `utm_content` de la dirección **actual** y `document.referrer`. No se guarda nada
  en el navegador.
- **Por qué**: las campañas de la prueba deben enlazar directo a `/planes`; guardar los UTM de una
  visita previa exigiría almacenamiento en el navegador que el pedido no justifica.
- **Consecuencia documentada**: si alguien llega por campaña a Inicio y luego entra a Planes, el
  origen llega vacío (o con Inicio como procedencia).

## R8. Validación del WhatsApp opcional

- **Decisión**: vacío es válido. Si se escribe: solo dígitos, espacios y `+ - ( ) .`; quitando
  todo lo que no es dígito debe quedar `9XXXXXXXX` (9 dígitos) o `569XXXXXXXX` (11 dígitos).
- **Por qué**: la spec pide "celular chileno"; la regla genérica de Contacto (8 a 15 dígitos)
  aceptaría fijos y números extranjeros.
- El correo usa la misma regla mínima que Contacto (`algo@algo.algo`), exportada desde
  `src/lib/contact.ts` para no duplicarla.

## R9. Verificación automática sin dependencias

- **Decisión**: un script `specs/009-planes-pricing/planes-check.mjs` que Node 22.19 ejecuta
  importando directamente `src/content/planes.ts` y `src/lib/pricing.ts` (Node ≥ 22.18 quita los
  tipos de TypeScript sin flag). Para que funcione, esos dos archivos **solo** tienen
  `import type` (ninguna importación en tiempo de ejecución).
- Verifica SC-002, SC-006, SC-009, SC-010, SC-011, SC-012 y SC-014 sobre los datos.
- SC-003/SC-004/SC-005/SC-007 se verifican con los escenarios de [quickstart.md](./quickstart.md)
  (peticiones con `curl` a la ruta y revisión de red en el navegador).
- **Alternativas**: *Vitest/Playwright*: dependencias nuevas que requieren aprobación; se dejan
  fuera, igual que en las specs 006 y 008.

## R10. Ubicación en el menú y en el registro de páginas

- **Decisión**: clave `plans` en `PageKey`; entrada en `pages` entre "Para tu negocio" y
  "Preguntas frecuentes", con `inNav: true`. Direcciones `/planes` y `/en/plans`. Menú, pie,
  selector de idioma, hreflang y sitemap salen solos del registro.
- La página en inglés existe y compila (Principio III) pero queda oculta mientras
  `languages.en.published` sea `false`, como el resto del inglés.

## R11. Textos existentes que contradicen la constitución 5.0.0

- La FAQ "Precio" dice "También hay planes pagados para negocios con más necesidades": insinúa que
  hoy se pueden contratar, lo que el Principio I (5.0.0) prohíbe. **Decisión**: reescribirla a
  "Puedes empezar gratis, para siempre. Los planes pagados vienen pronto: mira sus precios
  referenciales en Planes." (y su par en inglés) con enlace a la página.
- "Gratis para empezar" en Inicio y Descargar no contradice nada; se mantiene.

## R12. Política de privacidad

- `privacidad.es.text` es `null`: el sitio enlaza a la política externa `URLS.privacyPolicy`.
  FR-017 exige que esa política declare el correo y el WhatsApp del formulario de Planes y la
  medición de clics. **Es una tarea del owner fuera del repositorio** y bloquea la publicación
  (no la implementación). El aviso junto al formulario enlaza a `URLS.privacyPolicy`.
