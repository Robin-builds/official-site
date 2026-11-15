# Research: Página de Contacto (spec 006)

Decisiones técnicas que resuelven lo que la spec deja abierto. Fecha: 2026-11-15.

## R1. Cómo se agrega la página al sitio

- **Decision**: nueva clave `"contact"` en `PageKey` y una entrada en el registro `pages`
  (`src/content/site.ts`) con `inNav: true`, ubicada después de `help` (queda al final del menú,
  aclaración 2026-11-15). Rutas `src/app/(es)/contacto/` y `src/app/(en)/en/contact/` con
  `page.tsx` + `opengraph-image.tsx`, igual que las demás páginas.
- **Rationale**: el registro ya alimenta menú (escritorio y móvil), marca de página actual, pie,
  selector ES/EN, hreflang, metadata y sitemap (FR-001, FR-002, FR-014). La guardia del layout
  `(en)` ya responde 404 en `/en/contact` mientras el inglés esté oculto (US3-2).
- **Alternatives considered**: enlace fijo en `Navbar` (duplicaría la lógica del registro y no
  aparecería solo en sitemap ni en el selector de idioma).

## R2. Número de WhatsApp en un solo lugar

- **Decision**: `WHATSAPP_NUMBER = "56957596588"` en `src/content/site.ts` (se borra el
  comentario PLACEHOLDER). Se exporta `whatsappLink(message)` para que el formulario arme su
  enlace con el mismo número y formato `https://wa.me/<número>?text=<mensaje codificado>`.
- **Rationale**: FR-009 y Principio II (URLs en una sola constante). Pie, "Sé partner", botón
  directo, QR y formulario derivan del mismo valor.
- **Alternatives considered**: repetir el prefijo `wa.me` en el componente del formulario
  (rompe el Principio II).

## R3. Armado del mensaje y codificación

- **Decision**: función pura `buildContactMessage(datos, textos)` en `src/lib/contact.ts`:
  recorta cada campo (`trim`), omite los opcionales vacíos y arma líneas rotuladas
  (`Nombre: …`, `Empresa: …`, `Teléfono: …`, `Correo: …`, `Mensaje: …`) bajo un saludo, unidas
  con `\n`. Saludo y rótulos vienen del contenido (`src/content/contacto.ts`) por idioma. El
  enlace final se arma con `whatsappLink`, que usa `encodeURIComponent`.
- **Rationale**: `encodeURIComponent` codifica UTF-8 completo (tildes, ñ, emojis) y escapa `&`,
  `#`, `?` y saltos de línea, que son los que rompen un enlace (SC-003). Separar la función del
  componente la deja revisable sin navegador.
- **Alternatives considered**: `URLSearchParams` (codifica espacios como `+`, que wa.me no
  siempre interpreta como espacio).

## R4. Largo del enlace

- **Decision**: máximos por campo: nombre y empresa 100, teléfono 30, correo 254, mensaje 500
  (`maxLength` en cada campo). Peor caso del texto ≈ 1 000 caracteres, ≈ 3–4 KB codificado si
  todo fueran tildes o emojis.
- **Rationale**: muy por debajo de los límites prácticos de URL de navegadores y de wa.me; el
  límite de 500 del mensaje viene de la spec.
- **Alternatives considered**: sin límites en nombre/empresa (un pegado accidental muy largo
  podría producir un enlace que falle).

## R5. Validación

- **Decision**: validación propia al enviar (`<form noValidate>`), con los mensajes del
  contenido en el idioma de la página:
  - nombre y empresa: no vacíos después de `trim`;
  - correo (si se escribió): `^[^\s@]+@[^\s@]+\.[^\s@]+$`;
  - teléfono (si se escribió): solo dígitos, espacios, `+`, `-`, `(`, `)` y `.`, con 8 a 15
    dígitos en total; se envía tal como se escribió (edge case de la spec).
  Tras el primer intento, cada campo con error se revalida al escribir, para que el error
  desaparezca apenas se corrige.
- **Accesibilidad (FR-006)**: cada campo con error lleva `aria-invalid="true"` y
  `aria-describedby` hacia su mensaje (texto, con ícono decorativo, no solo color); al fallar el
  envío, el foco va al primer campo con error, y una región `role="status"` anuncia cuántos
  campos revisar.
- **Rationale**: los mensajes nativos del navegador no se pueden traducir ni estilizar, y su
  idioma depende del navegador, no de la página.
- **Alternatives considered**: atributos `required`/`type="email"` con validación nativa
  (idioma inconsistente, sin control del texto).

## R6. Abrir WhatsApp en una pestaña nueva (aclaración 2026-11-15)

- **Decision**: en el `submit` válido, `window.open(enlace, "_blank")` y, si devuelve una
  ventana, `ventana.opener = null`. Siempre, después del envío válido, se muestra en una región
  `role="status"` el aviso "Abrimos WhatsApp en una pestaña nueva" con un enlace normal "Abrir
  WhatsApp" (`target="_blank" rel="noopener noreferrer"`) al mismo enlace.
- **Rationale**: `window.open` dentro del gesto del usuario no lo frenan los bloqueadores; si
  igual lo hacen, el enlace visible resuelve el caso sin detectar el bloqueo. No se usa la opción
  `"noopener"` en `window.open` porque hace que devuelva `null` siempre. El formulario conserva
  lo escrito (no se limpia) por si el visitante vuelve sin enviar.
