# Feature Specification: Hover animado y atractivo en todas las tarjetas del sitio

**Feature Branch**: `007-card-hover-animado`

**Created**: 2026-11-15

**Status**: Draft

**Input**: User description: "trabajemos en todas las card del site, ninguna tiene un hover, debemos crear un hover atractivo y con una animacion suave" + ampliación: "además otro hover a las capturas de la app que tenga: un borde de color y un leve zoom y marquemos la sombra para destacar que flotan"

## Contexto

La spec 004 agregó un resaltado a las tarjetas de Inicio (Problemas, Beneficios, Cómo funciona,
Credibilidad, Testimonios) y después se reutilizó en Atajos de Inicio y en el índice de guías de
Ayuda. Es un efecto discreto: la tarjeta sube 3 px y el borde cambia de color. En la práctica no se
percibe como "hover", y las tarjetas de las páginas que llegaron después (spec 005 y 006) no tienen
ninguno.

Esta spec pide tres cosas:

1. **Cobertura total**: toda superficie con forma de tarjeta del sitio, en todas las páginas y en
   ambos idiomas, responde al puntero.
2. **Un efecto más atractivo**: el resaltado se nota a simple vista, con una animación suave y
   fluida, igual en todas las tarjetas.
3. **Capturas de la app que flotan**: las capturas de pantalla (dentro del marco de teléfono)
   tienen su propio hover: borde de color, leve zoom y una sombra más marcada que las hace ver
   suspendidas sobre la página.

Se mantiene todo lo que la spec 004 dejó resuelto: accesibilidad, movimiento reducido, nada pegado en
pantallas táctiles, cero saltos de layout y solo tokens de tema. No cambia ningún texto, sección ni
orden (Principios I y III), no agrega dependencias (Principio IV) y respeta el Principio V. Esta spec
**reemplaza** los valores visuales de la 004 (FR-001, FR-002 y FR-005); el resto de la 004 sigue
vigente.

### Inventario de tarjetas (estado actual)

| Página | Tarjeta | Hover hoy |
|--------|---------|-----------|
| Inicio | Problemas (tarjeta visible) | Discreto (004) |
| Inicio | Beneficios, Cómo funciona, Credibilidad (ítems sin caja en reposo) | Discreto (004) |
| Inicio | Testimonios (oculta hasta que haya testimonios reales) | Discreto (004) |
| Inicio | Atajos a otras páginas (tarjeta-enlace) | Discreto |
| Ayuda | Índice de guías (tarjeta-enlace) | Discreto |
| Para tu negocio | Paneles "Problemas" y "Cómo te ayuda" de cada rubro | Ninguno |
| Sé partner | Panel de partner (motivos + botón) | Ninguno |

### Inventario de capturas de la app (estado actual)

Todas las capturas se muestran dentro del mismo marco de teléfono; ninguna tiene hover hoy.

| Página | Captura |
|--------|---------|
| Inicio | Carrusel de pantallas del hero |
| Funcionalidades | Captura de cada funcionalidad que la tiene |
| Guías de Ayuda | Captura de cada paso que la tiene |

**Fuera del inventario a propósito**: el bloque de texto de las filas de Funcionalidades y de los
pasos de las guías (no tienen forma de tarjeta; solo su captura recibe el hover de capturas), contenedor de Preguntas frecuentes (su
estado ya lo cubre el botón "+" de la 004), recuadro del QR de Contacto, formulario de Contacto y su
aviso sin JavaScript, CTA final y hero.

## Clarifications

### Session 2026-11-15

- Q: En pantallas táctiles no hay hover; ¿las tarjetas y capturas dan alguna respuesta al tocarlas? → A: Sí: al presionar, la tarjeta o captura se hunde levemente (~98%) y el borde toma el color de marca; vuelve apenas se suelta.
- Q: ¿El bloque de texto de las filas de Funcionalidades y de los pasos de las guías se comporta como tarjeta? → A: No; solo la captura reacciona y el texto queda como hoy.
- Q: ¿El carrusel del hero recibe el hover de capturas (borde, zoom y sombra)? → A: Sí, el mismo hover que las demás capturas.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Las tarjetas responden de forma visible y suave al mouse (Priority: P1)

