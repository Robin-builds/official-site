# Feature Specification: Más contraste y bordes naranjos en el tema claro

**Feature Branch**: `008-tema-claro-contraste`

**Created**: 2026-11-15

**Status**: Draft

**Input**: User description: "trabajemos en el tema claro, esta muy poco marcado la diferencia entre blanco y grises es muy bajo, mas contrastes, ponle algun borde de color, si en el modo oscuro trabajamos con los bordes en calipso, podríamos trabajar con el color anaranjado en el modo claro mas el color de las tarjetas"

## Contexto

En el tema claro el sitio se ve "lavado": el fondo de la página, los fondos alternos de las secciones
y las tarjetas son blancos o grises casi blancos, y los bordes de las tarjetas son un gris tan suave
que apenas se distinguen. El ojo no encuentra dónde termina una sección y empieza otra, ni dónde
termina una tarjeta.

En el tema oscuro, en cambio, el acento de las tarjetas es el calipso (cian) de la marca: cuando una
tarjeta se resalta, su borde y su brillo se vuelven calipso. Esa identidad funciona.

Esta spec pide tres cosas, **solo para el tema claro**:

1. **Más contraste entre superficies**: fondo de página, fondos alternos de sección y tarjetas se
   distinguen a simple vista entre sí.
2. **Bordes de color naranjo**: el naranjo de la marca (el "FLOW" del logo) cumple en el tema claro
   el papel que el calipso cumple en el oscuro: da color a los bordes de las tarjetas y a su resaltado.
3. **Color de las tarjetas**: las tarjetas dejan de ser blanco-sobre-casi-blanco y tienen un fondo
   que las separa del fondo de la sección.

El tema oscuro no cambia. Tampoco cambia ningún texto, sección, página, ni la animación de la spec 007
(duración, curva, desplazamiento): solo cambian colores del tema claro.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Distinguir secciones y tarjetas en el tema claro (Priority: P1)

Un dueño de minimarket abre el sitio en su celular con el tema claro (por elección o porque su
sistema está en claro). Al recorrer Inicio identifica sin esfuerzo dónde empieza cada sección y
dónde está cada tarjeta, aunque la pantalla tenga brillo alto o esté al sol.

**Why this priority**: es el problema que el owner reporta: hoy el blanco y los grises casi no se
diferencian. Sin esto, el resto (bordes de color) no se apoya en una base legible.

**Independent Test**: con el tema claro activo, recorrer Inicio, Funcionalidades, Ayuda, Sé partner,
Contacto y la 404, y comprobar que cada tarjeta se distingue de su fondo y cada fondo alterno de sección
se distingue del contiguo, midiendo las diferencias de luminosidad contra los umbrales de SC-001 y SC-002.

**Acceptance Scenarios**:

1. **Given** el tema claro activo, **When** el visitante ve una tarjeta sobre el fondo de su sección,
   **Then** el contorno de la tarjeta se percibe completo sin necesidad de sombra ni de hover.
2. **Given** el tema claro activo, **When** el visitante pasa de una sección a la siguiente con
   distinto fondo, **Then** el cambio de fondo se nota a simple vista.
3. **Given** el tema claro activo, **When** se lee cualquier texto del sitio, **Then** sigue
   cumpliendo contraste AA sobre su nuevo fondo.

---

### User Story 2 - Bordes naranjos como identidad del tema claro (Priority: P1)

El visitante en tema claro ve que las tarjetas tienen un borde naranjo claro, y que al pasar el
mouse (o navegar con teclado) sobre una tarjeta, su borde se vuelve naranjo oscuro y su brillo es
naranjo, igual que en el tema oscuro ocurre con el calipso.

**Why this priority**: es el pedido explícito del owner y lo que da identidad al tema claro.

**Independent Test**: en tema claro, observar una tarjeta en reposo (borde naranjo claro
visible) y luego en hover y en foco de teclado (borde naranjo oscuro + brillo naranjo); repetir en
tema oscuro y comprobar que sigue siendo calipso.

**Acceptance Scenarios**:

1. **Given** el tema claro, **When** una tarjeta está en reposo, **Then** su borde es naranjo
   claro, claramente más visible que el gris actual.
2. **Given** el tema claro, **When** el puntero pasa sobre una tarjeta o una tarjeta recibe foco
   de teclado, **Then** su borde se vuelve naranjo oscuro y el brillo de su sombra es naranjo.
