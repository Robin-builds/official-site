# Quickstart: validar la spec 007

## Requisitos

- `npm run dev` (http://localhost:3000) para revisar; `npm run build` y `npm run lint` limpios al final.
- Escritorio con mouse, un celular Android y, si es posible, un iPhone.
- DevTools: emulación de `prefers-reduced-motion`, `prefers-color-scheme` y `forced-colors`.

## 1. Cobertura de tarjetas (SC-001, SC-002)

En `/`, `/ayuda`, `/para-tu-negocio`, `/se-partner` y sus equivalentes en `/en/...`, en tema claro y
oscuro, pasar el mouse por cada tarjeta del [inventario](data-model.md):

- Sube ~5 px (paneles ~4 px), borde primario, sombra más profunda con brillo del color de marca.
- Ícono: crece, gira levemente y se llena de primario. En Atajos la flecha avanza y no gira.
- En DevTools > Elements > Computed: `transition-duration: 0.3s` en todas.

## 2. Suavidad e interrupción (FR-007, SC-008)

Pasar el mouse rápido por una fila de Atajos y por las tarjetas de Problemas: sin saltos ni
parpadeos. Performance panel: grabar el recorrido y confirmar que no hay cuadros largos.

## 3. Capturas (SC-010, SC-011)

- `/` hero, `/funcionalidades` y una guía en `/ayuda/...`: al pasar sobre el teléfono, zoom ~4%,
  anillo primario y sombra flotante; el texto de la fila no reacciona.
- Hero: el carrusel se pausa con el mouse encima y vuelve a avanzar al salir; con Tab sobre los
  controles el teléfono se resalta; los botones e indicadores funcionan igual.

## 4. Teclado (FR-012)

Tab por Atajos, guías de Ayuda y el panel de Sé partner: la tarjeta que contiene el foco se
resalta igual que con el mouse. Las tarjetas sin interactivos no reciben foco.

## 5. Movimiento reducido y alto contraste (SC-006)

Con `prefers-reduced-motion: reduce`: nada se mueve, escala ni gira; colores, borde y sombra sí.
Con `forced-colors: active`: textos y bordes legibles; las cajas invisibles siguen invisibles.

## 6. Táctil (SC-007)

En Android y iPhone: mantener el dedo sobre una tarjeta → se hunde y el borde se pone primario;
soltar → vuelve. Empezar un scroll sobre una tarjeta → no queda hundida. Tocar un Atajo → navega
con un toque. Si en iPhone no hay hundimiento, aplicar el fallback de [research.md](research.md) R5.

## 7. Layout y contraste (SC-004, SC-005)

- Lighthouse / Performance panel: CLS 0 recorriendo las tarjetas.
- A 360 px: sin scroll horizontal.
- Contraste ≥ 3:1 del borde primario contra el fondo de cada sección y del ícono resaltado, en
  ambos temas.

## 8. Cierre (SC-009)

`npm run build` y `npm run lint` sin errores; Lighthouse móvil en `/`, `/funcionalidades` y
`/para-tu-negocio`: Performance ≥ 90, Accessibility ≥ 95.
