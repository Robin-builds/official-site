# Feature Specification: Página "Planes" (precios y prueba de disposición a pagar)

**Feature Branch**: `009-planes-pricing`

**Created**: 2026-11-16

**Status**: Draft — requiere enmienda de la constitución (5.0.0) antes de `/speckit-plan`

**Input**: User description: "Spec — Apartado 'Planes' (pricing) del site: comunicar la oferta de planes a prospectos PYME y medir willingness-to-pay por tier antes de congelar precios y construir cobro. El apartado es vitrina e instrumento de smoke test: el clic a cada tier es la señal de disposición a pagar." (descripción completa del owner en la sesión 2026-11-16).

## Contexto

Hoy el sitio dice "gratis para empezar" y, en Preguntas frecuentes, que "hay planes pagados para
negocios con más necesidades", **sin montos ni nombres de planes**. No existe forma de saber qué
plan le interesaría a quién ni cuánto estaría dispuesto a pagar.

La página "Planes" cumple dos funciones:

1. **Vitrina**: mostrar 3 planes (Free, Standard, Premium) con lo que incluye cada uno y su precio
   referencial.
2. **Prueba de disposición a pagar (smoke test)**: el botón de los planes pagos **no cobra**; captura
   la intención ("Quiero el plan X") y el correo del visitante, y la envía por correo al owner. Los
   clics se miden por separado de los envíos, por plan y periodicidad.

Usuario primario: dueño o encargado de una PYME (ferretería, distribuidora, minimarket) que evalúa
si StoreFlow vale pagarse y qué plan le sirve. Secundario: contador que evalúa recomendarlo.
Dispositivo primario: celular.

## Clarifications

### Session 2026-11-16

- Q: ¿Cómo se concilia mostrar montos y funciones que hoy no existen (multiempresa, prueba de 14 días) con el Principio I (Veracidad)? → A: Se enmienda el Principio I para permitir **montos referenciales** solo en la página Planes, con el aviso visible "Precios referenciales, pueden cambiar". Lo que hoy no existe en la app (varias empresas por cuenta, prueba de 14 días) se marca **"Próximamente"**.
- Q: ¿Dónde se guardan las intenciones y los clics? → A: Las **intenciones se envían por correo al owner**, igual que el formulario de Contacto (no se guardan en una base de datos). Los **clics se registran con una herramienta de medición liviana**, sin datos personales.
- Q: ¿El apartado es una página propia o una sección de Inicio? → A: **Página propia "Planes"**, con enlace en el menú; `#planes` lleva al apartado de planes dentro de esa página. Inicio no cambia.
- (Del pedido) Aclaración #1 — CTA = smoke test: confirmado, no cobra.
- (Del pedido) Aclaración #4 — redondeo anual: resuelto con la regla 10 × mensual ("2 meses gratis").

## Enmienda requerida a la constitución

Antes de `/speckit-plan`, la constitución MUST enmendarse con `/speckit-constitution` (MAJOR, 4.0.0 → 5.0.0):

| Principio | Cambio requerido por esta spec |
|---|---|
| **I. Veracidad** | Excepción: la página Planes puede mostrar **montos referenciales** con el aviso "Precios referenciales, pueden cambiar". Las funciones que hoy no existen en la app MUST mostrarse como "Próximamente". Fuera de esa página siguen prohibidos los montos. |
| **II. Una conversión por página** | Nueva excepción "Planes": la conversión principal es el botón del plan recomendado (Standard), que abre el formulario de intención. Los botones de los otros planes son subordinados. |
| **IV. Simplicidad** | Nueva ruta de servidor para el formulario de intención, que envía un correo al owner y MUST NOT guardar los datos (mismas reglas que `/api/contact`). Se aprueba una herramienta de medición liviana, sin datos personales, solo para contar los clics de los botones de planes. |

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver los 3 planes y decidir cuál me sirve (Priority: P1)

El dueño de una ferretería con dos locales toca "Planes" en el menú. Ve Free, Standard y Premium,
en ese orden, cada uno con su precio "+ IVA", cuántas bodegas incluye, una frase que dice para
quién es y lo que incluye. Standard aparece destacado como "Recomendado". Entiende que Free es
gratis para siempre, no una prueba, y que los precios son referenciales.

**Why this priority**: sin la vitrina no hay nada que medir; es la base de las demás historias.

**Independent Test**: abrir la página Planes y verificar que aparecen exactamente 3 planes con
nombre, precio, periodicidad, frase de posicionamiento, límite en bodegas, lista de lo incluido y
un botón; cambiar un precio en la fuente de contenido y verificar que la página lo refleja sin otro
cambio.