Un dueño de minimarket recorre el sitio en el computador. Al pasar el mouse sobre cualquier tarjeta,
esta se eleva de forma visible, proyecta una sombra más profunda con un leve brillo del color de la
marca y su borde se ilumina con el color primario. El movimiento es suave, sin tirones. Al sacar el
mouse, la tarjeta vuelve a su lugar con la misma suavidad. El efecto es el mismo en todas las páginas.

**Why this priority**: es exactamente lo que pidió el owner. Las tarjetas son la mayor superficie del
sitio, y que respondan al puntero es lo que hace que el sitio se sienta vivo y cuidado.

**Independent Test**: en escritorio, pasar el mouse por cada tarjeta del inventario en todas las
páginas (español e inglés, tema claro y oscuro) y comprobar que en todas aparece el mismo resaltado
completo: elevación, sombra con brillo y borde de marca. La entrada y la salida deben verse suaves.

**Acceptance Scenarios**:

1. **Given** una tarjeta del inventario en reposo, **When** el puntero entra en ella, **Then** en ~300 ms sube entre 4 y 6 px, su sombra se hace más profunda con un leve brillo del color primario y su borde pasa al color primario.
2. **Given** una tarjeta resaltada, **When** el puntero sale, **Then** vuelve al reposo con la misma suavidad, sin saltos.
3. **Given** el puntero que entra y sale rápido de una tarjeta (o pasa por varias seguidas), **When** se interrumpe la animación, **Then** la tarjeta continúa desde donde estaba, sin saltar al inicio ni parpadear.
4. **Given** dos tarjetas cualesquiera de páginas distintas, **When** se resaltan, **Then** la duración, la curva de movimiento, la distancia de elevación y el estilo de borde y sombra son idénticos.
5. **Given** un panel grande (panel de partner, paneles de rubro), **When** se resalta, **Then** muestra el mismo tipo de resaltado, con una elevación en el extremo bajo del rango para que el movimiento no se vea exagerado en una superficie grande.
6. **Given** una tarjeta resaltada, **When** se mide la página, **Then** ningún elemento vecino cambia de posición ni de tamaño.

---

### User Story 2 - El contenido de la tarjeta acompaña el resaltado (Priority: P2)

Al resaltarse una tarjeta, su ícono principal crece levemente, gira un poco y se llena con el color
primario. En las tarjetas que son enlaces a otra página (Atajos, guías de Ayuda), la flecha o el
indicador se desplaza hacia la derecha, como una invitación a entrar. Todo ocurre al mismo tiempo que
la tarjeta y al pasar por cualquier parte de ella, no solo sobre el ícono.

**Why this priority**: es lo que hace que el efecto sea atractivo y no solo correcto, pero depende de
que la tarjeta ya se resalte (US1).

**Independent Test**: pasar el mouse por el texto de una tarjeta, lejos del ícono, y comprobar que el
ícono reacciona y, en las tarjetas-enlace, que la flecha avanza en sincronía con la tarjeta, en tema
claro y oscuro.

**Acceptance Scenarios**:

1. **Given** una tarjeta con ícono principal en reposo, **When** el puntero entra en cualquier punto de la tarjeta, **Then** el ícono escala a ~1.1, gira levemente (no más de 6°) y su contenedor toma el color primario con el ícono en el color de contraste, en la misma animación que la tarjeta.
2. **Given** una tarjeta-enlace con flecha o indicador, **When** se resalta, **Then** el indicador se desplaza unos pocos píxeles hacia la dirección de lectura (hacia la derecha) y vuelve al salir.
3. **Given** una tarjeta sin ícono principal (Testimonios, paneles de rubro, panel de partner), **When** se resalta, **Then** muestra el resaltado de tarjeta sin animar los íconos secundarios (checks, alertas, números de paso).
4. **Given** tema claro o tema oscuro, **When** el ícono está resaltado, **Then** se distingue de su fondo con contraste ≥ 3:1.