- **Alternatives considered**: navegar en la misma pestaña (descartado en la aclaración);
  detectar el bloqueo y mostrar el enlace solo entonces (más frágil, mismo resultado).

## R7. Sin JavaScript no debe salir ningún dato (FR-005, FR-013, SC-005)

- **Decision**: el formulario se renderiza con `<fieldset disabled>` hasta que el componente se
  hidrata (bandera con `useSyncExternalStore`: `false` en el servidor, `true` en el cliente), y
  los campos **no llevan atributo `name`** (el autocompletado usa `autoComplete`: `name`,
  `organization`, `tel`, `email`). Un `<noscript>` explica que el formulario necesita
  JavaScript y remite al botón directo y al QR, que son enlaces normales.
- **Rationale**: un `<form>` sin JS envía por GET a la misma URL, lo que pondría los datos en la
  dirección y en los registros del servidor. Con el fieldset deshabilitado no hay envío posible,
  y sin `name` aunque ocurriera no viajaría ningún dato. `useSyncExternalStore` evita el
  `setState` dentro de `useEffect` que marca la regla de lint de React.
- **Alternatives considered**: `action="javascript:void 0"` (hack, y aun así necesita aviso);
  ocultar el formulario sin JS (el visitante no entendería por qué no está).

## R8. Código QR

- **Decision**: dos archivos SVG fijos, uno por idioma (`public/contact/whatsapp-es.svg`,
  `public/contact/whatsapp-en.svg`), que codifican el mismo enlace del botón directo
  (`whatsapp[locale].general`). Se generan una sola vez con `npx --yes qrcode@1.5.4 -t svg
  -e M -q 4 -o <archivo> "<enlace>"` (se pide confirmación del owner antes de correrlo; no entra a
  `package.json`). Se muestran con `next/image` (con `src` `.svg`, Next lo sirve sin optimizar
  de forma automática; verificado en `node_modules/next/dist/docs/.../image.md`), a 200 px,
  sobre una tarjeta siempre blanca con margen silencioso, también en tema oscuro. El blanco es
  un token nuevo `--qr-bg` (mismo valor en claro y oscuro) en `src/app/globals.css`, expuesto
  como `bg-qr-bg`; no se usa `bg-white` (Principio III: colores solo como tokens). La indicación
  "Escanéalo…" va fuera de la tarjeta, con `text-fg-2` sobre el fondo de la página, para
  cumplir AA en ambos temas.
- **Visibilidad (aclaración 2026-11-15)**: el bloque del QR lleva `hidden md:flex` (768 px en
  adelante). El botón directo es visible en todos los tamaños.
- **Corrección de error M** (15 %): suficiente para pantalla, y mantiene módulos grandes a 200 px
  para que se lea a 30 cm del monitor (SC-004).
- **Rationale**: FR-008, Principio IV (sin dependencias), Principio VI (`next/image`). Una
  tarjeta blanca fija evita que el QR quede claro sobre oscuro, que muchas cámaras no leen.
- **Regeneración**: si cambia el número o el mensaje general, se vuelven a correr los dos
  comandos (quedan escritos en el comentario de `src/content/contacto.ts`).
- **Alternatives considered**: generar el QR en el build con una librería (agrega dependencia);
  un solo QR para ambos idiomas (el mensaje precargado debe ir en el idioma de la página);
  PNG (más pesado y se ve borroso al hacer zoom).

## R9. Pie

- **Decision**: el enlace externo "Contacto por WhatsApp" del pie se reemplaza por un enlace
  interno a la página Contacto, primero en la columna "Contacto y cuenta". Contacto se excluye de
  la columna "Sitio" para no repetirlo. Se elimina `footer.contactLabel` del contenido.
- **Rationale**: FR-002 (el Contacto del pie lleva a esta página). La columna ya se llama
  "Contacto y cuenta".
- **Alternatives considered**: dejarlo en "Sitio" y renombrar la otra columna (más cambios de
  copy sin beneficio).

## R10. Botón de envío con estilo de botón primario

- **Decision**: se extrae de `Button.tsx` una función `buttonClasses(variant, size)` con las
  clases actuales; `Button` la usa y el formulario la aplica a su `<button type="submit">`
  (primario) y el botón directo usa `Button` con `variant="secondary"`.
- **Rationale**: Principio II (envío primario, alternativas subordinadas) sin duplicar clases;
  `Button` hoy solo renderiza enlaces.
- **Alternatives considered**: prop `as="button"` en `Button` (agrega ramas y props que solo usa
  un lugar).

## R11. Enlace a Google Play en Contacto

- **Decision**: no se agrega. La página tiene una sola conversión (WhatsApp) y el encabezado ya
  trae "Pruébala gratis".
- **Rationale**: Assumptions de la spec ("si el plan lo justifica"); no hay justificación.

## R12. Pruebas

- **Decision**: sin suite automatizada nueva (el proyecto no tiene una y agregarla es una
  dependencia). Verificación con `npm run build`, `npm run lint`, [quickstart.md](./quickstart.md)
  y Lighthouse móvil en `/contacto`.
