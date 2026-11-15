# Feature Specification: Página de Contacto

**Feature Branch**: `006-contacto`

**Created**: 2026-11-15

**Status**: Draft

**Input**: User description: "creo que nos falta un boton de Contacto, que contenga un formulario de contacto, que indique los nombre, telefono, correo, nombre empresa, ademas que permita que se contacten conmigo mediante wsp y un QR"

## Contexto

Hoy el sitio solo ofrece contacto por WhatsApp desde el pie y desde "Sé partner". No hay una página
donde un interesado (dueño de pyme, contador, asesor) deje sus datos para que el owner lo contacte.

**Cambio del owner (sesión 2026-11-15, posterior a la primera versión)**: el formulario ya no
arma un mensaje de WhatsApp; **envía los datos por correo** al owner mediante la ruta
`/api/contact` y Resend (constitución 4.0.0, excepción "Contacto" del Principio IV). El botón
directo y el QR siguen abriendo WhatsApp. Como por correo no llega el número de quien escribe,
teléfono o correo pasan a ser obligatorios (al menos uno).

**Decisiones del owner (sesión 2026-11-15)**:

- ~~El formulario no envía datos a ningún servidor; arma un mensaje de WhatsApp.~~ Reemplazado por
  el cambio de arriba.
- La página muestra además un botón directo a WhatsApp y un código QR que abre el mismo chat, para
  quien visita desde un computador y quiere escribir desde el celular.
- El QR es una imagen fija generada una sola vez; se regenera si cambia el número.
- Número de WhatsApp de StoreFlow: **+56 9 5759 6588** (reemplaza el placeholder del sitio).
- La conversión principal de la página es el envío del formulario. Habilitado por la
  constitución 4.0.0 (Principios II y IV, excepción "Contacto").
- Se incluye el campo opcional "¿En qué te podemos ayudar?" (confirmado por el owner).

## Clarifications

### Session 2026-11-15

- Q: ¿El código QR debe mostrarse también cuando la página se abre en un celular? → A: No. Se oculta en pantallas chicas (celular) y se muestra desde tablet/computador (768 px en adelante).
- Q: Cuando el visitante envía el formulario, ¿WhatsApp debe abrirse en una pestaña nueva o en la misma pestaña del sitio? → A: En una pestaña nueva (en el celular el sistema abre la app de WhatsApp directamente); el sitio y el formulario quedan intactos detrás.
- Q: En el menú de arriba, ¿"Contacto" debe ser un enlace igual a los demás o un botón destacado? → A: Enlace normal del menú, con el mismo estilo que los demás, ubicado al final.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dejar mis datos para que me contacten (Priority: P1)

El dueño de una ferretería quiere que alguien de StoreFlow le explique la app. Toca "Contacto" en
el menú, escribe su nombre, teléfono, correo y el nombre de su empresa, y toca "Enviar por
WhatsApp". Se abre WhatsApp con un mensaje que ya contiene esos datos; lo envía y queda en
conversación con el owner.

**Why this priority**: es el pedido central: un lugar visible donde un interesado se identifica y
el owner recibe sus datos ordenados.

**Independent Test**: desde cualquier página, entrar a Contacto, completar el formulario, enviarlo
y verificar que WhatsApp se abre hacia +56 9 5759 6588 con un mensaje que incluye los cuatro datos.

**Acceptance Scenarios**:

1. **Given** un visitante en cualquier página, **When** busca cómo contactar, **Then** encuentra "Contacto" en el menú principal (también en el menú móvil) y en el pie.
2. **Given** el formulario con nombre, teléfono, correo y empresa completos, **When** toca "Enviar por WhatsApp", **Then** se abre WhatsApp (app en el celular o WhatsApp Web en el computador) con un mensaje que contiene esos cuatro datos, rotulados, listo para enviar.
3. **Given** el formulario sin nombre o sin empresa, **When** intenta enviarlo, **Then** el sitio indica qué campo falta y no abre WhatsApp.
4. **Given** un correo o teléfono con formato inválido, **When** intenta enviarlo, **Then** el sitio indica el campo con error y cómo corregirlo.
5. **Given** la página de Contacto, **When** se lee, **Then** dice claramente que los datos no se guardan en el sitio: solo se agregan al mensaje de WhatsApp, que el visitante decide enviar.

---

### User Story 2 - Escribir directo por WhatsApp o escanear el QR (Priority: P2)