---

### User Story 3 - Teclado, táctil y movimiento reducido tienen una experiencia equivalente (Priority: P2)

Un visitante que navega con Tab ve el mismo resaltado cuando el foco llega a un enlace o botón dentro
de una tarjeta. En el celular, tocar una tarjeta no la deja "levantada" al seguir haciendo scroll. Una
persona con movimiento reducido activado ve el cambio de color, borde y sombra, pero ninguna tarjeta
se mueve.

**Why this priority**: el sitio se ve sobre todo en el celular y debe seguir siendo accesible
(Principio V). Sin esto, el efecto nuevo rompería lo que la 004 ya dejó resuelto.

**Independent Test**: recorrer las páginas con Tab, con un celular real y con movimiento reducido
activado en el sistema, y comprobar en cada caso el comportamiento descrito.

**Acceptance Scenarios**:

1. **Given** navegación con teclado, **When** el foco visible queda en un elemento dentro de una tarjeta, **Then** la tarjeta muestra el mismo resaltado que con el mouse, además del indicador de foco propio del elemento.
2. **Given** una pantalla táctil, **When** el visitante presiona una tarjeta o una captura, **Then** mientras el dedo está apoyado se hunde levemente (~98%) y su borde toma el color de marca; al soltar o al empezar a hacer scroll vuelve a reposo y ninguna queda resaltada.
3. **Given** movimiento reducido activado, **When** se resalta una tarjeta, **Then** no hay elevación, escala, giro ni desplazamiento; solo cambian colores, borde y sombra.
4. **Given** una tarjeta-enlace en el celular, **When** el visitante la toca, **Then** navega a su destino como hoy, sin necesitar un segundo toque.
5. **Given** movimiento reducido activado o pantalla táctil, **When** se interactúa con una captura de la app, **Then** aplican las mismas reglas que a las tarjetas (sin zoom ni hundimiento con movimiento reducido; en táctil, hundimiento al presionar y nada queda pegado).

---

### User Story 4 - Las capturas de la app flotan al pasar el mouse (Priority: P2)

Un visitante mira una captura de la app en Inicio, Funcionalidades o una guía. Al pasar el mouse
sobre el teléfono, aparece un borde del color de la marca alrededor del marco, el teléfono se acerca
levemente (zoom suave) y su sombra se vuelve más profunda y difusa, como si flotara sobre la página.
Al sacar el mouse vuelve suavemente a su lugar.

**Why this priority**: las capturas son la prueba de que la app existe tal como se describe
(Principio I); destacarlas invita a mirarlas con atención. Es independiente de las tarjetas y se
puede entregar por separado.

**Independent Test**: en escritorio, pasar el mouse por cada captura del inventario (hero, cada
funcionalidad con captura, cada paso de guía con captura) en tema claro y oscuro y comprobar borde de
color, zoom leve y sombra más marcada, con la misma animación suave en todas.

**Acceptance Scenarios**:

1. **Given** una captura en reposo, **When** el puntero entra en el teléfono, **Then** en ~300 ms aparece un borde en el color primario alrededor del marco, el teléfono crece levemente (entre 3% y 5%) y su sombra se hace más profunda y difusa.
2. **Given** una captura resaltada, **When** el puntero sale, **Then** vuelve al reposo con la misma suavidad y sin saltos, incluso si la animación se interrumpe.
3. **Given** el carrusel del hero, **When** se resalta, **Then** el carrusel sigue funcionando igual que hoy (cambio de pantalla, controles e indicadores) y el resaltado no se reinicia al cambiar de pantalla.
4. **Given** cualquier captura resaltada, **When** se mide la página, **Then** ningún elemento vecino cambia de posición ni de tamaño, y el zoom no recorta la captura ni provoca scroll horizontal.
5. **Given** la captura en tema oscuro, **When** se resalta, **Then** el borde de color y la sombra se distinguen del fondo (borde ≥ 3:1) y la sombra sigue dando sensación de profundidad.
6. **Given** una captura de una funcionalidad o un paso, **When** se resalta, **Then** solo la captura cambia; el texto de la fila o del paso no se mueve.

