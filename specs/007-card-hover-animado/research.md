# Research: Hover animado en tarjetas y capturas (spec 007)

No hay NEEDS CLARIFICATION abiertos: la spec quedó cerrada en la sesión de clarificación del
2026-11-15. Este documento fija los valores y técnicas dentro de los rangos de la spec.

## R1. Reforzar las clases de la spec 004 en lugar de crear un sistema paralelo

- **Decision**: se mantienen `.card-hover`, `.card-ghost` y `.card-icon` en `src/app/globals.css`
  y se cambian sus valores. Las tarjetas nuevas solo agregan esas clases.
- **Rationale**: FR-003 pide un estilo compartido reutilizable; la 004 ya resolvió foco, táctil,
  movimiento reducido, alto contraste y el truco del ítem sin caja. Cambiar valores en un lugar
  actualiza las siete tarjetas existentes de una vez (Principio III: tokens en un solo lugar).
- **Alternatives considered**: un componente `<Card>` (rechazado: las tarjetas son `li`, `figure` y
  `div` con estructuras distintas; un wrapper agrega una capa que ningún requisito pide, Principio IV);
  utilidades de Tailwind por componente (rechazado: duplica el efecto en 10 lugares y rompe FR-006).

## R2. Valores de movimiento y curva

- **Decision**:
  - Elevación de tarjeta: `--card-lift: -5px` por defecto; los paneles grandes fijan
    `[--card-lift:-4px]` (FR-005).
  - Duración: 300 ms. Curva: `cubic-bezier(0.22, 1, 0.36, 1)` (desaceleración tipo "ease-out-quint":
    arranque rápido, frenado largo y suave).
  - Ícono: `scale: 1.1` + `rotate: -6deg`.
  - Flecha de tarjeta-enlace: `translate: 3px 0`.
  - Teléfono: `scale: 1.04`.
  - Se expone como tokens `--motion-hover-duration` y `--motion-hover-ease` en `:root` para que
    tarjetas y teléfonos compartan exactamente lo mismo (FR-006, FR-020).
- **Rationale**: 5 px está en el centro del rango 4–6 px; con 300 ms y esta curva el 80% del
  movimiento ocurre en los primeros ~120 ms, por eso se siente ágil pero suave. 6° es el máximo
  permitido y se nota sin parecer un error. 4% de zoom en un teléfono de 300 px son 6 px por lado:
  visible sin tapar el texto vecino.
- **Alternatives considered**: `ease-out` estándar a 200 ms (es lo que hay hoy y no se percibe);
  rebote tipo resorte con `linear()` (más llamativo, pero "rebota" en tarjetas con texto y se lee
  como inestable); 6 px de elevación (en tarjetas apretadas de Atajos la sombra pisa a la vecina).
- **Interrupción (FR-007, FR-020)**: las transiciones de CSS invierten desde el valor actual cuando
  el estado cambia a mitad de camino; no se necesita JavaScript.

## R3. Sombra con brillo de marca

- **Decision**: se redefine `--elev-card-hover` en los tres bloques de tema (oscuro, claro manual,
  claro sin JS) agregando una tercera capa de color primario:
  `0 14px 36px -14px color-mix(in srgb, var(--primary) X%, transparent)` con X = 35% en oscuro y
  25% en claro. Para el teléfono se crea `--elev-phone-float` (sombra más larga y difusa, mismo
  brillo) y se usa en hover en lugar de `--elev-phone`.
- **Rationale**: FR-017 exige derivar el brillo del token primario sin hexadecimales nuevos;
  `color-mix` ya se usa en el proyecto (`.header-glass`, FAQ). En oscuro el brillo necesita más
  opacidad para verse sobre fondos casi negros; en claro, con menos basta y evita el "halo de neón"
  (caso borde de la spec).
- **Alternatives considered**: `filter: drop-shadow` (más caro de pintar y no combina con el borde);
  borde con degradado animado (requiere pseudo-elementos y máscaras; demasiado para el beneficio).
- **Nota de cascada**: `var(--primary)` dentro de una propiedad personalizada se resuelve donde se
  declara. Como el bloque forzado oscuro (`[data-theme="dark"]`, CTA final) redeclara todos los
  tokens, el brillo correcto también aplica ahí.

## R4. Íconos y flechas (FR-009 a FR-011)

- **Decision**: `.card-icon` agrega `rotate: -6deg` al `scale` existente. Se crea `.card-arrow` para
  el `svg` de la flecha de Atajos: con la tarjeta resaltada se desplaza `3px` a la derecha. En las
  tarjetas que tienen flecha, el contenedor no gira (`.card-icon:has(.card-arrow)`), porque una
  flecha inclinada apunta a otro lado.
- **Rationale**: Atajos es la única tarjeta-enlace con indicador. El índice de guías de Ayuda usa un
  número: según FR-010 no se agrega una flecha; el número recibe el tratamiento normal de ícono.