**Acceptance Scenarios**:

1. **Given** un visitante en cualquier página, **When** busca los precios, **Then** encuentra "Planes" en el menú principal (también en el menú móvil) y en el pie.
2. **Given** la dirección de la página Planes con `#planes`, **When** se abre, **Then** lleva directamente al apartado de planes.
3. **Given** la página, **When** se lee, **Then** muestra Free, Standard y Premium en ese orden, y solo Standard lleva la etiqueta "Recomendado".
4. **Given** cada plan, **When** se lee su límite principal, **Then** está expresado en bodegas (por ejemplo "1 bodega", "Hasta 3 bodegas"), no en usuarios ni productos.
5. **Given** el plan Free, **When** se lee, **Then** dice "gratis para siempre" y no usa la palabra "prueba" ni "trial".
6. **Given** los planes pagos, **When** se leen sus precios, **Then** todos llevan "+ IVA" y la página muestra el aviso "Precios referenciales, pueden cambiar".
7. **Given** la página, **When** se lee, **Then** presenta como "Próximamente" la prueba de 14 días con funciones de plan pago, sin tarjeta, y el paso posterior a Free sin perder datos.

---

### User Story 2 - Decir "quiero este plan" sin pagar (Priority: P1)

El mismo dueño toca "Quiero el plan Standard". Se abre un formulario corto que ya sabe qué plan y
qué periodicidad eligió; escribe su correo y lo envía. Ve un mensaje honesto: "Recibimos tu interés
en Standard. Te contactamos para contarte cómo empezar." No se le pide tarjeta ni se le cobra nada.

El owner recibe un correo que identifica el plan y la periodicidad, con el correo del visitante.
Por separado, cada clic en un botón de plan queda contado, para comparar interés entre planes.

**Why this priority**: es el objetivo de negocio de esta fase: medir disposición a pagar sin
construir cobro.

**Independent Test**: tocar el botón de cada plan y verificar que se cuenta un clic con el plan
correcto; enviar el formulario con un correo válido y verificar que el owner recibe exactamente 1
correo con plan, periodicidad, precio mostrado, correo del visitante, fecha y hora, y origen;
verificar que no hubo ningún contacto con un medio de pago.

**Acceptance Scenarios**:

1. **Given** un plan pago, **When** el visitante toca su botón, **Then** se cuenta un clic con ese plan y la periodicidad visible, y se abre el formulario de intención con el nombre del plan.
2. **Given** el formulario abierto, **When** el visitante lo cierra sin enviar, **Then** el clic ya quedó contado y no se envía ningún correo.
3. **Given** el formulario con un correo válido, **When** lo envía, **Then** el owner recibe exactamente 1 correo con plan, periodicidad, precio mostrado, correo del visitante, fecha y hora, idioma y origen (campaña o página de procedencia, si existe), y el visitante ve la confirmación.
4. **Given** el formulario con el correo vacío o con formato inválido, **When** intenta enviarlo, **Then** el sitio indica el error, no envía nada y conserva lo escrito.
5. **Given** cualquier botón de plan, **When** se usa, **Then** no se inicia cobro, no se piden datos de tarjeta y no se contacta ningún medio de pago.
6. **Given** el plan Free, **When** el visitante toca "Empezar gratis", **Then** va a la descarga de la app en Google Play (no al formulario), y el clic se cuenta como activación, separado de la intención de pago.
7. **Given** la confirmación, **When** se lee, **Then** dice que StoreFlow lo contactará y no promete cobro automático, activación inmediata ni un precio garantizado.

---

### User Story 3 - Comparar precio mensual y anual (Priority: P2)

El dueño cambia de "Mensual" a "Anual" y ve el precio anual de cada plan pago con la etiqueta
"2 meses gratis". Si después toca "Quiero el plan", la intención llega como anual.

**Why this priority**: muestra el ahorro y permite medir si el interés cambia con el compromiso anual.

**Independent Test**: alternar la periodicidad y verificar que cada plan pago muestra el precio
anual según la regla de FR-008 y la etiqueta de ahorro; que Free sigue mostrando $0.

**Acceptance Scenarios**:

1. **Given** la página recién abierta, **When** se lee, **Then** la periodicidad seleccionada es Mensual.
2. **Given** Anual seleccionado, **When** se lee cada plan pago, **Then** el precio anual es exactamente 10 veces el mensual y se etiqueta el ahorro ("2 meses gratis").
3. **Given** Anual seleccionado, **When** el visitante abre el formulario de un plan y lo envía, **Then** el clic y el correo de intención indican periodicidad anual.