---

### Edge Cases

- **Scroll que empieza sobre una tarjeta (táctil)**: el dedo apoyado para hacer scroll no debe dejar la tarjeta hundida durante el desplazamiento ni provocar parpadeos al pasar por varias tarjetas.
- **Tarjeta-enlace con clic**: al hacer clic con el mouse no aparece el indicador de foco de teclado, pero el resaltado de hover se mantiene mientras el puntero esté encima.
- **Ítems sin caja (Beneficios, Cómo funciona, Credibilidad)**: en reposo se ven exactamente como hoy; al resaltarse aparece la caja con el nuevo efecto sin que el contenido se mueva de lugar (salvo la elevación común). En Cómo funciona, la línea que une los pasos no debe quedar tapada de forma extraña.
- **Brillo de la sombra en tema oscuro**: el brillo del primario debe notarse sin verse como un halo de neón ni bajar la legibilidad del texto dentro de la tarjeta.
- **Tarjetas en filas apretadas (Atajos, guías de Ayuda)**: la sombra ampliada de una tarjeta puede pasar por encima de su vecina, pero no debe recortarse contra el borde de la sección ni tapar el texto de la vecina.
- **Ventana estrecha (360 px)**: ni la elevación, ni la sombra, ni la escala o el giro del ícono generan scroll horizontal.
- **Sección Testimonios vacía**: no se muestra; no hay nada que verificar hasta que existan testimonios reales.
- **Modo de alto contraste del sistema**: los estados no ocultan textos ni bordes; la caja invisible de los ítems sin caja sigue sin verse en reposo.
- **Zoom de la captura en columnas estrechas**: el teléfono que crece puede pasar por encima del margen, pero no debe tapar el texto vecino ni recortarse contra el borde de la sección; en 360 px no se aplica (no hay hover en táctil).
- **Captura pendiente** (marcador cuando aún no existe la imagen real): recibe el mismo hover que una captura real, para no delatar diferencias de comportamiento.
- **Botones del carrusel dentro del teléfono resaltado**: siguen respondiendo con su propio hover y foco; el zoom no desplaza su área de clic de forma perceptible.
- **Cambio de tema con una tarjeta resaltada**: la tarjeta toma los colores del tema nuevo sin parpadeos ni quedarse en un estado intermedio.

## Requirements *(mandatory)*

### Functional Requirements

**Cobertura**

- **FR-001**: Todas las tarjetas del inventario (Contexto) MUST mostrar el resaltado de esta spec, en todas las páginas donde aparecen y en ambos idiomas.
- **FR-002**: Las superficies listadas como fuera del inventario MUST NOT recibir este resaltado.
- **FR-003**: Una tarjeta nueva que se agregue en el futuro MUST poder recibir el resaltado reutilizando el mismo estilo compartido, sin definir un efecto propio.

**Resaltado de tarjeta**

- **FR-004**: Al pasar el puntero, una tarjeta MUST: elevarse entre 4 y 6 px (el mismo valor en todas, salvo FR-005), mostrar una sombra más profunda que en reposo con un leve brillo del color primario, y pasar su borde al color primario.
- **FR-005**: Los paneles grandes (panel de partner y paneles de rubro) MUST usar el mismo resaltado con la elevación en el extremo bajo del rango (4 px).
- **FR-006**: La animación MUST durar ~300 ms con una curva de desaceleración suave (arranque rápido y frenado suave), y MUST ser la misma en todas las tarjetas.
- **FR-007**: Si la animación se interrumpe (el puntero sale antes de que termine), MUST continuar desde el estado actual sin saltos.
- **FR-008**: El resaltado MUST NOT cambiar la posición ni el tamaño de ningún elemento de la página; el borde de marca reemplaza al borde existente sin cambiar su grosor.

**Contenido de la tarjeta**