Un contador ve el sitio en el computador de su oficina. No quiere llenar un formulario: escanea el
QR con su celular y se le abre el chat de StoreFlow. Otro visitante, en el celular, toca el botón
"Escribir por WhatsApp" sin llenar nada.

**Why this priority**: es el camino más corto para quien ya sabe que quiere conversar; complementa
el formulario y funciona incluso si el formulario falla.

**Independent Test**: escanear el QR de la página con un celular y verificar que abre el chat con
+56 9 5759 6588 con el mensaje general precargado; tocar el botón directo y verificar lo mismo.

**Acceptance Scenarios**:

1. **Given** la página de Contacto en un computador, **When** se escanea el QR con la cámara del celular, **Then** se abre WhatsApp hacia el número de StoreFlow con el mensaje general precargado en el idioma de la página.
2. **Given** la página de Contacto, **When** se toca "Escribir por WhatsApp", **Then** se abre el mismo chat con el mismo mensaje general.
3. **Given** el navegador sin JavaScript, **When** se abre la página, **Then** el botón directo y el QR siguen funcionando, y el formulario indica que hace falta JavaScript para armar el mensaje.

---

### User Story 3 - Contacto en inglés (Priority: P3)

Cuando el sitio en inglés se publique, la página existe como "Contact" con el mismo formulario,
botón y QR, y el mensaje de WhatsApp se arma en inglés.

**Why this priority**: el inglés está oculto hasta la revisión del owner; la página debe existir
para no romper la paridad de idiomas, pero no bloquea la publicación en español.

**Independent Test**: con el inglés habilitado, completar el formulario en `/en/contact` y verificar que el mensaje se arma en inglés.

**Acceptance Scenarios**:

1. **Given** el sitio en inglés publicado, **When** se usa el selector ES/EN en Contacto, **Then** lleva a la página Contact en inglés y viceversa.
2. **Given** el sitio en inglés aún oculto, **When** se pide `/en/contact`, **Then** responde "no encontrada" como el resto del inglés.

---

### Edge Cases