---

### User Story 4 - Comparar en el celular sin desplazarse de lado (Priority: P2)

En un celular de 360 px de ancho, el visitante recorre los 3 planes de arriba hacia abajo sin
desplazamiento horizontal; Standard sigue siendo reconocible como recomendado.

**Why this priority**: el dispositivo primario es el celular.

**Independent Test**: ver la página a 360, 768 y 1440 px y verificar que no hay desplazamiento
horizontal y que todo el texto es legible.

**Acceptance Scenarios**:

1. **Given** un ancho de 360 px, **When** se recorre la página, **Then** no aparece desplazamiento horizontal y cada plan muestra completo su precio, límite y botón.
2. **Given** un ancho de 1440 px, **When** se ve la página, **Then** los 3 planes se ven lado a lado.

---

### User Story 5 - Identificar el plan para contadores con varias empresas (Priority: P3)

Un contador busca si algún plan le sirve para llevar a varios clientes. Ve que Premium incluye
"Varias empresas en una cuenta", marcado como "Próximamente".

**Why this priority**: el canal de contadores es estratégico, pero es una minoría de visitantes.

**Independent Test**: leer el plan Premium y verificar que menciona varias empresas en una cuenta
con la marca "Próximamente", y que ningún otro plan la menciona.

**Acceptance Scenarios**:

1. **Given** la página, **When** un contador la lee, **Then** solo Premium menciona varias empresas en una cuenta, y lo marca como "Próximamente".

---

### Edge Cases

- **Mismo correo envía varias veces** (o para planes distintos): cada envío genera su propio correo al owner; no se bloquea al visitante.
- **Envíos automáticos (spam/bots)**: el formulario MUST tener una protección no intrusiva (sin captcha visible); los envíos detectados como automáticos no generan correo.
- **Falla al enviar el correo**: el visitante ve un mensaje de error con la opción de reintentar o de ir a Contacto; MUST NOT ver la confirmación si el correo no salió.
- **Sin JavaScript**: la página y los precios mensuales se leen igual; el botón de cada plan pago lleva a una vía que funciona sin JavaScript (por ejemplo, la página de Contacto con el plan indicado en el mensaje).
- **Visitante sin datos de campaña**: el origen llega vacío; no impide el envío.
- **Bloqueadores de medición**: si el conteo del clic falla, el formulario igual se abre y el envío igual funciona.
- **Visitante en inglés**: ve la misma página traducida, con precios en CLP y la misma convención de IVA; el correo de intención indica el idioma.
- **Cambio de precios a mitad de la prueba**: cada correo de intención incluye el precio que el visitante vio, para no mezclar resultados de precios distintos.
- **Alguien pide que se borren sus datos**: el sitio no guarda el correo; el owner borra el correo recibido.

## Requirements *(mandatory)*

### Functional Requirements

**Vitrina**

- **FR-001**: La página MUST mostrar exactamente 3 planes, en este orden: Free, Standard, Premium.
- **FR-002**: Cada plan MUST mostrar: nombre, precio, periodicidad, una frase de posicionamiento, su límite principal, la lista de lo que incluye y un botón (CTA).
- **FR-003**: Exactamente un plan, Standard, MUST destacarse como recomendado ("Recomendado"), y su botón MUST ser la acción visualmente principal de la página.
- **FR-004**: El límite principal de cada plan MUST expresarse en bodegas (no en usuarios ni productos).
- **FR-005**: Precios, límites, listas de lo incluido, marcas "Próximamente", textos y la marca de recomendado MUST provenir de una única fuente de contenido; cambiar un precio o un límite MUST NOT requerir cambios de estructura ni de presentación.
- **FR-006**: Todos los precios de la página MUST usar la misma convención de impuesto: "+ IVA". Los montos se muestran en pesos chilenos (CLP), sin decimales, con punto como separador de miles ($9.990).
- **FR-007**: El plan Free MUST decir explícitamente "gratis para siempre" y MUST NOT usar las palabras "prueba" ni "trial".
- **FR-008**: MUST existir un selector Mensual/Anual, con Mensual por defecto. En Anual, el precio de cada plan pago MUST ser exactamente 10 veces su precio mensual y MUST etiquetarse el ahorro como "2 meses gratis" (≈ 17 %).
- **FR-009**: La página MUST presentar, marcada como "Próximamente", la prueba de 14 días con funciones de plan pago, sin tarjeta, y el paso posterior a Free sin perder datos.
- **FR-010**: Premium MUST incluir "Varias empresas en una cuenta" (para contadores), marcado como "Próximamente". Toda función listada en un plan que hoy no exista en la app publicada MUST llevar esa marca.
- **FR-018**: La página MUST mostrar, cerca de los precios, el aviso "Precios referenciales, pueden cambiar".

