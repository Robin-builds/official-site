# Feature Specification: Refinamiento de conversión del sitio oficial

**Feature Branch**: `010-refinamiento-conversion`

**Created**: 2026-11-17

**Status**: Draft

**Input**: User description: "Refinamiento de conversión del official-site. Cambios surgidos de la revisión visual del 2026-11-17. Objetivo de negocio: priorizar el único camino a instalar la app, reduciendo todo lo que compite con el CTA 'Pruébala gratis' (header con 6 enlaces, color de CTA inconsistente, ritmo vertical con franjas vacías, hero que no aprovecha el primer viewport)."

## Contexto

**Usuario**: dueño o dueña de una pyme chilena (minimarket, ferretería, distribuidora, bodega) que llega
al sitio desde Google o por recomendación, en su mayoría desde el **celular**, y decide en segundos si
vale la pena instalar StoreFlow.

**Problema**: el sitio dispersa la atención en vez de empujar al objetivo.
- El encabezado carga 6 enlaces de sección, más Ingresar, selector de tema y CTA: todo compite con
  "Pruébala gratis".
- En tema claro, el botón "Pruébala gratis" del cierre se ve cian y el resto teal oscuro. El bloque de
  cierre fuerza la paleta del tema oscuro dentro de sí, y con ella el color del botón. Esa
  inconsistencia resta seriedad.
- Secciones contiguas dejan franjas vacías que se leen como "fin de página".
- El hero no aprovecha el primer viewport: el texto parte bajo, hay un hueco superior, y bajo el
  teléfono aparece un rótulo numerado ("2. Crea tus bodegas") que parece un paso suelto, porque es el
  pie del carrusel de pantallas con su número de posición.

**Regla de verificación**: cada requisito funcional tiene al menos un criterio de éxito que lo verifica.
Los criterios que solo se pueden juzgar mirando van marcados **(manual)**, sin disfrazarlos de
automáticos.

## Clarifications

### Session 2026-11-17

- Q: ¿Qué color deben tener los botones "Pruébala gratis" en cada tema? → A: Cada tema usa su propio
  primario: teal (`#155e75`) en claro y cian (`#2ec6da`) en oscuro, también dentro del bloque de cierre.
- Q: ¿Qué hacemos con el texto que rota bajo el teléfono del hero? → A: Se quita el pie visible del
  carrusel; la descripción de cada captura queda solo en el anuncio para lectores de pantalla.
- Q: ¿Desde qué ancho de pantalla se muestra el encabezado completo? → A: Desde 1024px; bajo 1024px,
  menú hamburguesa (reemplaza el corte actual de 1280px).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Encabezado que no distrae (Priority: P1)

Como visitante, quiero un encabezado que me deje claro qué hacer (probar la app) sin seis opciones
compitiendo, para decidir rápido.

**Why this priority**: el encabezado es lo primero que se ve en todas las páginas y hoy reparte la
atención entre 9 elementos. Reducirlo es el cambio de mayor impacto sobre el camino a instalar.

**Independent Test**: abrir cualquier página en escritorio y contar los elementos del encabezado; abrir
el pie y comprobar que todos los destinos quitados siguen ahí.

**Acceptance Scenarios**:

1. **Given** un visitante en escritorio (ancho ≥ 1024px), **When** carga cualquier página,
   **Then** el encabezado muestra solo: logo, Funcionalidades, Para tu negocio, Planes, Ingresar y
   "Pruébala gratis".
2. **Given** el mismo visitante, **When** busca Preguntas frecuentes, Ayuda, Contacto o el cambio de
   tema, **Then** los encuentra en el pie de página, no en el encabezado.
3. **Given** el encabezado, **When** el visitante compara Ingresar con "Pruébala gratis", **Then**
   "Pruébala gratis" es un botón sólido e Ingresar un enlace o botón secundario de menor peso visual.

---

### User Story 2 - Celular sin fricción (Priority: P1)

Como visitante desde el celular (el grueso del tráfico), quiero navegar sin scroll horizontal y con el
CTA siempre a la vista, para no abandonar.

**Why this priority**: es el dispositivo de la mayoría de los visitantes; cualquier fricción aquí pesa
más que en escritorio.

**Independent Test**: recorrer cada página a 360px y a 390px de ancho; abrir y cerrar el menú.

**Acceptance Scenarios**:

1. **Given** un visitante a 360px, **When** recorre cualquier página de arriba a abajo, **Then** nunca
   aparece desplazamiento horizontal.
2. **Given** un visitante con ancho menor a 1024px, **When** mira el encabezado con el menú cerrado,
   **Then** ve el logo, el botón "Pruébala gratis" y el botón de menú; los 3 enlaces de sección están
   dentro del menú.