- **Campos con espacios o saltos de línea extra**: se recortan antes de armar el mensaje.
- **Caracteres especiales** (tildes, ñ, &, #, emojis) en cualquier campo: llegan intactos al mensaje de WhatsApp.
- **Teléfono escrito de distintas formas** (`+56 9 1234 5678`, `912345678`, `56912345678`): se acepta cualquiera con entre 8 y 15 dígitos; se envía tal como lo escribió el visitante.
- **Campo de mensaje muy largo**: se limita a 500 caracteres para que el enlace de WhatsApp no falle.
- **Visitante sin WhatsApp instalado en el computador**: se abre WhatsApp Web; el QR queda como alternativa.
- **El visitante cierra WhatsApp sin enviar**: no se pierde nada en el sitio; el formulario conserva lo escrito mientras la pestaña siga abierta.
- **Visitante en el celular**: no ve el QR (no puede escanear su propia pantalla); usa el formulario o el botón directo.
- **Bloqueador de ventanas emergentes**: la pestaña nueva se abre en el mismo toque del visitante, por lo que no debe bloquearse; si el navegador la bloquea igual, el sitio muestra un enlace "Abrir WhatsApp" con el mensaje ya armado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sitio MUST tener una página "Contacto" (ES `/contacto`; EN `/en/contact`, oculta mientras el inglés no esté publicado) con su propio título, descripción y vista previa para compartir.
- **FR-002**: "Contacto" MUST aparecer en el menú principal (escritorio y móvil) y en el pie. En el menú MUST ser un enlace con el mismo estilo que los demás, ubicado al final, sin destacarse como botón (Principio II); el enlace "Contacto" del pie, que hoy abre WhatsApp, MUST llevar a esta página. La navegación MUST marcar Contacto como página actual cuando se está en ella.
- **FR-003**: La página MUST tener un formulario con: nombre (obligatorio), nombre de la empresa (obligatorio), teléfono, correo (al menos uno de los dos es obligatorio) y "¿En qué te podemos ayudar?" (opcional, máx. 500 caracteres). Cada campo MUST tener etiqueta visible y tipo adecuado (teléfono y correo abren el teclado correspondiente en el celular).
- **FR-004**: Al enviar el formulario válido, el sitio MUST mandar un correo al owner (dirección en la variable de entorno `CONTACT_TO_EMAIL`) con cada dato completado, rotulado ("Nombre: …", "Empresa: …", etc.) y el idioma de la página. Los campos vacíos opcionales MUST omitirse. Si el visitante dejó correo, "Responder" MUST contestarle a él. Tras un envío exitoso la página MUST confirmarlo y limpiar el formulario; si falla, MUST conservar los datos y ofrecer WhatsApp como salida.
- **FR-005**: Los datos MUST NOT guardarse ni registrarse en ninguna base de datos, almacenamiento ni herramienta de medición; solo viajan en el correo. La página MUST decirlo en una línea junto al botón de envío.
- **FR-006**: El formulario MUST validar antes de enviar, y el servidor MUST repetir la validación: obligatorios no vacíos, correo con formato válido si se escribió, teléfono con 8 a 15 dígitos si se escribió. Los errores MUST mostrarse junto al campo, en texto (no solo color), y anunciarse a lectores de pantalla.
- **FR-007**: La página MUST mostrar un botón "Escribir por WhatsApp" que abre el chat con el mensaje general precargado en el idioma de la página.
- **FR-008**: La página MUST mostrar un código QR que abre el mismo chat que el botón directo, con texto alternativo y una indicación breve ("Escanéalo con la cámara de tu celular"). El QR MUST leerse correctamente en tema claro y oscuro. El QR (con su indicación) MUST mostrarse solo desde 768 px de ancho; en pantallas más chicas MUST ocultarse, y ahí el botón "Escribir por WhatsApp" cumple su función.
- **FR-009**: El número real (+56 9 5759 6588) MUST reemplazar el placeholder en todo el sitio (pie, "Sé partner", Contacto), y MUST definirse en un solo lugar.
- **FR-010**: La conversión principal de Contacto MUST ser el envío del formulario; el botón directo a WhatsApp y el QR son alternativas visualmente subordinadas (constitución 4.0.0, Principio II).
- **FR-011**: Todo el copy de la página (etiquetas, ayudas, errores, mensajes precargados, aviso de privacidad) MUST existir en español e inglés.
- **FR-012**: La página MUST NOT prometer tiempos de respuesta, llamadas, demos ni beneficios que el owner no haya confirmado.
- **FR-013**: Sin JavaScript, el botón directo y el QR MUST funcionar; el formulario MUST indicar que necesita JavaScript.
- **FR-014**: La página MUST incluirse en el mapa del sitio (con su par en inglés cuando esté publicado).

### Key Entities

- **Solicitud de contacto** (efímera): nombre, empresa, teléfono, correo, mensaje. Viaja del navegador a `/api/contact` y de ahí al correo del owner; no se persiste en el sitio.
- **Destino de WhatsApp**: número de StoreFlow + mensaje general por idioma. Lo comparten el botón directo, el QR, el pie y "Sé partner" (este último con su mensaje propio).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Desde cualquier página, un visitante llega a Contacto en 1 toque (menú) o en 2 en el celular (abrir menú + tocar).
- **SC-002**: Un visitante completa y envía el formulario en menos de 1 minuto, y el correo llega al owner.
- **SC-003**: El 100% de los correos recibidos contiene los datos escritos sin caracteres corruptos (probado con tildes, ñ, &, # y emojis).
- **SC-004**: El QR se lee al primer intento con la cámara de un celular Android y uno iPhone, en tema claro y oscuro, a 30 cm de un monitor.
- **SC-005**: Los datos del formulario solo salen del navegador en el POST a `/api/contact`, y la ruta no los guarda (verificable revisando el tráfico de red y el código de la ruta).
- **SC-006**: La página cumple las metas de la constitución: 360/768/1440 px sin scroll horizontal, contraste AA en ambos temas, foco visible, operable con teclado, Lighthouse móvil Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.

## Assumptions

- Obligatorios: nombre, empresa y al menos uno entre teléfono y correo (por correo no llega el número del visitante).
- No se muestra un correo de contacto del owner en el sitio; la dirección de destino vive solo en la variable de entorno.
- Sin dominio verificado en Resend, el remitente es `onboarding@resend.dev` y solo puede enviar a la dirección dueña de la cuenta de Resend (la del owner).
- El QR se genera una vez con una herramienta de un solo uso y se guarda como imagen en el sitio; no se agrega ninguna dependencia al proyecto.
- El mensaje general precargado del botón directo y del QR es el que ya existe ("Hola, quiero saber más de StoreFlow").
- La página no tiene CTA a Google Play como conversión principal; puede tener un enlace secundario de descarga si el plan lo justifica.
