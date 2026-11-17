---

description: "Task list for feature 009-planes-pricing"
---

# Tasks: Página "Planes" (precios y prueba de disposición a pagar)

**Input**: Design documents from `specs/009-planes-pricing/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/routes.md](./contracts/routes.md), [contracts/content.md](./contracts/content.md), [contracts/events.md](./contracts/events.md), [quickstart.md](./quickstart.md)

**Tests**: la spec pide una verificación automática del contenido (SC-002). Se cubre con `planes-check.mjs` (Node, sin dependencias, research R9). El resto se verifica con `npm run lint`, `npm run build` y los escenarios de [quickstart.md](./quickstart.md).

**Organization**: tareas agrupadas por historia de usuario para implementar y probar cada una por separado.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (otro archivo, sin dependencias pendientes)
- **[Story]**: historia a la que pertenece (US1–US5)

## Reglas para todas las tareas

- Antes de usar una API de Next.js, verificar su firma en `node_modules/next/dist/docs/` (AGENTS.md). Antes de usar atributos de Umami, verificarlos con Context7 (constitución, restricciones técnicas).
- Ningún string visible en componentes: todo sale de `src/content/planes.ts` (Principio III).
- `src/content/planes.ts` y `src/lib/pricing.ts` solo pueden tener `import type` (research R9).
- Comentarios inline en todo bloque no obvio, explicando qué hace y por qué.
- Español con tuteo, sin jerga; nada que insinúe que hoy se puede pagar o contratar un plan (constitución 5.0.0, Principio I).
- Ningún `npm install` ni `npx` (Principio IV / flujo).

---

## Phase 1: Setup

**Purpose**: piezas compartidas sin cambio visible.

- [X] T001 [P] En `src/content/types.ts`: agregar `"plans"` a `PageKey`.
- [X] T002 [P] En `src/content/site.ts`: agregar a `URLS` la clave `umamiScript: "https://cloud.umami.is/script.js"` con comentario "script de medición de clics, solo en Planes (constitución 5.0.0, Principio IV; research R1)".
- [X] T003 [P] En `src/lib/contact.ts`: exportar `isEmail(value: string): boolean` que use la regex `EMAIL` existente sobre el valor recortado, y hacer que `validateField` la use en el caso `email`. Sin cambio de comportamiento en Contacto.

**Checkpoint**: `npm run build` y `npm run lint` pasan; Contacto valida igual que antes.

---

## Phase 2: Foundational (bloquea todas las historias)

**Purpose**: contenido completo, cálculo de precios, registro y página en español con esqueleto.

- [X] T004 Crear `src/lib/pricing.ts` (única importación: `import type { Period } from "../content/planes"`, ruta relativa para que Node la resuelva en `planes-check.mjs`; se borra al quitar tipos): `export const ANNUAL_MONTHS = 10`; `priceFor(monthlyPrice: number, period: Period): number` (`monthly → monthlyPrice`, `annual → monthlyPrice × 10`); `formatCLP(n: number): string` → `"$"` + `new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(n)` en ambos idiomas (research R4). Comentario explicando por qué 10 × y no −17 % (cifras redondas, spec FR-008).
- [X] T005 Crear `src/content/planes.ts` con los tipos exactos de [contracts/content.md](./contracts/content.md) (`PlanId`, `Period`, `PlanItem`, `Plan`, `PlanText`, `PlansContent`) y: `export const plans: Plan[]` en orden free, standard, premium con `monthlyPrice` 0 / 9990 / 19990, `warehouses` 1 / 3 / `"unlimited"`, `recommended` solo en standard, `includesFrom` null / `"free"` / `"standard"`; y `export const planes: Localized<PlansContent>`. Ítems (FR-002b): Free = "1 usuario", "Productos", "Movimientos: entradas, salidas y ajustes", "Alertas de stock mínimo", "Funciona sin internet"; Standard = "Usuarios con roles (Administrador y Operador)", "Panel web", "Reportes y exportar a Excel"; Premium = "Varias empresas en una cuenta" con `soon: true`, "Atención prioritaria". Textos ES: `price.tax = "+ IVA"`, `price.freeForever = "Gratis para siempre"`, `periods.annualSaving = "2 meses gratis"`, `recommended = "Recomendado"`, `soon = "Próximamente"`, `referenceNote = "Precios referenciales, pueden cambiar"`, `cta.free = "Empezar gratis"`, `cta.paid = "Quiero el plan {plan}"`, `trial` = prueba de 14 días con funciones de plan pago, sin tarjeta, y después paso a Free sin perder datos; `dialog.sent` = "Recibimos tu interés en {plan}" + "Te contactamos para contarte cómo empezar." (sin prometer cobro, activación ni precio, FR-016); `dialog.privacyNote` = para qué se usan correo y WhatsApp + enlace "política de privacidad"; `noScriptWhatsapp = "Hola, quiero el plan {plan} ({period})"`; `email.subjectPrefix = "Planes"` y rótulos. Inglés: traducción equivalente ("+ VAT", "Free forever", "2 months free", "Coming soon", "Reference prices, subject to change", "Start free", "I want the {plan} plan", trial "14 days", "no card"), mismos ítems y mismas marcas `soon`. El plan Free MUST NOT contener "prueba" ni "trial" en ningún idioma (FR-007). Encabezado de archivo con las reglas de la constitución que aplican (como `contacto.ts`).
- [X] T006 En `src/content/site.ts`: agregar al registro `pages`, justo después de la entrada `business`, `{ key: "plans", inNav: true, published: true, locales: { es: { href: "/planes", navLabel: "Planes", title: "Planes y precios", description: "Free, Standard y Premium: qué incluye cada plan de StoreFlow y sus precios referenciales. Empieza gratis, para siempre." }, en: { href: "/en/plans", navLabel: "Plans", title: "Plans and pricing", description: "Free, Standard and Premium: what each StoreFlow plan includes and its reference prices. Start free, forever." } } }` (research R10).
- [X] T007 Crear `src/components/pages/PlansPage.tsx` (Server Component, `{ locale }`): `PageHeader` con `planes[locale].header` (sin CTA) y una `<section id="planes" aria-labelledby=…>` con `Container`, un comentario "bloque de planes: US1" y el aviso `referenceNote` debajo (FR-018). El `id="planes"` es el ancla de FR-020.
- [X] T008 [P] Crear `src/app/(es)/planes/page.tsx` (`export const metadata = pageMetadata("plans", "es")`, renderiza `<PlansPage locale="es" />`) y `src/app/(es)/planes/opengraph-image.tsx` (patrón de `src/app/(es)/contacto/opengraph-image.tsx` con `"plans"`).

**Checkpoint**: `/planes` existe; "Planes" aparece en el menú entre "Para tu negocio" y "Preguntas frecuentes", en el pie y en `/sitemap.xml`; `/planes#planes` baja al apartado (quickstart #2).