- **FR-009**: El ícono principal de una tarjeta MUST, mientras la tarjeta esté resaltada, escalar a ~1.1, girar levemente (≤ 6°) y llenarse con el color primario con el ícono en el color de contraste, sincronizado con la tarjeta y activado desde cualquier punto de la tarjeta.
- **FR-010**: En las tarjetas-enlace, el indicador de dirección (flecha o equivalente) MUST desplazarse unos pocos píxeles hacia la derecha mientras la tarjeta esté resaltada. Si una tarjeta-enlace no tiene indicador, MUST NOT agregarse uno solo para este efecto, salvo que el plan lo justifique sin cambiar textos.
- **FR-011**: Los íconos secundarios (checks, alertas de listas, números de paso) MUST NOT animarse.

**Accesibilidad y comportamiento**

- **FR-012**: Una tarjeta MUST mostrar el mismo resaltado cuando un elemento dentro de ella tenga foco visible de teclado. Las tarjetas sin elementos interactivos MUST NOT volverse enfocables solo para recibir el efecto.
- **FR-013**: Los efectos de hover MUST aplicarse solo en dispositivos cuyo puntero permite hover; en pantallas táctiles MUST NOT quedar estados persistentes, y una tarjeta-enlace MUST navegar con un solo toque.
- **FR-013a**: En pantallas táctiles, mientras el dedo presiona una tarjeta del inventario o una captura, esta MUST hundirse levemente (escala ~0.98) y su borde MUST tomar el color primario; MUST volver a reposo al soltar, al cancelarse el toque o al empezar el scroll. El hundimiento MUST usar una animación corta (≤ 150 ms) para sentirse inmediato, MUST NOT retrasar la navegación de las tarjetas-enlace y, con movimiento reducido, se reemplaza solo por el cambio de borde.
- **FR-014**: Con movimiento reducido activado, MUST NOT haber elevación, escala, giro ni desplazamiento; solo cambios de color, borde y sombra.
- **FR-015**: Todos los estados MUST cumplir contraste WCAG AA en tema claro y oscuro: texto ≥ 4.5:1 y elementos gráficos (ícono resaltado, borde de marca contra el fondo) ≥ 3:1.
- **FR-016**: Las animaciones MUST limitarse a desplazamiento, escala, giro, opacidad, color y sombra; MUST NOT animarse propiedades que provoquen recálculo de layout.
- **FR-017**: Todos los colores MUST provenir de los tokens de tema existentes (spec 002). Se permite redefinir el token de sombra resaltada y crear el del brillo, siempre que se definan en ambos temas y el brillo se obtenga del token primario (sin valores hexadecimales nuevos).
- **FR-018**: El contenido, los textos, el orden de las secciones, el botón "+" de Preguntas frecuentes y el funcionamiento del carrusel del hero (cambio de pantalla, controles, indicadores) MUST permanecer sin cambios. Lo único que cambia del carrusel es el hover de captura (FR-019).

**Capturas de la app**