3. **Given** el tema claro, **When** el puntero pasa sobre una captura de la app (spec 007),
   **Then** su borde de color es naranjo.
4. **Given** el tema oscuro, **When** se repiten los pasos anteriores, **Then** todo se ve exactamente
   como hoy (bordes y brillos calipso).

---

### User Story 3 - Coherencia del naranjo en el resto de elementos con borde (Priority: P3)

Los demás elementos con borde del tema claro (chips del índice de Funcionalidades, insignia del Hero,
acordeones de FAQ, campos del formulario de Contacto) usan el mismo lenguaje: borde visible en
reposo y, los que ya cambian de borde al resaltarse (chips), naranjo al resaltarse; sin competir con
la CTA principal.

**Why this priority**: mejora la coherencia, pero el valor principal está en las tarjetas.

**Independent Test**: en tema claro, pasar el mouse y el foco por chips, campos y acordeones y
comprobar que su borde de resalte es naranjo y que la CTA "Pruébala gratis" sigue siendo el elemento
más llamativo de la página.

**Acceptance Scenarios**:

1. **Given** el tema claro, **When** el puntero pasa sobre un chip del índice de Funcionalidades,
   **Then** su borde se resalta en naranjo.
2. **Given** el tema claro, **When** un campo del formulario de Contacto tiene un error,
   **Then** su borde sigue siendo rojo (el naranjo nunca reemplaza al color de error).

---

### Edge Cases

- **Bloque forzado en oscuro dentro de una página clara** (CTA final): conserva los colores del tema
  oscuro, incluidos sus bordes calipso.
- **Sin JavaScript con el sistema en claro**: el tema claro que sigue al sistema se ve idéntico al
  tema claro elegido a mano (mismos fondos, mismos bordes naranjos).
- **Pantallas táctiles**: el borde en reposo ya da el contorno; el resalte no queda "pegado" al tocar
  (regla heredada de las specs 004 y 007).
- **Movimiento reducido**: el cambio de color del borde ocurre igual; solo se suprime el movimiento,
  como hoy.
- **Estados de error y éxito**: rojo (error) y verde (éxito) prevalecen sobre el naranjo.
- **Fondo del QR de Contacto**: sigue blanco puro para que las cámaras lo lean.
- **Foco de teclado**: el anillo de foco sigue siendo visible y distinguible del borde naranjo de
  reposo (no se confunde "tiene tinte naranjo" con "tiene foco").

## Requirements *(mandatory)*

### Functional Requirements

**Contraste de superficies (tema claro)**

- **FR-001**: En el tema claro, el fondo de la página, los fondos alternos de sección y el fondo de
  las tarjetas MUST tener diferencias de luminosidad suficientes para distinguirse a simple vista
  (umbrales en SC-001 y SC-002).
- **FR-002**: Toda tarjeta del tema claro MUST tener un fondo distinto al de la sección que la
  contiene: tarjetas blancas sobre secciones grises y, donde la sección es blanca o gris, tarjetas
  con un fondo cálido (durazno derivado del naranjo de marca).
- **FR-003**: El borde en reposo de las tarjetas con caja visible del tema claro MUST ser naranjo
  claro y visiblemente más marcado que el actual. Los demás elementos con borde (encabezado, pie,
  divisores, campos, selectores, insignia del Hero) MUST tener un borde neutro más marcado que el
  actual, sin tinte naranjo, para no competir con la CTA principal.
- **FR-004**: Todo texto MUST mantener contraste AA (4.5:1 normal, 3:1 grande) sobre los nuevos
  fondos; si un color de texto deja de cumplir, MUST ajustarse.

**Naranjo como acento de resalte (tema claro)**

- **FR-005**: En el tema claro, el borde de una tarjeta resaltada (hover o foco de teclado) MUST ser
  naranjo y el brillo de su sombra MUST ser naranjo, en todas las tarjetas que hoy se resaltan
  (spec 007).
- **FR-006**: En el tema claro, el borde de color de las capturas de la app al pasar el mouse (spec 007)
  MUST ser naranjo.
- **FR-007**: El naranjo usado en bordes resaltados MUST tener contraste ≥ 3:1 contra el fondo
  adyacente (requisito de componentes no textuales); puede ser una variante más oscura del naranjo
  de marca si el naranjo puro no alcanza. En los demás artefactos se le llama "naranjo oscuro".