**Prueba de disposición a pagar**

- **FR-011**: El botón de cada plan pago ("Quiero el plan Standard" / "Quiero el plan Premium") MUST abrir un formulario de intención con el plan y la periodicidad ya indicados. MUST NOT iniciar cobro, pedir datos de pago ni contactar un medio de pago.
- **FR-012**: El botón del plan Free MUST decir "Empezar gratis" y llevar a la descarga de la app en Google Play, usando el mismo destino que el resto del sitio. MUST NOT abrir el formulario de intención.
- **FR-013**: El formulario de intención MUST pedir solo el correo (obligatorio). MUST validar su formato antes de enviar y en el servidor; un envío inválido MUST NOT generar correo.
- **FR-014**: Al enviarse un formulario válido, el sistema MUST enviar exactamente un correo al owner con: plan, periodicidad, precio mostrado, correo del visitante, fecha y hora, idioma y origen (parámetros de campaña y página de procedencia, si existen). El asunto MUST identificar plan y periodicidad (por ejemplo "Planes · Standard · Anual"). El sitio MUST NOT guardar estos datos.
- **FR-015**: El sistema MUST contar cada clic en el botón de un plan (los 3), con el plan y la periodicidad visible, aunque el visitante no envíe el formulario. Clics y envíos MUST medirse por separado. El clic de Free MUST identificarse como activación, no como intención de pago. El conteo MUST NOT incluir datos personales.
- **FR-016**: Tras un envío exitoso, el sitio MUST mostrar una confirmación honesta ("Te contactamos") que MUST NOT prometer cobro automático, activación inmediata ni precio garantizado.
- **FR-017**: Junto al formulario MUST indicarse para qué se usa el correo (que StoreFlow lo contacte sobre ese plan) y enlazar la política de privacidad. La política de privacidad MUST actualizarse para declarar este dato, que llega por correo al owner, su uso, cómo pedir que se borre, y la medición de clics sin datos personales.
- **FR-019**: El owner MUST poder ver, para un período, los clics contados por plan, periodicidad y tipo (intención de pago o activación).

**Navegación, idioma y acceso**

- **FR-020**: "Planes" MUST ser una página propia, con enlace en el menú principal, el menú móvil y el pie. El apartado de planes MUST ser accesible con el ancla `#planes`. Inicio no cambia.
- **FR-021**: La página MUST existir en español e inglés, con los mismos planes, precios (CLP), marcas y convención de IVA; el inglés MUST NOT afirmar nada que el español no afirme. MUST tener metadata propia por idioma e incluirse en el mapa del sitio.
- **FR-022**: Ver los planes y expresar intención MUST NOT requerir cuenta ni inicio de sesión.
- **FR-023**: El selector de periodicidad, los botones y el formulario MUST operar con teclado, con foco visible, y cumplir contraste AA en tema claro y oscuro.

### Key Entities

