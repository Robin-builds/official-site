# Feature Specification: Sitio oficial de StoreFlow (de landing única a sitio de varias páginas)

**Feature Branch**: `005-official-site`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "esta landing es muy grande, tiene muchos elementos, mucho que recorrer, mucha informacion y lo digo como algo positivo, me gustaria recontruirla pero en un sitio oficial de la app, cual seria la propuesta?"

## Contexto

La landing actual (specs 001–004) concentra en una sola página 10 secciones: hero con recorrido de
capturas, credibilidad, problemas, beneficios, cómo funciona, casos de uso, contadores, testimonios
(oculta), preguntas frecuentes y CTA final. El owner valora que haya tanto contenido, pero una sola
página obliga a recorrerlo todo para llegar a lo que cada visitante busca.

**Propuesta**: convertir la landing en el **sitio oficial de StoreFlow**, con varias páginas, cada una
con un propósito claro. El contenido actual no se pierde: se reorganiza, se profundiza donde hoy es
breve y se vuelve enlazable (cada tema tiene su propia dirección que se puede compartir).

### Mapa del sitio propuesto

| Página | Propósito | Contenido de origen |
|---|---|---|
| **Inicio** | Entender qué es StoreFlow en menos de un minuto y descargarla | Hero con recorrido, credibilidad, versión resumida de problemas/beneficios, accesos a las demás páginas, CTA final |
| **Funcionalidades** | Ver en detalle qué hace la app, una funcionalidad a la vez, con su captura real | Beneficios + Cómo funciona + capturas de `/screens/` |
| **Para tu negocio** | Que cada rubro se reconozca (minimarket, ferretería, distribuidora, bodega) | Casos de uso + problemas |
| **Contadores** | Página dedicada al canal de contadores, con su propio contacto | Sección Contadores ampliada |
| **Preguntas frecuentes** | Resolver dudas antes de descargar | FAQ actual, agrupada por tema |
| **Descargar** | Destino único y compartible para instalar la app y entrar a la versión web | CTA a Google Play, requisitos (Android), acceso "Ingresar" |
| **Privacidad** | Política de privacidad propia del sitio, exigida por Google Play | Texto legal provisto por el owner |
| **Ayuda / Guías** | Guías paso a paso de uso de la app (3–4 guías básicas en esta versión) | Guía de uso existente que entrega el owner + capturas reales de cada paso |

### Idiomas

El sitio existe en **español** (idioma principal, en la raíz: `/funcionalidades`) y en **inglés**
(bajo `/en`, con direcciones en inglés: `/en/features`). Todas las páginas y guías existen en
ambos idiomas. El visitante cambia de idioma con un selector ES/EN que lo lleva a la misma página
en el otro idioma; el sitio no detecta ni redirige según el navegador. El inglés es una traducción
del español, hecha por el agente y revisada por el owner antes de publicarse.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entender StoreFlow y descargarla desde el Inicio (Priority: P1)

Un dueño de minimarket llega al sitio desde un enlace compartido. En la página de Inicio entiende
qué es StoreFlow, ve capturas reales de la app y puede ir a Google Play sin tener que recorrer todo
el contenido que hoy tiene la landing.

**Why this priority**: es la conversión principal del sitio (instalar la app). Si solo existiera esta
página, el sitio ya reemplazaría a la landing actual.

**Independent Test**: abrir la dirección raíz del sitio en un celular de 360 px y llegar a Google Play
en un toque desde la primera pantalla, sin hacer scroll.

**Acceptance Scenarios**:

1. **Given** un visitante nuevo en Inicio, **When** carga la página, **Then** ve el titular, el recorrido de capturas y el botón "Pruébala gratis" sin hacer scroll.
2. **Given** un visitante en Inicio, **When** baja hasta el final, **Then** encuentra accesos visibles a Funcionalidades, Para tu negocio, Contadores y Preguntas frecuentes, y un CTA final de descarga.
3. **Given** un visitante que usó la landing anterior, **When** abre una dirección antigua con ancla (por ejemplo `#como-funciona`), **Then** llega al contenido equivalente del nuevo sitio y no a una página de error.

---

### User Story 2 - Navegar entre páginas con un menú claro (Priority: P1)

Cualquier visitante, desde cualquier página, puede ir a cualquier otra sección del sitio mediante un
menú principal (en celular, un menú desplegable operable con teclado y táctil) y un pie de página con
todos los enlaces.