3. **Given** el menú abierto, **When** el visitante lo cierra (botón, Escape o tocar fuera), **Then**
   el menú se cierra y "Pruébala gratis" sigue visible.
4. **Given** el hero en celular, **When** carga la página de inicio, **Then** texto y teléfono se
   apilan en una columna y el CTA principal es visible sin desplazarse.

---

### User Story 3 - Apariencia consistente (Priority: P2)

Como visitante, quiero que el botón de acción se vea igual en toda la página, porque la inconsistencia
me hace dudar de que el producto sea serio.

**Why this priority**: refuerza la confianza, pero no bloquea el camino a instalar.

**Independent Test**: en tema claro y en tema oscuro, comparar el color de fondo de todos los botones
"Pruébala gratis" de la página.

**Acceptance Scenarios**:

1. **Given** la página de inicio en tema claro, **When** el visitante ve los botones "Pruébala gratis"
   del encabezado, el hero y el cierre, **Then** los tres tienen el mismo color de fondo.
2. **Given** la página de inicio en tema oscuro, **When** compara los mismos botones, **Then** los tres
   tienen el mismo color de fondo.

---

### User Story 4 - Mensaje en el primer viewport (Priority: P2)

Como visitante, quiero captar la propuesta sin desplazarme, con el hero equilibrado y sin huecos ni
rótulos sueltos.

**Why this priority**: el visitante decide en segundos; si título, bajada y CTA no caben en la primera
pantalla, parte del mensaje se pierde.

**Independent Test**: cargar la página de inicio a 1440×900 y a 390×844 sin desplazarse.

**Acceptance Scenarios**:

1. **Given** una pantalla de 1440×900, **When** carga la página de inicio, **Then** título, bajada y
   CTA principal del hero están completos en pantalla sin desplazarse.
2. **Given** una pantalla de 390×844, **When** carga la página de inicio, **Then** título, bajada y CTA
   principal del hero están completos en pantalla sin desplazarse.
3. **Given** el carrusel de pantallas del hero, **When** avanza de una captura a otra, **Then** no
   aparece texto visible bajo el teléfono (ni "1.", "2.", "3." ni la descripción de la captura).

---

### User Story 5 - Flujo sin vacíos (Priority: P3)

Como visitante, quiero que el contenido fluya sin franjas vacías que me hagan creer que la página
terminó.

**Why this priority**: mejora la lectura y el recorrido hasta el cierre, pero su efecto es menor que el
de las historias anteriores.

**Independent Test**: medir la separación vertical entre secciones contiguas de la página de inicio a
360px y a 1440px.

**Acceptance Scenarios**:

1. **Given** la página de inicio, **When** el visitante se desplaza entre secciones, **Then** la
   separación entre cada par de secciones contiguas es la misma para un mismo ancho de pantalla.
2. **Given** dos secciones contiguas con el mismo color de fondo, **When** el visitante pasa de una a
   otra, **Then** el espacio entre ellas no es el doble del estándar.

---

### Edge Cases

- **Tema claro vs oscuro**: la consistencia del CTA se verifica en ambos temas, incluido el bloque de
  cierre, que hoy fuerza la paleta oscura. El botón del cierre debe seguir cumpliendo contraste AA
  sobre ese fondo oscuro.
- **Sin JavaScript**: el menú móvil debe abrirse y cerrarse igual, y la página actual seguir marcada
  (Principio V de la constitución).
- **Cambio de tamaño con el menú abierto**: al pasar de móvil a escritorio con el menú abierto, el
  encabezado de escritorio se muestra correcto y el panel del menú no queda visible encima.
- **Inglés publicado**: hoy el sitio en inglés no está publicado y el selector ES/EN no se muestra. Si
  se publica, el selector no cuenta como enlace de sección y no debe romper el ancho mínimo del
  encabezado (ver Assumptions).
- **Ayuda sin guías**: si la página Ayuda no tiene guías listas no se publica; el pie no debe mostrar un
  enlace roto a ella.
- **Página actual**: si el visitante está en Preguntas frecuentes, Ayuda o Contacto (que ya no están en
  el encabezado), ningún enlace de sección aparece marcado como actual y eso no es un error.
- **Movimiento reducido**: con `prefers-reduced-motion`, el carrusel del hero tampoco muestra texto
  bajo el teléfono.
- **Lectores de pantalla**: al quitar el pie visible, quien usa lector de pantalla sigue escuchando la
  descripción de cada captura al cambiar de pantalla.
- **Etiquetas largas a 360px**: el logo, "Pruébala gratis" y el botón de menú caben en una línea sin
  desbordar.