- **FR-019**: Todas las capturas del inventario de capturas MUST mostrar, al pasar el puntero sobre el teléfono: un borde en el color primario alrededor del marco, un zoom leve del teléfono completo (entre 3% y 5%, el mismo valor en todas) y una sombra más profunda y difusa que en reposo que lo haga ver flotando.
- **FR-020**: El hover de capturas MUST usar la misma duración y curva que el de tarjetas (FR-006) y MUST continuar sin saltos si se interrumpe.
- **FR-021**: El zoom MUST aplicarse al teléfono completo (marco y captura juntos), no solo a la imagen interna, y MUST NOT recortar la captura ni cambiar la posición o el tamaño de los elementos vecinos.
- **FR-022**: Las capturas que están dentro de un bloque de texto (filas de Funcionalidades, pasos de guías) MUST resaltarse solo al pasar sobre el teléfono, no sobre el texto.
- **FR-023**: FR-012 (teclado), FR-013 y FR-013a (táctil), FR-014 (movimiento reducido: sin zoom), FR-015 (contraste del borde ≥ 3:1), FR-016 (propiedades animables) y FR-017 (solo tokens; la sombra flotante puede ser un token nuevo definido en ambos temas) MUST aplicarse también a las capturas. Las capturas sin elementos interactivos MUST NOT volverse enfocables; el carrusel se resalta cuando uno de sus controles tiene foco visible.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las tarjetas del inventario muestran el resaltado completo (elevación, sombra con brillo, borde de marca) al pasar el mouse, en todas las páginas, en ambos idiomas y en ambos temas.
- **SC-002**: La duración del resaltado es la misma en todas las tarjetas (~300 ms ± 30 ms) en una revisión página por página.
- **SC-003**: En una prueba con 5 personas, al menos 4 notan sin ayuda que las tarjetas reaccionan al pasar el mouse y describen la animación como suave (no brusca ni lenta).
- **SC-004**: El desplazamiento acumulado del layout (CLS) se mantiene en 0 al recorrer con el mouse todas las tarjetas de cada página.
- **SC-005**: El 100% de los pares de color de los estados nuevos cumplen AA (4.5:1 texto, 3:1 gráficos) en tema claro y oscuro, verificados con una herramienta de contraste.
- **SC-006**: Con movimiento reducido activado, 0 elementos se desplazan, escalan o giran al interactuar con las tarjetas.
- **SC-007**: En un dispositivo táctil, el 100% de las tarjetas y capturas del inventario se hunden al presionarlas; tras soltar o hacer scroll, 0 quedan resaltadas, y el 100% de las tarjetas-enlace navegan con un solo toque.
- **SC-008**: La animación se ve fluida, sin cuadros perdidos visibles, al pasar el mouse rápido por una fila de tarjetas en un computador de gama media.
- **SC-009**: La auditoría móvil de rendimiento y accesibilidad de cada página mantiene Performance ≥ 90 y Accessibility ≥ 95 (sin bajar respecto de antes del cambio).
- **SC-010**: El 100% de las capturas del inventario muestran borde de color, zoom leve y sombra flotante al pasar el mouse, en ambos temas y ambos idiomas, con la misma duración que las tarjetas.
- **SC-011**: El carrusel del hero pasa la misma revisión funcional que antes del cambio (avance, controles, indicadores, movimiento reducido) con el hover activo.

## Assumptions

- "Ninguna tiene hover" se interpreta como que el efecto actual (spec 004) es demasiado discreto para notarse y que las páginas nuevas no tienen ninguno. Por eso la spec refuerza el efecto existente y lo extiende, en lugar de crear uno paralelo.
- Los rangos concretos (4–6 px de elevación, ~300 ms, ~1.1 de escala, ≤ 6° de giro) son valores de partida estándar para un efecto "suave pero visible"; el valor exacto se fija en el plan y se ajusta tras verlo en el navegador, siempre dentro de los rangos.
- El brillo de la sombra se logra con el color primario de la marca con poca opacidad; no se agregan colores nuevos.
- El bloque de texto de las filas de Funcionalidades y de los pasos de las guías queda fuera del hover de tarjetas (confirmado por el owner, Clarifications 2026-11-15); su captura sí recibe el hover de capturas.
- "Capturas de la app" son todas las pantallas mostradas dentro del marco de teléfono, incluido el carrusel del hero, que recibe el mismo hover completo (confirmado por el owner, Clarifications 2026-11-15). El QR de Contacto no es una captura.
- El zoom de la captura (3–5%) es menor que el del ícono de tarjeta (~10%) porque el teléfono es un objeto grande: un zoom mayor se vería brusco.
- El recuadro del QR de Contacto queda fuera: es un objetivo para escanear con la cámara y debe quedarse quieto.
- El panel de partner y los paneles de rubro no contienen un ícono principal; reciben solo el resaltado de tarjeta.
- No se agregan dependencias: el efecto se resuelve con los estilos del proyecto (Principio IV).
- Depende de los tokens de tema de la spec 002 y de las clases de resaltado de la spec 004, que se reutilizan y ajustan.