**Why this priority**: sin navegación, el contenido repartido en páginas queda inaccesible; es la base del sitio.

**Independent Test**: desde cada página, llegar a cualquier otra en un máximo de 2 toques/clics usando solo el menú.

**Acceptance Scenarios**:

1. **Given** un visitante en celular, **When** abre el menú, **Then** ve todas las páginas principales, el botón de descarga destacado y el acceso "Ingresar" como secundario.
2. **Given** un visitante en cualquier página, **When** mira el menú, **Then** se indica en qué página está.
3. **Given** un usuario de teclado, **When** recorre el menú con Tab, Enter y Escape, **Then** puede abrirlo, navegarlo y cerrarlo, con foco visible.

---

### User Story 3 - Conocer las funcionalidades en detalle (Priority: P2)

Un visitante interesado quiere saber exactamente qué hace la app antes de instalarla. En
Funcionalidades ve cada funcionalidad con una captura real, una explicación breve y para qué le sirve.

**Why this priority**: es donde el contenido extenso que el owner valora se luce, sin cargar el Inicio.

**Independent Test**: abrir Funcionalidades y verificar que cada funcionalidad descrita tiene una captura real de la app y existe hoy en la versión publicada.

**Acceptance Scenarios**:

1. **Given** un visitante en Funcionalidades, **When** recorre la página, **Then** ve cada funcionalidad (bodegas, escaneo, entradas y salidas, alertas de stock, historial, funcionamiento sin internet, reporte web) con su captura y descripción.
2. **Given** una funcionalidad sin captura real disponible, **When** se publica la página, **Then** esa funcionalidad se muestra sin imagen inventada (solo texto o ícono).
3. **Given** un visitante que terminó de leer una funcionalidad, **When** busca el siguiente paso, **Then** tiene un CTA de descarga a mano.

---

### User Story 4 - Página dedicada para contadores (Priority: P2)

Un contador recibe un enlace directo a la página de Contadores. Ahí entiende por qué recomendar
StoreFlow a sus clientes y puede contactarse por WhatsApp.

**Why this priority**: los contadores son el canal de crecimiento; tener una dirección propia permite compartirla directamente.

**Independent Test**: compartir la dirección de Contadores, abrirla y llegar al contacto por WhatsApp con el mensaje precargado.

**Acceptance Scenarios**:

1. **Given** un contador en la página de Contadores, **When** toca "Soy contador", **Then** se abre WhatsApp con el mensaje para contadores ya escrito.
2. **Given** la página de Contadores, **When** se comparte en WhatsApp o redes, **Then** la vista previa muestra un título, descripción e imagen propios de esa página.

---

### User Story 5 - Encontrar a qué rubro le sirve y resolver dudas (Priority: P3)

Un visitante entra a "Para tu negocio" y se reconoce en su rubro, o entra a Preguntas frecuentes y
resuelve una duda (precio, iPhone, internet, boletas) sin contactar a nadie.

**Why this priority**: contenido de apoyo que mejora la decisión, pero el sitio funciona sin él.

**Independent Test**: abrir Preguntas frecuentes, ubicar la respuesta a "¿Sirve en iPhone?" y verificar que es honesta; abrir Para tu negocio y encontrar su rubro.

**Acceptance Scenarios**:

1. **Given** un visitante en Preguntas frecuentes, **When** busca una duda, **Then** las preguntas están agrupadas por tema y se abren/cierran con teclado y táctil.
2. **Given** un visitante en Para tu negocio, **When** elige su rubro, **Then** ve los problemas típicos de ese rubro y cómo StoreFlow los aborda, con CTA de descarga.

---

### User Story 6 - Política de privacidad propia (Priority: P3)

Google Play y los usuarios pueden consultar la política de privacidad de StoreFlow en una dirección
del propio sitio oficial.

**Why this priority**: hoy el enlace es un placeholder; un sitio oficial debe alojar su política.

**Independent Test**: abrir la dirección de Privacidad y leer el texto completo.

**Acceptance Scenarios**:

1. **Given** el owner entregó el texto legal, **When** se publica el sitio, **Then** la página de Privacidad lo muestra completo y el pie de página enlaza a ella.
2. **Given** el owner aún no entregó el texto, **When** se publica el sitio, **Then** el enlace de privacidad sigue apuntando al destino vigente y no se publica texto legal inventado.