- **Plan**: identificador (free / standard / premium), nombre, frase de posicionamiento, precio mensual (CLP, sin IVA), límite de bodegas, lista de lo incluido (cada ítem con marca "Próximamente" si corresponde), texto del botón, marca de recomendado. El precio anual se deriva (10 × mensual).
- **Intención de plan** (correo al owner, no se guarda en el sitio): plan, periodicidad, precio mostrado, correo del visitante, fecha y hora, idioma, origen (opcional).
- **Clic de plan** (conteo): plan, periodicidad visible, tipo (intención de pago o activación), idioma. Sin datos personales.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A 360 px de ancho, la página se recorre completa sin desplazamiento horizontal (también a 768 y 1440 px).
- **SC-002**: Una verificación automática del contenido falla si hay un número de planes distinto de 3, si el orden no es Free → Standard → Premium o si a algún plan le falta nombre, precio, frase, límite, lista de lo incluido o botón.
- **SC-003**: Al tocar el botón de cada uno de los 3 planes, se cuenta un clic con el identificador correcto de ese plan (3 de 3 verificados); el de Free queda marcado como activación.
- **SC-004**: Un envío con correo válido genera exactamente 1 correo al owner con plan, periodicidad, precio mostrado, correo del visitante, fecha y hora, y origen.
- **SC-005**: Un envío con correo vacío o inválido es rechazado y genera 0 correos.
- **SC-006**: Con Anual seleccionado, el precio de cada plan pago es exactamente 10 × su precio mensual y lleva la etiqueta de ahorro (2 de 2 planes pagos verificados); Free sigue en $0.
- **SC-007**: Usar cualquiera de los 3 botones genera 0 contactos con medios de pago y 0 solicitudes de datos de tarjeta.
- **SC-008**: Los textos de precio, límites y listas de lo incluido no tienen fallas de contraste AA, en tema claro y oscuro.
- **SC-009**: Exactamente 1 plan está marcado como recomendado, y es Standard.
- **SC-010**: El límite principal visible de los 3 planes está expresado en bodegas.
- **SC-011**: El plan Free muestra "gratis para siempre" y no contiene las palabras "prueba" ni "trial" (en ambos idiomas).
- **SC-012**: La página contiene el texto de la prueba con "14 días", "sin tarjeta" y la marca "Próximamente".
- **SC-013**: Abrir la página Planes con `#planes` lleva al apartado de planes, y "Planes" aparece en el menú y el pie de todas las páginas, en ambos idiomas.
- **SC-014**: El 100 % de los precios de la página lleva "+ IVA" y la página muestra el aviso "Precios referenciales, pueden cambiar".
- **SC-015**: El owner puede obtener en menos de 10 minutos, por plan y periodicidad: clics (desde la medición), intenciones (contando los correos por asunto) y la tasa intención/clic.
- **SC-016**: Toda función de un plan que no exista hoy en la app publicada lleva "Próximamente" (revisión de contenido contra la guía del owner y la app).
- **SC-017**: La página cumple las metas del sitio en celular: rendimiento ≥ 90, accesibilidad ≥ 95 y SEO ≥ 95.

## Assumptions

- **[pivote, confirmado]** Los botones de planes pagos son una prueba de disposición a pagar: capturan intención y **no cobran**. El cobro, la pasarela y la emisión de DTE quedan para otra feature.
- Los precios son **referenciales, a validar**; viven en la fuente de contenido y se ajustan sin tocar estructura. Valores iniciales sugeridos (a confirmar por el owner): Free $0 · 1 bodega; Standard $9.990/mes + IVA · hasta 3 bodegas; Premium $19.990/mes + IVA · bodegas ilimitadas + varias empresas (Próximamente).
- Convención de impuesto: **"+ IVA"** (la PYME descuenta el IVA). Propuesta del owner; se adopta.
- Regla anual: **10 × mensual ("2 meses gratis")**, con cifras redondas y verificable automáticamente.
- El correo de intención llega a la misma casilla del owner que el formulario de Contacto.
- La herramienta de medición de clics no usa cookies de seguimiento ni guarda datos personales, por lo que no requiere aviso de cookies.
- El botón de Free lleva al mismo destino de descarga (Google Play) que el resto del sitio, porque la cuenta se crea al instalar la app.
- Idioma principal es-CL, con versión en inglés (Principio VII). Moneda CLP en ambos idiomas.
- La FAQ "Precio" puede enlazar a la página Planes; su texto se revisa para no contradecirla.

## Fuera de alcance

- Cobro, pasarela, checkout, emisión de DTE o factura.
- Guardar intenciones en una base de datos o sincronizarlas con un CRM (HubSpot).
- Aplicar en la app los límites o funciones de cada plan (esto es vitrina, no control de acceso).
- Gestión de suscripciones, cambios de plan automáticos o portal de cliente.
- La prueba de 14 días funcional (solo se comunica como "Próximamente").
- Fijar precios finales (se fijan después de la prueba).
- La función de varias empresas / contador (solo se menciona como "Próximamente").
- Una tabla comparativa extensa de funciones.
- Cambios en Inicio.

## Trazabilidad requisito → criterio

| FR | Cubierto por |
|----|--------------|
| FR-001, FR-002, FR-005 | SC-002 |
| FR-003 | SC-009 |
| FR-004 | SC-010 |
| FR-006, FR-018 | SC-014 |
| FR-007 | SC-011 |
| FR-008 | SC-006 |
| FR-009 | SC-012 |
| FR-010 | SC-016, US-5 escenario 1 |
| FR-011, FR-012 | SC-007, US-2 escenario 6 |
| FR-013 | SC-005 |
| FR-014 | SC-004 |
| FR-015 | SC-003 |
| FR-016 | US-2 escenario 7 |
| FR-017 | revisión de contenido (aviso + política de privacidad) |
| FR-019 | SC-015 |
| FR-020 | SC-013 |
| FR-021 | SC-011, SC-013, revisión de contenido |
| FR-022 | US-2 escenario 3 |
| FR-023 | SC-008, US-4 |
| — | SC-001 (US-4), SC-017 (Principio VI) |