- **FR-008**: Los demás elementos cuyo borde hoy se resalta con el primario (chips del índice de
  Funcionalidades) MUST resaltarse en naranjo en el tema claro. Los elementos que hoy no cambian de borde
  al resaltarse (campos de formulario, botón secundario, acordeones, selector de idioma y de tema)
  solo ganan un borde en reposo más visible: agregarles un borde de resalte cambiaría el tema oscuro
  (FR-009). El estado de error sigue rojo.

**Límites**

- **FR-009**: El tema oscuro (incluido el bloque forzado en oscuro del CTA final) MUST NOT cambiar.
- **FR-010**: La CTA principal ("Pruébala gratis" o la del formulario en Contacto), los enlaces y el
  color primario de botones MUST NOT pasar a naranjo: el naranjo es acento de bordes y superficies,
  no de conversión, para que la CTA principal siga dominando (Principio II).
- **FR-011**: El tema claro elegido a mano y el tema claro que sigue al sistema sin JavaScript MUST
  verse idénticos.
- **FR-012**: El naranjo MUST provenir del naranjo de la marca (o variantes más claras u oscuras de
  él). MUST NOT introducirse familias de color nuevas; se permiten variantes de los neutros y de los
  colores existentes (cian, naranjo, rojo, verde) cuando lo exige el contraste (FR-004, FR-007).
- **FR-013**: MUST NOT cambiar textos, estructura de páginas, duración, curva ni desplazamiento de las
  animaciones de hover.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En tema claro, toda tarjeta con caja visible tiene un borde en reposo con contraste
  ≥ 1.5:1 contra el fondo de su sección (hoy ≈ 1.25:1), y en todas las combinaciones donde el diseño
  lo permite su fondo difiere del de la sección en ≥ 1.10:1 (hoy 1:1 en tarjetas blancas sobre secciones
  blancas). Las tarjetas que aparecen sobre ambos fondos de sección (p. ej. listas alternadas) se
  separan por el borde. Excepción: el panel de "Sé partner" conserva su borde de marca propio y se
  separa de su sección por el fondo (≥ 1.10:1).
- **SC-002**: En tema claro, dos secciones contiguas con fondos distintos tienen entre sí una razón de
  contraste ≥ 1.08:1 **o** una diferencia de color ΔE (CIELAB) ≥ 10, que cubre fondos de luminosidad
  parecida pero tono claramente distinto (gris frío frente a durazno). Hoy: ≈ 1.05:1 entre blanco y
  #F8FAFC, y blanco contra blanco en las secciones "alternadas".
- **SC-003**: El borde resaltado (hover/foco) de las tarjetas en tema claro tiene contraste ≥ 3:1
  contra el fondo de la sección.
- **SC-004**: El 100% de los textos del sitio en tema claro cumple AA (verificado con Lighthouse
  Accessibility ≥ 95 en cada página y medición manual de los pares nuevos).
- **SC-005**: Captura de cada página en tema oscuro antes y después: sin diferencias visuales.
- **SC-006**: Al mostrar Inicio en tema claro al owner, identifica en menos de 3 segundos dónde
  empieza cada sección y cada tarjeta, y reconoce el naranjo como acento del tema claro.

## Assumptions

- "Calipso" se entiende como el cian de marca (#2EC6DA), que es el acento de resalte del tema oscuro.
- El borde naranjo en reposo es un naranjo claro (no el naranjo oscuro del resalte) para no saturar
  la página; el naranjo oscuro se reserva para el resalte. Si el owner prefiere naranjo oscuro siempre, es un ajuste
  de valor, no de alcance.
- "El color de las tarjetas" se interpreta como el fondo de las tarjetas: se diferencia del fondo de
  la sección, con un fondo cálido (durazno) derivado del naranjo donde la sección es blanca o gris.
- Los enlaces de texto y la CTA principal conservan el primario actual del tema claro (cian oscuro);
  cambiar el color de conversión queda fuera de alcance.
- Las sombras del tema claro pueden reforzarse levemente para ayudar a separar superficies, sin
  cambiar su forma.
- Sin dependencias nuevas; el cambio se concentra en los tokens de diseño compartidos (Principio III).