---

### User Story 7 - Aprender a usar la app con guías paso a paso (Priority: P3)

Un usuario que acaba de instalar StoreFlow (o que lo está evaluando) abre una guía, por ejemplo
"Cómo crear tu primera bodega", y la sigue paso a paso con capturas reales.

**Why this priority**: reduce el abandono después de instalar y suma contenido útil para buscadores, pero el sitio funciona sin ella.

**Independent Test**: abrir una guía publicada y completar la tarea en la app siguiendo solo sus pasos.

**Acceptance Scenarios**:

1. **Given** un visitante en Ayuda, **When** entra, **Then** ve la lista de guías publicadas con título y resumen de una línea.
2. **Given** un visitante en una guía, **When** la sigue, **Then** cada paso está numerado, es breve y, cuando existe, muestra la captura real de ese paso.
3. **Given** un visitante en Funcionalidades que lee sobre una funcionalidad con guía, **When** busca cómo hacerlo, **Then** encuentra un enlace a esa guía.

---

### User Story 8 - Ver el sitio en inglés (Priority: P2)

Un visitante que no habla español (por ejemplo, un socio, inversionista o cliente extranjero)
llega a una página en español, toca "EN" y ve la misma página en inglés. Un enlace compartido a
`/en/...` abre directamente en inglés.

**Why this priority**: amplía el alcance del sitio más allá de Chile; depende de que exista la
base en español (P1), pero cada página traducida es útil por sí sola.

**Independent Test**: desde cualquier página en español, tocar "EN" y llegar a su equivalente en
inglés; volver con "ES" a la misma página en español.

**Acceptance Scenarios**:

1. **Given** un visitante en `/contadores`, **When** toca "EN", **Then** llega a `/en/accountants` con el mismo contenido en inglés y el selector indica el idioma actual.
2. **Given** un visitante en inglés, **When** navega por el menú, **Then** todas las páginas, el pie y la página "no encontrada" están en inglés.
3. **Given** un visitante en inglés, **When** mira cualquier página, **Then** se le informa con honestidad en qué idioma está disponible la app.
4. **Given** un buscador, **When** indexa una página, **Then** encuentra el enlace a su versión en el otro idioma.

---

### Edge Cases

- Direcciones que no existen: el sitio muestra una página "no encontrada" con la marca, menú y acceso a Inicio y Descargar.
- Enlaces antiguos a la landing con anclas (`#como-funciona`, etc.) deben seguir llevando al contenido equivalente.
- Una página sin contenido real (por ejemplo, testimonios vacíos o guías sin redactar) no se publica ni aparece en el menú.
- Visitante con JavaScript deshabilitado: todas las páginas y el menú siguen permitiendo navegar.
- Cambio de tema claro/oscuro: la preferencia elegida se mantiene al pasar de una página a otra.
- Visitante con movimiento reducido: ningún cambio de página ni recorrido usa animación de movimiento.
- Cambio de idioma: conserva el tema elegido y lleva a la página equivalente, no a Inicio. Si una
  guía no está lista en un idioma, no está lista en ninguno (se publican juntas).
- Dirección inexistente bajo `/en/...` o en español: la misma página "no encontrada", con texto
  en ambos idiomas.
- Ancla de rubro o funcionalidad compartida en un idioma: el ancla equivalente existe en el otro
  (`#ferreteria` ↔ `#hardware-store`) y el selector conserva la página, no el ancla.

## Requirements *(mandatory)*

### Functional Requirements

**Estructura y navegación**

- **FR-001**: El sitio MUST tener como mínimo estas páginas, cada una con su propia dirección: Inicio, Funcionalidades, Para tu negocio, Contadores, Preguntas frecuentes, Descargar y Privacidad (esta última sujeta a FR-019).
- **FR-002**: Todas las páginas MUST compartir el mismo encabezado (marca, menú principal, botón de descarga, acceso "Ingresar", selector de tema) y el mismo pie de página.
- **FR-003**: El menú MUST indicar la página actual y MUST ser operable con teclado y táctil; en celular MUST colapsarse en un menú desplegable.
- **FR-004**: El pie de página MUST enlazar a todas las páginas publicadas, al contacto por WhatsApp, a Privacidad, a "Ingresar" y a chileapps.cl.
- **FR-005**: Las anclas de la landing anterior (`#como-funciona`, `#faq`, etc.) MUST seguir funcionando en la raíz del sitio y llevar al contenido equivalente, para que los enlaces antiguos sirvan cuando el dominio de la landing apunte al sitio oficial.
- **FR-006**: El sitio MUST tener una página "no encontrada" con la identidad de marca y accesos a Inicio y Descargar.

