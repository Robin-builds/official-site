---

description: "Task list for feature 006-contacto"
---

# Tasks: Página de Contacto

**Input**: Design documents from `specs/006-contacto/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/routes.md](./contracts/routes.md), [contracts/content.md](./contracts/content.md), [quickstart.md](./quickstart.md)

**Tests**: la spec no pide pruebas automatizadas y el proyecto no tiene suite (research R12). La verificación es `npm run build`, `npm run lint` y los escenarios de [quickstart.md](./quickstart.md).

**Organization**: tareas agrupadas por historia de usuario para implementar y probar cada una por separado.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (otro archivo, sin dependencias pendientes)
- **[Story]**: historia a la que pertenece (US1, US2, US3)

## Reglas para todas las tareas

- Antes de usar una API de Next.js, verificar su firma en `node_modules/next/dist/docs/` (AGENTS.md).
- Ningún string visible en componentes: todo sale de `src/content/` (Principio III).
- Comentarios inline en todo bloque no obvio, explicando qué hace y por qué.
- Español con tuteo, sin jerga; sin prometer tiempos de respuesta, llamadas ni demos (FR-012).

---

## Phase 1: Setup

**Purpose**: número real y piezas compartidas que no cambian el comportamiento visible salvo el número.

- [X] T001 En `src/content/site.ts`: cambiar `WHATSAPP_NUMBER` a `"56957596588"`, borrar el comentario `PLACEHOLDER` de esa línea (dejar uno que diga que es el número de StoreFlow, formato internacional sin "+" ni espacios, y que si cambia hay que regenerar los QR de `public/contact/`, research R8) y exportar `whatsappLink(message: string)` (`export const whatsappLink = …`) sin cambiar su cuerpo (FR-009, research R2).
- [X] T002 [P] En `src/components/ui/Button.tsx`: extraer y exportar `buttonClasses(variant: "primary" | "secondary" | "ghost" = "primary", size: "sm" | "md" | "lg" = "md", className = "")` que devuelva exactamente las clases que hoy arma `Button` (incluida la regla de `ghost` que reemplaza `px-*` por `px-2`); `Button` pasa a usarla. Sin cambio visual (research R10).
- [X] T003 [P] En `src/content/types.ts`: agregar `"contact"` a `PageKey`.

**Checkpoint**: `npm run build` pasa; pie y "Sé partner" abren `wa.me/56957596588` (quickstart #25).

---

## Phase 2: Foundational (bloquea todas las historias)

**Purpose**: contenido de la página, registro y ruta en español con un esqueleto que luego llenan US1 y US2.

- [X] T004 Crear `src/content/contacto.ts` con el tipo `ContactContent` exacto de [contracts/content.md](./contracts/content.md) (exportar también `ContactField = "name" | "company" | "phone" | "email" | "message"` y `ContactError = "required" | "email" | "phone"`) y `export const contacto: Localized<ContactContent>`. Español: copiar literal la tabla "Copy propuesto (ES)" del contrato; `errors.phone` y `errors.email` solo con su código (`phone`/`email`), `errors.name` y `errors.company` solo con `required`, `errors.message` vacío `{}`; `errorSummary = { one: "Revisa 1 campo.", other: "Revisa {n} campos." }`; `message.labels = { name: "Nombre", company: "Empresa", phone: "Teléfono", email: "Correo", message: "Mensaje" }`; `alternatives.direct = { label: "Escribir por WhatsApp", href: whatsapp.es.general }`; `qr.src = "/contact/whatsapp-es.svg"`. Inglés: traducción equivalente (segunda persona, sin jerga, sin afirmar nada que el español no afirme) con `href: whatsapp.en.general` y `qr.src = "/contact/whatsapp-en.svg"`. Encabezado de archivo con las reglas de la constitución que aplican (como `partner.ts`) y un comentario con los dos comandos de regeneración del QR de research R8.
- [X] T005 En `src/content/site.ts`: agregar al registro `pages`, justo después de la entrada `help`, la entrada `{ key: "contact", inNav: true, published: true, locales: … }` con los valores de la tabla "Registro de páginas" de [data-model.md](./data-model.md) (`/contacto` · "Contacto" · title "Contacto" · description "Envíanos tus datos por WhatsApp o escríbenos directo para conversar sobre StoreFlow."; `/en/contact` · "Contact" · "Contact" · "Send us your details on WhatsApp or message us directly to talk about StoreFlow."). Comentario: "al final del menú, enlace normal (aclaración 2026-11-15, Principio II)".
- [X] T006 Crear `src/components/pages/ContactPage.tsx` (Server Component, `{ locale }`): `PageHeader` con `contacto[locale].header` (sin CTA) y una `<section>` con `Container` y grid `grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16` con dos columnas vacías marcadas con comentario ("formulario: US1", "alternativas: US2"), según [contracts/routes.md](./contracts/routes.md).
- [X] T007 [P] Crear `src/app/(es)/contacto/page.tsx` (`export const metadata = pageMetadata("contact", "es")`, renderiza `<ContactPage locale="es" />`) y `src/app/(es)/contacto/opengraph-image.tsx` (copiar el patrón de `src/app/(es)/se-partner/opengraph-image.tsx` con `"contact"`).

**Checkpoint**: `/contacto` existe con título; "Contacto" aparece último en el menú (escritorio y desplegable) y marcado como actual; está en `/sitemap.xml` (quickstart #1, #2, #21, #22).

---

## Phase 3: User Story 1 - Dejar mis datos para que me contacten (Priority: P1) 🎯 MVP

**Goal**: el visitante completa el formulario y llega a WhatsApp con sus datos rotulados, sin que nada salga del navegador.

**Independent Test**: desde cualquier página entrar a Contacto, completar nombre, empresa, teléfono y correo, enviar y verificar que WhatsApp abre en pestaña nueva hacia +56 9 5759 6588 con los cuatro datos rotulados (quickstart #3–#14, #18–#20).

### Implementation for User Story 1

- [X] T008 [P] [US1] Crear `src/lib/contact.ts` con funciones puras (sin React):
  - `type ContactData = Record<ContactField, string>`.
  - `validateContact(data): Partial<Record<ContactField, ContactError>>` sobre valores con `trim()`: `name` y `company` "no vacío" → `required`; `phone` "si no está vacío: solo `0-9 + - ( ) .` y espacios; 8–15 dígitos" → `phone`; `email` "si no está vacío: `^[^\s@]+@[^\s@]+\.[^\s@]+$`" → `email`; `message` sin regla.
  - `buildContactMessage(data, text: ContactContent["message"]): string`: primera línea `text.greeting`, luego `"<rótulo>: <valor recortado>"` en el orden name, company, phone, email, message, omitiendo los opcionales vacíos; líneas unidas con `"\n"`. El teléfono se envía tal como se escribió (solo recortado).
  - `contactLink(data, text)`: `whatsappLink(buildContactMessage(data, text))` importada de `@/content/site` (research R3).
- [X] T009 [US1] Crear `src/components/sections/ContactForm.tsx` (`"use client"`, props `{ content: ContactContent["form"]; message: ContactContent["message"]; locale: Locale }`), según research R5–R7 y [data-model.md](./data-model.md):
  - Hidratación: `const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false)`; todo el formulario dentro de `<fieldset disabled={!hydrated}>`; `<noscript>` con `content.noScript` antes del formulario (R7).
  - `<form noValidate onSubmit>`; campos **sin atributo `name`**, con `id` propio, `<label htmlFor>` visible y `hint` bajo la etiqueta cuando exista. Atributos exactos: name → `autoComplete="name"`, `maxLength={100}`; company → `autoComplete="organization"`, `maxLength={100}`; phone → `type="tel"`, `inputMode="tel"`, `autoComplete="tel"`, `maxLength={30}`; email → `type="email"`, `autoComplete="email"`, `maxLength={254}`; message → `<textarea>` `maxLength={500}`, `rows={4}`, `autoComplete="off"`. Nombre y empresa llevan `aria-required="true"`; los opcionales se distinguen por su `hint` ("Opcional") del contenido. No agregar marcadores ni textos escritos en el componente (Principio III).
  - Envío: `preventDefault`; validar con `validateContact`. Con errores: guardar errores, enfocar el primer campo con error (orden name, company, phone, email) y escribir en una región `role="status"` `content.errorSummary.one` o `.other` con `{n}` reemplazado. Tras el primer intento, revalidar solo el campo editado en cada `onChange`.
  - Cada campo con error: `aria-invalid="true"`, `aria-describedby` hacia `<p id="…-error">` con el texto del error (color de error del tema + texto, no solo color).
  - Envío válido: `const url = contactLink(data, message)`; `const w = window.open(url, "_blank"); if (w) w.opener = null;` (no pasar `"noopener"`: devuelve `null`); mostrar en la región `role="status"` `content.sent.text` y un `<a href={url} target="_blank" rel="noopener noreferrer">` con `content.sent.link` + aviso sr-only `ui[locale].a11y.newTab`. No limpiar el formulario (R6).
  - Botón `<button type="submit" className={buttonClasses("primary", "lg")}>` con `content.submit` y, al lado/debajo, `<p>` con `content.privacyNote` (FR-005).
  - Prohibido: `fetch`, `localStorage`/`sessionStorage`, cookies, analytics (SC-005).
  - Estilos de campo con tokens existentes (`border-line`, `bg-surface`, `text-fg`, foco visible igual al resto del sitio); `min-h-11` en inputs; ancho completo.
- [X] T010 [US1] En `src/components/pages/ContactPage.tsx`: en la columna del formulario, `<h2>` con `contacto[locale].form.title` y `<ContactForm content={…form} message={…message} locale={locale} />`.
- [X] T011 [P] [US1] En `src/components/layout/Footer.tsx` y `src/content/site.ts` (research R9): excluir `contact` de la lista "Sitio" (`navItems(locale, (p) => p.key !== "contact")`); en la columna "Contacto y cuenta" poner primero un `<Link>` interno (misma pestaña, mismo `linkClass`) a `pageHref("contact", locale)` con `getPage("contact").locales[locale].navLabel`, solo si `isPublished("contact", locale)`; quitar el ítem externo de WhatsApp y el import de `whatsapp` si queda sin uso; borrar `footer.contactLabel` de `ui.es` y `ui.en`; actualizar el comentario JSDoc del pie.

**Checkpoint**: US1 completa y verificable sola (quickstart #3–#14, #18–#20).

---

## Phase 4: User Story 2 - Escribir directo por WhatsApp o escanear el QR (Priority: P2)

**Goal**: botón directo y QR, subordinados al formulario, funcionando sin JavaScript.

**Independent Test**: escanear el QR (≥ 768 px) y tocar el botón: ambos abren el chat con "Hola, quiero saber más de StoreFlow" (quickstart #15–#18).

### Implementation for User Story 2

- [X] T012 [P] [US2] Generar los QR (research R8). **Pedir confirmación al owner antes de correr `npx`** (constitución, Flujo de desarrollo). Luego, desde la raíz: `npx --yes qrcode@1.5.4 -t svg -e M -q 4 -o public/contact/whatsapp-es.svg "https://wa.me/56957596588?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20de%20StoreFlow"` y `npx --yes qrcode@1.5.4 -t svg -e M -q 4 -o public/contact/whatsapp-en.svg "https://wa.me/56957596588?text=Hi%2C%20I'd%20like%20to%20know%20more%20about%20StoreFlow"`. Verificar que cada URL sea idéntica a `URLS.whatsappGeneral` / `URLS.whatsappGeneralEn` (imprimirlas con un `node -e` o comparando con `encodeURIComponent`). Confirmar que `package.json` y `package-lock.json` no cambiaron y que cada SVG pesa < 10 KB.
- [X] T013 [P] [US2] En `src/app/globals.css`: agregar el token `--qr-bg: #ffffff` con el **mismo valor** en el bloque de tema claro y en los dos de tema oscuro (donde hoy se define `--danger`), con comentario "fondo del QR: siempre claro, las cámaras no leen QR invertidos (spec 006 FR-008)", y exponerlo en el bloque `@theme` junto a los demás como `--color-qr-bg: var(--qr-bg);` (Principio III: colores solo como tokens).
- [X] T014 [US2] Crear `src/components/sections/ContactAlternatives.tsx` (Server Component, props `{ content: ContactContent["alternatives"]; locale: Locale }`): `<h2>` `content.title`, `<p>` `content.body`, `<Button href={content.direct.href} locale={locale} variant="secondary" size="md">` (enlace normal: funciona sin JS, abre pestaña nueva); y un bloque QR con `className="hidden md:flex flex-col items-start gap-3 …"` (oculto < 768 px, aclaración 2026-11-15) que contiene: (1) la tarjeta del QR con fondo `bg-qr-bg` (token de T013, blanco en ambos temas; **no usar `bg-white`**, Principio III) y padding (margen silencioso), con `next/image` `src={content.qr.src}` `alt={content.qr.alt}` `width={200} height={200}` (SVG: Next lo sirve sin optimizar automáticamente; verificado en la doc instalada); (2) **fuera de la tarjeta**, debajo, `<p className="text-sm text-fg-2">` con `content.qr.caption`, sobre el fondo de la página, para que cumpla AA en claro y oscuro (Principio V). La tarjeta no debe pesar visualmente más que el botón de envío del formulario (Principio II).
- [X] T015 [US2] En `src/components/pages/ContactPage.tsx`: renderizar `<ContactAlternatives content={contacto[locale].alternatives} locale={locale} />` en la segunda columna (después del formulario en el orden del DOM).