## Requirements *(mandatory)*

### Functional Requirements

**Encabezado (US-1)**

- **FR-001**: Con ancho ≥ 1024px, el encabezado MUST mostrar exactamente 3 enlaces de
  sección: Funcionalidades, Para tu negocio y Planes, en ese orden.
- **FR-002**: Preguntas frecuentes, Ayuda y Contacto MUST NOT aparecer en el encabezado (ni en
  escritorio ni dentro del menú móvil) y MUST seguir accesibles desde el pie.
- **FR-003**: El selector de tema MUST NOT aparecer en el encabezado (ni en escritorio ni dentro del menú
  móvil); MUST seguir disponible en el pie, donde ya existe.
- **FR-004**: El encabezado MUST conservar el logo (enlace a Inicio), el acceso "Ingresar" y el botón
  "Pruébala gratis".
- **FR-005**: "Pruébala gratis" MUST ser un botón sólido de color primario; "Ingresar" MUST ser un enlace
  o botón secundario sin fondo sólido, de menor peso visual.
- **FR-006**: Bajo 1024px, los 3 enlaces de sección y el acceso "Ingresar" MUST estar
  dentro de un menú desplegable; "Pruébala gratis" MUST quedar visible fuera del menú.
- **FR-007**: El pie MUST listar todos los destinos publicados del sitio: Inicio, Funcionalidades, Para
  tu negocio, Planes, Preguntas frecuentes, Ayuda (si está publicada), Descargar, Sé partner, Contacto,
  Ingresar a la versión web y Política de privacidad. Ningún destino MUST perderse al quitar
  elementos del encabezado.

**Consistencia del CTA (US-3)**

- **FR-008**: Todos los botones "Pruébala gratis" de una página (encabezado, hero, cierre) MUST mostrar
  el mismo color de fondo: el primario del tema activo de la página (teal en tema claro, cian en tema
  oscuro). El bloque de cierre MUST NOT imponer al botón el primario de otro tema, aunque su fondo
  siga siendo oscuro en ambos temas.
- **FR-009**: Ninguna página MUST tener un botón de acción primaria con un color de fondo distinto al
  primario del tema activo.

**Hero (US-4)**

- **FR-010**: En el primer viewport, sin desplazarse, el bloque de texto del hero (título, bajada y CTA
  principal) MUST estar completo en pantalla, y el espacio entre el borde inferior del encabezado y el
  primer elemento del hero MUST NOT superar la separación estándar entre secciones.
- **FR-011**: El carrusel del hero MUST NOT mostrar texto visible bajo el teléfono (ni número ni
  descripción de la captura). La descripción de cada captura MUST seguir disponible para lectores de
  pantalla (anuncio al cambiar y etiquetas de los controles). La secuencia numerada 1-2-3 MUST vivir
  solo en la sección "Cómo funciona".

**Ritmo vertical (US-5)**

- **FR-012**: La separación vertical entre secciones contiguas de una página MUST ser un único valor
  estándar para cada ancho de pantalla (con su variante para celular). Dos secciones contiguas MUST
  NOT sumar dos separaciones completas entre sí.

**Responsive (US-2)**

- **FR-013**: Entre 360px y 1023px, ninguna página MUST producir
  desplazamiento horizontal.
- **FR-014**: En celular, el hero de dos columnas (texto y teléfono) MUST apilarse en una columna, con
  el texto primero y el CTA principal visible sin desplazarse.
- **FR-015**: El corte de escritorio MUST ser 1024px, igual en todas las páginas: con ancho ≥ 1024px se
  muestra el encabezado completo; bajo 1024px, el menú desplegable. A 1024px el encabezado completo
  MUST caber en una línea sin desbordar.

### Key Entities

- **Destino de navegación**: página o enlace externo del sitio (nombre visible, dirección, si está
  publicado, si va en el encabezado). Hoy 6 destinos van en el encabezado; tras esta feature van 3.
- **Botón de acción primaria**: el CTA "Pruébala gratis" que lleva a Google Play; aparece en
  encabezado, hero y cierre.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A 1024px y a 1440px, el encabezado de cada página contiene exactamente 3 enlaces de sección, y son
  Funcionalidades, Para tu negocio y Planes. *(auto)*
- **SC-002**: A 1024px, a 1440px y a 390px (menú abierto), el encabezado contiene 0 selectores de tema y 0
  enlaces a Preguntas frecuentes, Ayuda o Contacto. *(auto)*
- **SC-003**: A 360px y a 390px, en cada página publicada, el ancho del contenido es ≤ el ancho de la
  ventana (0 páginas con desplazamiento horizontal). *(auto)*