**Contenido por página**

- **FR-007**: Inicio MUST mostrar el hero con el recorrido de capturas reales (spec 003), la franja de credibilidad, un resumen de problemas y beneficios, accesos a las páginas internas y un CTA final de descarga.
- **FR-008**: Funcionalidades MUST presentar cada funcionalidad existente hoy en la app con título, descripción, beneficio y, cuando exista, su captura real.
- **FR-009**: Para tu negocio MUST presentar los rubros minimarket, ferretería, distribuidora y bodega, cada uno con sus problemas típicos y cómo StoreFlow los aborda.
- **FR-010**: Contadores MUST presentar las razones para recomendar StoreFlow y el contacto por WhatsApp con mensaje precargado para contadores.
- **FR-011**: Preguntas frecuentes MUST incluir todas las preguntas actuales, agrupadas por tema (por ejemplo: uso, precio, datos y seguridad, compatibilidad).
- **FR-012**: Descargar MUST ofrecer el enlace a Google Play, los requisitos (celular Android) y el acceso "Ingresar" a la versión web para usuarios existentes.
- **FR-013**: Testimonios MUST seguir ocultos mientras no existan testimonios reales.
- **FR-014**: El sitio MUST incluir una sección Ayuda / Guías con 3 a 4 guías paso a paso de uso de la app, derivadas de la guía que entrega el owner. Cada guía MUST tener su propia dirección, una lista de pasos numerados y, por paso, una captura real cuando exista. Una guía cuyo contenido no esté listo MUST NOT publicarse ni aparecer en el menú.
- **FR-014a**: Las guías MUST describir solo lo que la app hace hoy (regla de veracidad) y MUST enlazarse desde la funcionalidad correspondiente en Funcionalidades y desde Preguntas frecuentes cuando aplique.

**Conversión y veracidad**

- **FR-015**: Cada página MUST tener un único CTA principal (instalar desde Google Play), salvo Contadores, cuyo CTA principal es el contacto por WhatsApp; "Ingresar" y los demás enlaces MUST ser visualmente secundarios.
- **FR-016**: Todo el contenido del sitio MUST cumplir la regla de veracidad vigente: solo funcionalidades que existen hoy en la app publicada, sin métricas, testimonios, logos, montos ni funcionalidades excluidas. En particular, MUST NOT afirmarse que la app muestra quién hizo cada movimiento mientras la app no lo muestre.
- **FR-017**: Todas las capturas MUST ser capturas reales de la app; MUST NOT dibujarse pantallas ficticias.
- **FR-018**: El copy en español MUST estar en español de Chile, con tuteo y sin jerga técnica; el copy en inglés MUST ser inglés claro, en segunda persona y sin jerga técnica.

**Idiomas**

- **FR-025**: Todas las páginas y guías MUST existir en español (en la raíz) y en inglés (bajo `/en`), cada una con dirección propia en su idioma.
- **FR-026**: Todas las páginas MUST tener un selector de idioma ES/EN visible en el encabezado (y en el menú móvil) que lleve a la misma página en el otro idioma e indique el idioma actual.
- **FR-027**: Cada página MUST declarar su idioma (`es-CL` o `en`) y enlazar a su versión en el otro idioma para buscadores; el mapa del sitio MUST incluir ambos idiomas.
- **FR-028**: El sitio MUST NOT detectar el idioma del navegador ni redirigir automáticamente.
- **FR-029**: La versión en inglés MUST tener el mismo contenido que la española, sin afirmar nada que la española no afirme (regla de veracidad), y MUST informar en qué idioma está disponible la app.
- **FR-030**: Los mensajes precargados de WhatsApp MUST ir en el idioma de la página.
- **FR-031**: Ningún texto en inglés se publica sin revisión del owner.
- **FR-019**: La página de Privacidad MUST publicarse solo con el texto legal entregado por el owner; mientras no exista, el enlace de privacidad MUST apuntar al destino vigente.

**Calidad transversal**