---

## Phase 3: User Story 1 - Ver los 3 planes y decidir cuál me sirve (Priority: P1) 🎯 MVP

**Goal**: la vitrina completa en precio mensual, con botones visibles (los pagos aún sin ventana).

**Independent Test**: abrir `/planes` y ver Free, Standard (Recomendado) y Premium con precio, "+ IVA" en los pagos, límite en bodegas, frase, lista y botón; correr `planes-check.mjs` en verde; cambiar un precio en `planes.ts` y verlo reflejado (quickstart #1–#5).

- [X] T009 [P] [US1] Crear `specs/009-planes-pricing/planes-check.mjs` (estilo de `specs/008-tema-claro-contraste/contrast-check.mjs`: encabezado con uso y qué verifica, líneas PASS/FAIL, código 1 si hay algún FAIL) que importe `../../src/content/planes.ts` y `../../src/lib/pricing.ts` y verifique las 9 invariantes de [contracts/content.md](./contracts/content.md), más: `priceFor(p, "annual") === p × 10` para cada plan pago y `formatCLP(9990) === "$9.990"` (SC-002, SC-006, SC-009, SC-010, SC-011, SC-012, SC-014).
- [X] T010 [P] [US1] Crear `src/components/sections/PlanCard.tsx` (sin estado, sin `"use client"`): recibe `plan`, `text: PlanText`, `content: PlansContent`, `period`, `locale` y un `cta: React.ReactNode`. Muestra: etiqueta "Recomendado" si `plan.recommended`; nombre; `tagline`; precio con `formatCLP(priceFor(...))` + "/mes" o "/año" + `price.tax` solo si `monthlyPrice > 0`, y en Free `price.freeForever` (research R4); límite con `warehouses.one`/`upTo`/`unlimited` reemplazando `{n}`; "Todo lo de {plan}" si `includesFrom`; lista de ítems con ícono `check` y, si `soon`, una etiqueta `content.soon` visible en texto (no solo color); y el `cta`. Standard con borde/acento de recomendado usando tokens existentes; contraste AA en ambos temas (SC-008).
- [X] T011 [US1] Crear `src/components/sections/PlansGrid.tsx` (`"use client"`, `{ locale }`): estado `period` (por ahora fijo en `"monthly"`, US3 agrega el selector), grilla `grid gap-6 lg:grid-cols-3` con un `PlanCard` por elemento de `plans`. CTA de Free: `<a href={URLS.googlePlay}>` con `buttonClasses("secondary", "lg")` y `cta.free`. CTA de pagos: enlace a WhatsApp con `whatsappLink(noScriptWhatsapp)` (plan y periodicidad reemplazados), `buttonClasses("primary", "lg")` en Standard y `"secondary"` en Premium (Principio II, excepción Planes). US2 los convierte en botones.
- [X] T012 [US1] En `src/components/pages/PlansPage.tsx`: reemplazar el comentario del bloque por `<PlansGrid locale={locale} />` y agregar, después de la grilla, el bloque de la prueba de 14 días con `trial.title`, `trial.body` y la etiqueta `soon` (FR-009, SC-012).
- [X] T013 [P] [US1] En `src/content/preguntas.ts`: reemplazar la respuesta de "¿Cuánto cuesta?" por "Puedes empezar gratis, para siempre. Los planes pagados vienen pronto: mira sus precios referenciales en Planes." y su par en inglés ("You can start for free, forever. Paid plans are coming soon: see their reference prices on Plans."), y agregar al ítem `page: "plans"`. En `src/content/types.ts` agregar `page?: PageKey` a `FaqItem`; en `src/components/sections/FaqGroups.tsx` renderizar ese enlace con el mismo estilo que el de guía, usando `pageHref` de `@/lib/i18n` y el `navLabel` de la página (research R11).

**Checkpoint**: quickstart #1–#5 y #17 pasan; `node specs/009-planes-pricing/planes-check.mjs` termina con código 0.

---

## Phase 4: User Story 2 - Decir "quiero este plan" sin pagar (Priority: P1)

**Goal**: botón → ventana → correo al owner; clics contados; sin cobro.

**Independent Test**: tocar "Quiero el plan Standard", enviar un correo válido y recibir 1 correo "Planes · Standard · Mensual"; probar errores, Esc, foco y el `curl` de la ruta; ver los eventos en Umami (quickstart #7–#15).

- [X] T014 [P] [US2] Crear `src/lib/planes.ts` (lógica pura, la usan navegador y ruta): tipos `IntentData = { plan: "standard" | "premium"; period: Period; email: string; whatsapp: string }`, `IntentErrors = Partial<{ plan: "invalid"; email: "required" | "email"; whatsapp: "whatsapp" }>`, `Origin` con `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `referrer`. Constantes `MAX_LENGTH = { email: 254, whatsapp: 30, utm: 100, referrer: 500 }`. `isChileanMobile(raw)`: vacío no aplica; solo `[0-9+\-(). ]`; quitando no-dígitos queda `9` + 8 dígitos (9 en total) o `569` + 8 dígitos (11 en total) (research R8). `validateIntent(data)`: plan ∉ {standard, premium} o period ∉ {monthly, annual} → `plan: "invalid"`; correo vacío → `required`, sin forma `algo@algo.algo` (`isEmail` de `./contact`) o > 254 → `email`; WhatsApp no vacío inválido o > 30 → `whatsapp`. `sanitizeOrigin(raw)`: toma solo esas claves como texto, recorta a 100/500, descarta vacías. `buildIntentEmail({ data, origin, locale, receivedAt })` → `{ subject: "Planes · <Plan> · <Mensual|Anual>", text }` con una línea "Rótulo: valor" por dato en orden plan, periodicidad, precio mostrado (`formatCLP(priceFor(...))` + "/mes|/año + IVA", recalculado aquí, research R3), correo, WhatsApp (si hay), fecha y hora (`toLocaleString("es-CL", { timeZone: "America/Santiago" })`), idioma, origen (si hay); texto plano, rótulos de `planes.es.email`.
- [X] T015 [US2] Crear `src/app/api/plan-intent/route.ts` siguiendo [contracts/routes.md](./contracts/routes.md) y el patrón de `src/app/api/contact/route.ts`: encabezado de comentario (constitución 5.0.0, Principio IV; no guarda nada; variables `RESEND_API_KEY` y `CONTACT_TO_EMAIL`); JSON inválido → 400 `{ ok: false }`; campo trampa `website` con texto → 200 `{ ok: true }` sin enviar; `locale` distinto de `"en"` → `"es"`; leer solo `plan`, `period`, `email`, `whatsapp`, `origin` como texto (ignorar cualquier precio recibido); `validateIntent` con errores → 400 `{ ok: false, errors }`; sin variables → `console.error` sin datos del visitante y 500; enviar a Resend con `from` igual a Contacto, `to: [CONTACT_TO_EMAIL]`, `subject`/`text` de `buildIntentEmail` y `reply_to` = correo; Resend no ok → `console.error` con código y 502; si no, 200 `{ ok: true }`.
- [X] T016 [P] [US2] Crear `src/components/sections/PlanIntentDialog.tsx` (`"use client"`): `<dialog>` controlado por un `ref` y una prop `open: { plan, period } | null` + `onClose`; abre con `showModal()`. Título `dialog.title` y resumen `dialog.summary` (plan · periodicidad · precio con "+ IVA"). Campos correo (`type="email"`, `autoComplete="email"`, `maxLength=254`, `autoFocus`, `aria-required`) y WhatsApp (`type="tel"`, `inputMode="tel"`, `autoComplete="tel"`, `maxLength=30`, con `hint`). Validación con `validateIntent` antes de enviar y al corregir tras el primer intento; errores con texto + ícono `alert` y `aria-describedby`; foco al primer campo con error; campo trampa `website` igual que Contacto. Envío `POST /api/plan-intent` con `{ locale, plan, period, email, whatsapp, origin, website }`, donde `origin` = UTM de `window.location.search` + `document.referrer` (research R7). Estados `idle | sending | sent | failed | errors` (data-model §4): `sending` deshabilita el botón; `sent` reemplaza el formulario por `dialog.sent` en la misma ventana; `failed` conserva lo escrito y muestra `dialog.failed` con enlace a la página Contacto (`pageHref("contact", locale)`). Región `role="status"`. Cerrar: botón `dialog.close`, Esc (evento `cancel`/`close`) y clic en el fondo (destino del clic === el `<dialog>`); al cerrar llamar `onClose` y limpiar el estado. `dialog.privacyNote` con enlace a `URLS.privacyPolicy` (FR-017). Animación de entrada solo con `motion-safe:`.
- [X] T017 [US2] En `src/components/sections/PlansGrid.tsx`: con el patrón `useHydrated` de `ContactForm.tsx`, antes de hidratar los CTA pagos siguen siendo el enlace a WhatsApp (sin JS, research R5); después son `<button type="button">` con `cta.paid` que guardan el botón en un ref, fijan `open = { plan, period }` y montan un único `PlanIntentDialog`; `onClose` devuelve el foco al botón guardado (FR-011). Los 3 CTA envían el evento `plan-cta` de [contracts/events.md](./contracts/events.md) con `window.umami?.track(...)` en su `onClick` (`plan`, `period` actual, `kind` = `activation` en Free / `intent` en pagos, `lang`) (FR-015, SC-003). *Corregido en T023: con `data-auto-track="false"` Umami ignora los atributos `data-umami-event`.*
- [X] T018 [US2] En `src/components/pages/PlansPage.tsx`: si `process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID` existe, renderizar `<Script src={URLS.umamiScript} data-website-id={…} data-auto-track="false" strategy="afterInteractive" />` de `next/script` (verificar props en `node_modules/next/dist/docs/01-app/03-api-reference/02-components/script.md`); si no existe, no renderizar nada. Comentario: solo en Planes, sin cookies ni datos personales (constitución 5.0.0; research R1).

**Checkpoint**: quickstart #7–#15 pasan (los que dependen de Resend o Umami, con las variables cargadas en `.env.local`).

---

## Phase 5: User Story 3 - Comparar precio mensual y anual (Priority: P2)

**Goal**: selector Mensual/Anual con precios anuales y "2 meses gratis".

**Independent Test**: cambiar a Anual y ver Standard $99.900 + IVA y Premium $199.900 + IVA con "2 meses gratis"; Free en $0; enviar una intención y recibirla como Anual (quickstart #4, #10).

- [X] T019 [US3] En `src/components/sections/PlansGrid.tsx`: agregar el selector sobre la grilla como `<fieldset>` con `<legend>` (`periods.legend`, puede ser `sr-only`) y dos `<input type="radio" name="period">` nativos estilizados como control segmentado ("Mensual" marcado por defecto, "Anual" con la etiqueta `periods.annualSaving`), operables con teclado y foco visible (FR-008, FR-023). Al cambiar, actualizar `period`; las tarjetas, los atributos `data-umami-event-period`, el mensaje sin JS y la ventana usan ese valor. Antes de hidratar, el selector se muestra deshabilitado en Mensual.

**Checkpoint**: quickstart #4 pasa; los eventos de Umami y el asunto del correo reflejan Anual (quickstart #10, #14).

---

## Phase 6: User Story 4 - Comparar en el celular sin desplazarse de lado (Priority: P2)

**Goal**: la página se lee completa a 360 px.

**Independent Test**: quickstart #6 a 360, 768 y 1440 px.

- [X] T020 [US4] Revisar `/planes` a 360, 768 y 1440 px en tema claro y oscuro, con y sin la ventana abierta, y ajustar en `src/components/sections/PlanCard.tsx`, `PlansGrid.tsx` y `PlanIntentDialog.tsx` lo que desborde: precios que no quiebren (`whitespace-nowrap` en monto y unidad), selector que quepa en 360 px, ventana con `max-w` y `w-[calc(100%-2rem)]`, contenido con `min-w-0`. A 1440 px, 3 columnas (SC-001).

**Checkpoint**: sin desplazamiento horizontal en los tres anchos.

---

## Phase 7: User Story 5 - Identificar el plan para contadores (Priority: P3)

**Goal**: Premium comunica varias empresas en una cuenta como "Próximamente".

**Independent Test**: solo Premium muestra "Varias empresas en una cuenta · Próximamente", en ambos idiomas.

- [X] T021 [US5] Agregar a `specs/009-planes-pricing/planes-check.mjs` una verificación: el único ítem que menciona "empresas" / "companies" está en Premium y tiene `soon: true`, en ambos idiomas (SC-016, US-5).

**Checkpoint**: `planes-check.mjs` en verde; revisión visual de Premium.

---

## Phase 8: Polish & Cross-Cutting Concerns

- [X] T022 [P] Crear `src/app/(en)/en/plans/page.tsx` (`pageMetadata("plans", "en")`, `<PlansPage locale="en" />`) y `src/app/(en)/en/plans/opengraph-image.tsx` (patrón de `src/app/(en)/en/contact/`). Queda oculta mientras `languages.en.published` sea `false` (FR-021, research R10).
- [X] T023 Verificar con Context7 los atributos `data-website-id`, `data-auto-track` y el envío de eventos de Umami usados en `src/components/sections/PlansGrid.tsx` y `src/components/pages/PlansPage.tsx`, y corregir si difieren (constitución, restricciones técnicas).
- [X] T024 Correr `node specs/009-planes-pricing/planes-check.mjs`, `npm run lint` y `npm run build`; corregir todo error o advertencia nueva.
- [ ] T025 Recorrer los 17 escenarios de [quickstart.md](./quickstart.md), incluido Lighthouse móvil en `/planes` (Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, SC-017) y contraste en ambos temas (SC-008); anotar resultados en este archivo.
- [X] T026 Revisar el copy de `src/content/planes.ts` y `src/content/preguntas.ts` contra el Principio I (5.0.0) y VII: montos solo en Planes, "Próximamente" en lo que no existe, nada que insinúe que hoy se puede pagar, tuteo, sin jerga, inglés sin decir más que el español.
- [ ] T027 Dejar en el resumen del PR las tareas del owner fuera del repo, que bloquean la **publicación**: (1) crear el sitio en Umami Cloud y cargar `NEXT_PUBLIC_UMAMI_WEBSITE_ID` en Vercel; (2) actualizar la política de privacidad en `URLS.privacyPolicy` con el correo y WhatsApp del formulario de Planes y el conteo de clics (FR-017, research R12); (3) confirmar los montos ($9.990 y $19.990) en `src/content/planes.ts`; (4) redeploy tras cargar variables.

---

## Resultados de la implementación (2026-11-16)

- `planes-check.mjs`: todo PASS. `npm run lint` y `npm run build` limpios.
- Ruta `/api/plan-intent` (quickstart #11, #12 y variantes): JSON inválido 400; `free` y periodicidad inválida 400 `plan`; correo vacío/malo 400; WhatsApp `123` y fijo `+56 2…` 400; campo trampa 200 sin envío; válido sin variables de Resend 500.
- Navegador (dev): Anual → $99.900 / $199.900 /año + IVA; ventana modal con foco en el correo; error "Escribe tu correo." con foco y resumen; Esc, "Cerrar" y clic en el fondo cierran y devuelven el foco al botón; falla de envío conserva lo escrito y ofrece Contacto; eventos `plan-cta` correctos en los 3 botones (SC-003, con `umami` simulado).
- 360 y 768 px sin desplazamiento horizontal; ventana con 16 px por lado. Tema claro revisado.
- Sin JavaScript (HTML del servidor): botones pagos enlazan a `wa.me` con "Hola, quiero el plan Standard (mensual)".
- **Pendiente en T025**: quickstart #10 (correo real, requiere `RESEND_API_KEY`/`CONTACT_TO_EMAIL` en `.env.local`), #14 con Umami real y #16 Lighthouse móvil (no se instaló Lighthouse: requiere aprobación del owner).
- **T027**: queda para el PR (tareas del owner).

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias; T001–T003 en paralelo.
- **Foundational (Phase 2)**: T004 y T005 se escriben juntos (T004 importa tipos de T005); T006 depende de T001; T007 depende de T005; T008 de T006 y T007. Bloquea todas las historias.
- **US1 (Phase 3)**: depende de Phase 2. T009 y T010 en paralelo; T011 depende de T010; T012 de T011; T013 independiente.
- **US2 (Phase 4)**: depende de US1 (T011: el grid y los CTA ya existen) y de T003. T014 y T016 en paralelo (T016 usa los tipos de T014: definirlos primero); T015 depende de T014; T017 de T016; T018 independiente dentro de la fase.
- **US3 (Phase 5)**: depende de US1; se integra mejor tras US2 (el período viaja a la ventana y a los eventos).
- **US4 (Phase 6)**: después de US1–US3 (revisa su diseño final).
- **US5 (Phase 7)**: depende de T009.
- **Polish (Phase 8)**: T022 puede hacerse desde Phase 2; el resto al final.

### Story completion order

Setup → Foundational → US1 (MVP vitrina) → US2 (prueba de disposición a pagar) → US3 → US4 → US5 → Polish.

## Parallel Example: Phase 1

```text
T001 src/content/types.ts   |   T002 src/content/site.ts (URLS)   |   T003 src/lib/contact.ts
```

## Parallel Example: User Story 1

```text
T009 planes-check.mjs   |   T010 PlanCard.tsx   |   T013 FAQ "Precio"
```

## Parallel Example: User Story 2

```text
T014 src/lib/planes.ts   |   T016 PlanIntentDialog.tsx   |   T018 Script de Umami en PlansPage.tsx
```

## Implementation Strategy

### MVP

1. Phase 1 + Phase 2 → la página existe en menú, pie y sitemap.
2. Phase 3 (US1) → vitrina completa con precios mensuales; sin JS los botones pagos ya llevan a WhatsApp con el plan. **Se puede revisar, pero no publicar solo**: la prueba de disposición a pagar (objetivo de la spec) llega con US2.

### Entrega incremental

3. Phase 4 (US2) → formulario por correo y conteo de clics: **mínimo publicable**.
4. Phase 5 (US3) → anual.
5. Phase 6–7 (US4, US5) → ajustes de celular y verificación de contadores.
6. Phase 8 → inglés (oculto), verificación completa y tareas del owner.

## Notes

- Commits en Conventional Commits (`feat:`, `content:`, `test:`), uno por fase o por tarea grande.
- No publicar (merge a `main`) hasta resolver las tareas del owner de T027.