- **SC-004**: A 390px y a 1023px, el botón de menú abre y cierra el panel (con clic y con teclado), y con el
  menú cerrado "Pruébala gratis" está dentro de la pantalla. *(auto)*
- **SC-005**: En la página de inicio, en tema claro y en tema oscuro, los botones "Pruébala gratis"
  presentan 1 solo color de fondo distinto por tema. *(auto)*
- **SC-006**: La revisión automática de accesibilidad reporta 0 violaciones de contraste en los botones
  "Pruébala gratis", en Ingresar y en los enlaces del encabezado, en ambos temas. *(auto)*
- **SC-007**: A 1440×900 y a 390×844, el área de título, bajada y CTA principal del hero queda completa
  dentro de la primera pantalla. *(auto)*
- **SC-008**: En la página de inicio, a 360px y a 1440px, la separación medida entre cada par de
  secciones de contenido contiguas (después del hero y de la franja de credibilidad pegada a él) es la misma; diferencia máxima 0px por ancho. *(auto)*
- **SC-009**: El pie de cada página contiene un enlace a cada destino listado en FR-007 que esté
  publicado (0 faltantes). *(auto)*
- **SC-010**: Durante un ciclo completo del carrusel del hero, 0 textos visibles aparecen bajo el
  teléfono, y el anuncio accesible de cada captura conserva su descripción. *(auto)*
- **SC-011**: La distancia entre el borde inferior del encabezado y el primer elemento del hero es ≤ la
  separación estándar entre secciones, a 390px y a 1440px. *(auto)*
- **SC-012 (manual)**: El hero se percibe equilibrado, sin hueco superior notorio, en escritorio y
  celular.
- **SC-013 (manual)**: "Ingresar" se percibe claramente secundario frente a "Pruébala gratis".
- **SC-014 (manual)**: Percepción global de consistencia visual (paleta, botones, ritmo) en ambos temas.

### Trazabilidad requisito → criterio

| FR | Cubierto por | Tipo |
|--------|-----------------------|---------------|
| FR-001 | SC-001 | auto |
| FR-002 | SC-002, SC-009 | auto |
| FR-003 | SC-002 | auto |
| FR-004 | SC-001, SC-004 | auto |
| FR-005 | SC-006, SC-013 | auto + manual |
| FR-006 | SC-004 | auto |
| FR-007 | SC-009 | auto |
| FR-008 | SC-005 | auto |
| FR-009 | SC-005, SC-006 | auto |
| FR-010 | SC-007, SC-011, SC-012 | auto + manual |
| FR-011 | SC-010 | auto |
| FR-012 | SC-008, SC-014 | auto + manual |
| FR-013 | SC-003 | auto |
| FR-014 | SC-007 (390×844) | auto |
| FR-015 | SC-001, SC-004 | auto |

La verificación falla si algún FR queda sin fila. Dirección: requisito → criterio, no al revés.

## Assumptions

- **A-1**: El selector de tema ya vive en el pie; solo se quita del encabezado, también del menú móvil.
  (Aclaración #3 de la entrada, aceptada como propuesta.)
- **A-2**: El selector de idioma ES/EN no es un enlace de sección. Hoy no se muestra porque el inglés no
  está publicado; si se publica, se queda en el encabezado (dentro del menú en celular) y no cuenta para
  FR-001.
- **A-3**: El carrusel de pantallas del hero se mantiene. FR-011 quita solo su pie visible; no
  cambia las capturas, los controles ni el anuncio para lectores de pantalla.
- **A-4**: No cambia el copy de las secciones. Solo se mueven o quitan elementos existentes.
- **A-5**: Los criterios aplican a todas las páginas que usan el encabezado y el pie comunes. Los
  criterios del hero (SC-007, SC-010, SC-011) y de ritmo (SC-008) aplican a la página de inicio.
- **A-6**: El botón secundario del hero ("Ver cómo funciona") sigue siendo secundario y no entra en
  FR-008/FR-009.
- **A-7**: La verificación automática puede requerir herramientas de prueba en el navegador que hoy no
  están instaladas. Su elección e instalación se deciden en el plan y requieren confirmación del owner
  (constitución, Principio IV y Flujo de desarrollo).

## Fuera de alcance

- Rediseño de la página Planes y la decisión de mostrar u ocultar precios (otra spec).
- Cambios de copy o mensajes.
- Prueba social o testimonios.
- Performance y peso de las imágenes del carrusel (se puede especificar aparte).
- La app Android y la versión web con sesión iniciada.
- Rediseño del pie más allá de asegurar que recibe los destinos quitados del encabezado.