- **FR-020**: Cada página MUST tener su propio título, descripción y vista previa para compartir en redes y WhatsApp.
- **FR-021**: Cada página MUST verse correctamente desde 360 px hasta 1440 px sin scroll horizontal, con contraste AA en tema claro y oscuro, foco visible y respeto por movimiento reducido.
- **FR-022**: El tema elegido (claro/oscuro) MUST mantenerse al navegar entre páginas.
- **FR-023**: El sitio MUST ser indexable por buscadores (mapa del sitio y direcciones legibles en español).
- **FR-024**: El sitio MUST seguir siendo informativo y estático: sin cuentas, formularios que envíen datos ni backend propio.

### Key Entities

- **Página**: unidad del sitio con dirección propia, título, descripción para compartir, CTA principal y secciones.
- **Funcionalidad**: algo que la app hace hoy; tiene título, descripción, beneficio y captura real opcional.
- **Rubro**: tipo de negocio objetivo con sus problemas típicos y cómo StoreFlow los aborda.
- **Pregunta frecuente**: pregunta, respuesta y tema al que pertenece.
- **Captura**: imagen real de la app con texto alternativo que describe solo lo que se ve.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Desde la primera pantalla de Inicio en un celular de 360 px, un visitante llega a Google Play en 1 toque.
- **SC-002**: Desde cualquier página se llega a cualquier otra en 2 toques o menos.
- **SC-003**: La página de Inicio es al menos un 40 % más corta (en altura de scroll en celular) que la landing actual, sin que se pierda ningún contenido: todo lo que hoy está en la landing existe en alguna página del sitio.
- **SC-004**: El 100 % de las direcciones y anclas de la landing anterior llevan a contenido equivalente (0 páginas de error).
- **SC-005**: Cada página alcanza en celular las metas de calidad vigentes del proyecto (Performance ≥ 90, Accesibilidad ≥ 95, SEO ≥ 95).
- **SC-006**: El 100 % de las afirmaciones del sitio pasan la revisión de veracidad contra la app publicada.
- **SC-007**: Cada página compartida en WhatsApp muestra una vista previa con título y descripción propios (no la de Inicio), en el idioma de la página.
- **SC-008**: El 100 % de las páginas y guías existen en ambos idiomas, y desde cualquiera de ellas el selector lleva a su equivalente en 1 toque.

## Assumptions

- El sitio oficial vive en un proyecto propio, clonado de la landing: repo GitHub `Robin-builds/official-site` y proyecto Vercel `storeflow-official-site`. La landing sigue publicada en su propio proyecto (`storeflow-landing`) hasta que el sitio oficial la reemplace; la landing pasa a ser la página de Inicio. El primer despliegue se hace cuando estén listas las primeras mejoras. El dominio propio (por ejemplo `storeflow.cl`) es una decisión del owner y no bloquea esta spec.
- Se reutilizan la marca, los colores, el modo oscuro, el recorrido de capturas y los estados de interacción de las specs 002–004.
- No se incluye página de precios: la regla de veracidad vigente prohíbe mostrar montos. Precios sigue resuelto en Preguntas frecuentes.
- No se incluye blog, noticias ni novedades en esta versión.
- Las capturas disponibles son las 6 actuales de `/public/screens/`; funcionalidades sin captura se muestran sin imagen hasta que el owner suba capturas nuevas.
- La constitución fue enmendada a la versión 2.0.0 (2026-11-10) para pasar de "la página" a "cada página" sin relajar sus reglas, y a la 3.0.0 (mismo día) para permitir el sitio bilingüe; esta spec se rige por la 3.0.0.
- El owner tiene una guía de uso de la app y la entregará como fuente de las guías; se adapta al español de Chile sin jerga y se divide en 3–4 guías. Si los pasos requieren capturas que hoy no existen en `/public/screens/`, el owner las aportará; mientras tanto el paso se publica solo con texto.
- El número de WhatsApp real y el texto de la política de privacidad los entrega el owner; mientras tanto se mantienen los placeholders actuales.
- La app y sus capturas están en español. Si la app no tiene versión en inglés, el sitio en inglés lo dice y muestra las mismas capturas en español. El owner confirma el idioma de la app antes de publicar el inglés.
- La política de privacidad en inglés solo se publica si el owner entrega su traducción legal; mientras tanto `/en/privacy` sigue la misma regla que FR-019.