**Checkpoint**: US1 y US2 funcionan juntas y por separado (quickstart #15–#18).

---

## Phase 5: User Story 3 - Contacto en inglés (Priority: P3)

**Goal**: `/en/contact` existe con el mismo formulario, botón y QR en inglés, oculta mientras el inglés no se publique.

**Independent Test**: con `languages.en.published = true` solo en local, ES/EN lleva entre `/contacto` y `/en/contact` y el mensaje se arma en inglés; con `false`, `/en/contact` da 404 (quickstart #23, #24).

### Implementation for User Story 3

- [X] T016 [P] [US3] Crear `src/app/(en)/en/contact/page.tsx` (`pageMetadata("contact", "en")`, `<ContactPage locale="en" />`) y `src/app/(en)/en/contact/opengraph-image.tsx` (patrón de `src/app/(en)/en/partner/opengraph-image.tsx` con `"contact"`).
- [X] T017 [US3] Revisar el bloque `en` de `src/content/contacto.ts` contra el español: mismo sentido, sin afirmaciones extra, segunda persona, sin jerga ni clichés (Principios I y VII); `message.greeting` y rótulos en inglés. Probar quickstart #24 con el inglés habilitado en local y **revertir `languages.en.published` a `false`** antes de commitear.

**Checkpoint**: las tres historias completas.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T018 Buscar `56900000000` y `PLACEHOLDER` relacionados con WhatsApp en todo el repo (`src/`, `specs/005-official-site/` no se toca): no deben quedar usos del número viejo en código (quickstart #25).
- [X] T019 `npm run lint` y `npm run build` sin errores ni warnings nuevos; confirmar en la salida del build que `/contacto` y `/en/contact` son estáticas.
- [ ] T020 Recorrer [quickstart.md](./quickstart.md) #1–#27 con `npm run start` (y celulares reales para #16 y #20); anotar resultados.
  - _Avance 2026-11-15 (Claude, `npm run start` + Chrome):_ OK #1–#15, #17, #18 (HTML: fieldset deshabilitado, sin `name`, `<noscript>`), #19 (orden del DOM), #21–#25. Pendiente en celulares reales: #16 (escanear QR Android/iPhone, claro y oscuro) y #20.
- [ ] T021 Lighthouse móvil en `/contacto` (Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95), contraste AA en claro y oscuro (campos, errores, nota de privacidad, caption del QR) y sin scroll horizontal a 360/768/1440 px (SC-006). Corregir lo que falle.
  - _Avance 2026-11-15:_ sin scroll horizontal a 360/767/768/1024/1440 px (medido). Pendiente: Lighthouse móvil y revisión de contraste con axe/DevTools.
- [X] T022 Releer todo el copy de `src/content/contacto.ts` y la entrada `contact` de `site.ts` contra FR-012 y los Principios I y VII; verificar que ningún componente nuevo tiene strings visibles (Principio III).
- [X] T023 Commits en Conventional Commits en la rama `006-contacto`. **Primero**, antes de cualquier `feat:`, commitear la enmienda que habilita esta página: `.specify/memory/constitution.md` con `docs: constitución 3.1.0 (excepción Contacto)`, junto con `specs/006-contacto/` (`docs: spec, plan y tareas de Contacto`). Luego el código (por ejemplo `content: número real de WhatsApp`, `feat: página de Contacto con formulario a WhatsApp`, `feat: QR de WhatsApp en Contacto`); sin push ni merge sin pedido del owner.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de T001 (T004 usa `whatsapp`) y T003 (T005 usa `"contact"`). Bloquea todas las historias.
- **US1 (Phase 3)**: depende de Phase 2 y de T002 (`buttonClasses`).
- **US2 (Phase 4)**: depende de Phase 2; independiente de US1 (T015 y T010 tocan `ContactPage.tsx`: hacerlas en serie).
- **US3 (Phase 5)**: depende de Phase 2; T017 se prueba mejor con US1 y US2 hechas.
- **Polish (Phase 6)**: después de las historias que se vayan a entregar.

### Within Each User Story

- US1: T008 → T009 → T010; T011 independiente de T008–T010.
- US2: T012 y T013 (en paralelo) → T014 → T015.
- US3: T016 → T017.

### Parallel Opportunities

- T002 y T003 en paralelo con T001.
- T007 en paralelo con T006 (archivos distintos; la ruta importa `ContactPage`, así que el build se prueba tras ambas).
- T008 y T011 en paralelo; T012 (QR) en paralelo con todo US1.
- T016 en paralelo con US1/US2.

---

## Parallel Example: User Story 1

```text
Task: "T008 [P] [US1] Crear src/lib/contact.ts (validateContact, buildContactMessage, contactLink)"
Task: "T011 [P] [US1] Pie: Contacto interno en 'Contacto y cuenta' (src/components/layout/Footer.tsx)"
```

## Parallel Example: User Story 2

```text
Task: "T012 [P] [US2] Generar public/contact/whatsapp-es.svg y whatsapp-en.svg (con confirmación del owner)"
(en paralelo con T008–T009 de US1)
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 + Phase 2 → la página existe en menú, pie y sitemap.
2. Phase 3 (US1) → formulario completo.
3. **Validar**: quickstart #1–#14, #18–#22, #25 y Lighthouse.
4. Se puede desplegar: el número real ya está en todo el sitio y Contacto funciona sin el QR.

### Incremental Delivery

1. Setup + Foundational → base lista.
2. US1 → validar → (deploy opcional, MVP).
3. US2 → QR y botón directo → validar #15–#18.
4. US3 → ruta en inglés oculta, lista para cuando el owner publique el inglés.
5. Polish → quickstart completo, Lighthouse, commits.

---

## Notes

- [P] = archivos distintos, sin dependencias pendientes.
- Ningún cambio en `specs/005-official-site/`.
- `languages.en.published` MUST quedar en `false` en todo commit.