- **Alternatives considered**: agregar una flecha a las guías de Ayuda (rechazado: FR-010 y no hay
  necesidad).

## R5. Respuesta al presionar en pantallas táctiles (FR-013a)

- **Decision**: dentro de `@media (hover: none)`, `.card-hover:active` y `.phone-hover:active`
  aplican `scale: 0.98` y borde primario (el ítem sin caja también muestra su fondo), con una
  transición de 120 ms. Con movimiento reducido solo cambia el borde. Las tarjetas-enlace agregan
  `-webkit-tap-highlight-color: transparent` para que no se superponga el gris del sistema.
- **Rationale**: `:active` se quita solo al soltar, al cancelarse el toque o cuando el navegador
  detecta un scroll, que es exactamente lo que pide la spec, sin JavaScript. En iOS Safari `:active`
  solo funciona si hay un listener de `touchstart` en la cadena de ancestros: React registra sus
  listeners (incluido `touchstart`) en la raíz de la app, que en este sitio es el documento. Se
  verifica en un iPhone real (quickstart, paso 6).
- **Alternatives considered**: manejar `pointerdown`/`pointerup` en un componente cliente (rechazado:
  convertiría tarjetas en Client Components sin necesidad, Principio VI); `@media (pointer: coarse)`
  (descartado: una laptop táctil con mouse quedaría sin hover; `hover: none` es el complemento exacto
  de la regla de hover existente).
- **Riesgo**: si en iOS `:active` no se activa, el fallback es `ontouchstart=""` en el `<body>` del
  layout raíz (sin JavaScript propio). Se decide en la implementación después de probarlo.

## R6. Hover de capturas (FR-019 a FR-023)

- **Decision**: `PhoneFrame` recibe la clase `.phone-hover` en su `div` exterior (escala del
  teléfono completo, FR-021) y `.phone-bezel` en el bisel. Se quitan `shadow-phone ring-1 ring-line`
  del bisel y `.phone-bezel` declara en reposo
  `box-shadow: 0 0 0 1px var(--border), var(--elev-phone)` (mismo resultado visual que hoy). En
  hover: `0 0 0 2px var(--primary), var(--elev-phone-float)` y `scale: 1.04` en el exterior.
- **Rationale**: un solo `box-shadow` con el anillo y la sombra transiciona como una sola propiedad
  y evita pelear con las variables internas de `ring`/`shadow` de Tailwind 4. El anillo como sombra
  no ocupa espacio: no hay saltos de layout (FR-021). El borde primario sobre el fondo de la página
  cumple ≥ 3:1 (mismo par que el borde de las tarjetas, ya medido en la 004).
- **Hero**: el carrusel ya pausa con el mouse encima (`onPointerEnter`), así que el zoom se ve sobre
  una pantalla fija. Para el teclado (FR-023), `[data-carousel]:has(:focus-visible) .phone-hover`
  aplica el mismo resaltado. Como los controles están fuera del teléfono, el zoom no mueve su área de
  clic.
- **Funcionalidades y guías**: el hover se dispara solo sobre el teléfono (FR-022), porque la clase
  está en `PhoneFrame` y no en la fila.
- **Alternatives considered**: escalar solo la imagen interna (rechazado por FR-021); `outline`
  para el borde (no sigue el radio en todos los navegadores objetivo con la misma suavidad y no
  transiciona junto con la sombra).

## R7. Nuevas tarjetas del inventario

- **Decision**: paneles "Problemas" y "Cómo te ayuda" de `BusinessList` → `card-hover
  [--card-lift:-4px]` (ya tienen borde de 1 px). Panel de `PartnerPanel` → `card-hover
  [--card-lift:-4px]`; su borde `border-accent/40` pasa a primario al resaltarse, igual que el ícono
  de Problemas en la 004 (un solo lenguaje de resaltado).
- **Rationale**: no tienen ícono principal (los checks y alertas son secundarios, FR-011): solo
  reciben el resaltado de tarjeta.
- **Foco**: el panel de partner contiene el botón de WhatsApp: `:has(:focus-visible)` lo resalta con
  teclado. Los paneles de rubro no tienen interactivos: solo hover (FR-012).

## R8. Rendimiento (SC-008, SC-009)

- **Decision**: solo se animan `translate`, `scale`, `rotate`, `box-shadow`, `border-color`,
  `background-color` y `color`, como hoy. No se agrega `will-change` permanente.
- **Rationale**: `box-shadow` pinta, pero en tarjetas de este tamaño y a 300 ms no pierde cuadros
  en equipos de gama media; `will-change` permanente en ~30 tarjetas crearía capas de composición
  innecesarias y subiría la memoria en el celular. Sin JavaScript nuevo: el puntaje de Lighthouse no
  debería moverse.
