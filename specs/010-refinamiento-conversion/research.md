# Research: Refinamiento de conversión del sitio oficial

**Feature**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md) · **Fecha**: 2026-11-17

Cada decisión parte del código actual (rama `010-refinamiento-conversion`, base `main` 9c42ba2).

---

## R1. Qué destinos van en el encabezado

**Decisión**: el encabezado se arma con el mismo registro de páginas (`src/content/site.ts`) y su
bandera `inNav`. Se pasa a `inNav: false` en `faq`, `help` y `contact`. Quedan con `inNav: true`
solo `features`, `business` y `plans`, en ese orden (ya es el orden del registro).

**Rationale**: `Navbar` ya filtra con `navItems(locale, (p) => p.inNav)`, y el pie usa
`navItems(locale, (p) => p.key !== "contact")` más una columna propia para Contacto. Por eso el
pie no depende de `inNav` y conserva todos los destinos sin cambios (FR-007). El cambio es solo de
contenido (Principio III).

**Alternativas**: una lista fija de 3 claves en `Navbar` (rechazada: duplica el registro y rompe
el Principio III); una bandera nueva `inHeader` (rechazada: `inNav` ya significa exactamente eso).

## R2. Corte de escritorio: 1280px → 1024px

**Decisión**: en `Navbar.tsx`, las clases `xl:` del menú de escritorio, del grupo
Ingresar/idioma y del contenedor del menú móvil pasan a `lg:` (Tailwind 4: `lg` = 64rem = 1024px,
breakpoint por defecto; no hay breakpoints propios en `globals.css`). Se actualizan los
comentarios de `Navbar` y `MobileMenu`, que todavía dicen "1280" y "1024".

**Rationale**: a 1024px el `Container` deja 960px útiles (`lg:px-8`). Logo (~140) + 3 enlaces
(~330) + Ingresar (~90) + "Pruébala gratis" (~150) + espacios (~40) ≈ 750px: cabe con margen. SC-001
mide a 1024px y SC-003 a 1023px, justo en el borde.

**Alternativas**: 768px (rechazada en la clarificación: ~730px de contenido en ~720px útiles);
mantener 1280 (rechazada en la clarificación).

## R3. Selector de tema fuera del encabezado

**Decisión**: se quita `<ThemeToggle>` del grupo de escritorio y del panel del menú móvil. El pie
ya lo tiene, con su etiqueta (`Footer.tsx`), y no se toca. El selector ES/EN se queda donde está
(supuesto A-2; hoy no se renderiza porque `languages.en.published = false`). En el panel móvil, la
fila inferior queda solo con el selector de idioma cuando exista.

**Rationale**: FR-003. Tema guardado en `localStorage` (`storeflow-theme`): quitar el botón del
encabezado no cambia la preferencia de nadie.

## R4. Color del botón primario en el bloque de cierre

**Problema**: `FinalCta` pone `data-theme="dark"` en su bloque. `globals.css` declara los tokens
oscuros en `:root, [data-theme="dark"]`, así que dentro del bloque `--primary` = `#2ec6da` aunque
la página esté en claro (`#155e75`).

**Decisión**: capturar el primario de la página en el elemento raíz y re-inyectarlo solo alrededor
del botón:

1. En `globals.css`, una regla **separada** `:root { --page-primary: var(--primary);
   --page-primary-hover: var(--primary-hover); --page-on-primary: var(--on-primary); }`. Una
   propiedad personalizada guarda su valor ya resuelto en el elemento donde se declara (`<html>`),
   y los descendientes heredan ese color, no la referencia. Tiene que ser una regla aparte: si fuera
   dentro de `:root, [data-theme="dark"]`, también se aplicaría al bloque y capturaría el cian.
2. Una clase `.page-primary` que reasigna `--primary`, `--primary-hover` y `--on-primary` a esos
   valores capturados. Se pone en el `div` que envuelve el botón de `FinalCta`.
3. Dentro de `.page-primary`, el contorno de foco usa `var(--text-1)` en vez de `--primary`. En
   tema claro, el teal `#155e75` sobre la tinta `#0D1519` da ~2.5:1 y no llega a los 3:1 que pide
   un indicador de foco. El texto claro del bloque supera 15:1.

**Contraste resultante**:
- Tema claro: botón `#155e75` con texto `#ffffff` = 7.4:1 (AA).
- Tema oscuro: los valores capturados son iguales a los del bloque; no cambia nada.
- Sin JavaScript (sin `data-theme` en `<html>`): la regla `@media (prefers-color-scheme: light)
  :root:not([data-theme])` resuelve el primario claro en `<html>` y la captura lo hereda.

**Alternativas**:
- Quitar `data-theme="dark"` del bloque. Rechazada: el título y el texto del bloque perderían el
  contraste sobre la tinta en tema claro (spec 008).
- Escribir el color a mano en el botón. Rechazada: dos fuentes de verdad para el primario
  (Principio III).
- Una variante nueva de `Button`. Rechazada: es una capa que ningún requisito pide (Principio IV).

## R5. Pie del carrusel del hero

**Decisión**: en `ScreensCarousel.tsx` se elimina el `<p>` visible con el número y la descripción
("Leyenda fuera de la pantalla"). Se mantienen sin cambios:
- la región `aria-live="polite"` con `copy.announce`, que ya incluye `{caption}`;
- las etiquetas `copy.goTo` de cada punto, que ya incluyen la descripción;
- la prop `captions`, que alimenta ambas.

Se borran también la regla `.carousel-caption-in` y su `@keyframes` de `globals.css`, que quedan
sin uso. Los controles (pausa y puntos) suben, porque el espacio fijo de 2 líneas (`h-14 mt-4`)
desaparece: el hero gana ~72px de alto.

**Rationale**: FR-011 y la clarificación Q2. El contenido (`captions` en `src/content/inicio.ts`)
no cambia (supuesto A-4).

## R6. Hero: hueco superior y primer viewport

**Hallazgo**: el `Container` del hero usa `grid items-center` con `lg:pt-16 lg:pb-24`. A 1024px o
más, la columna del teléfono (~300px × 19.5/9 ≈ 670px, más pie y controles ≈ 780px) es más alta que
la de texto (~500px). El texto queda centrado y arranca ~140px más abajo que el borde superior del
hero, a lo que se suman 64px de padding. Ese es el "hueco superior".

**Decisión**:
1. R5 ya baja la columna del teléfono a ~710px.
2. El padding superior del hero pasa a un valor igual o menor que la separación estándar
   (`pt-8 sm:pt-12 lg:pt-12`), y el texto se alinea arriba en escritorio (`lg:items-start`). El
   teléfono se baja `lg:mt-4` para equilibrar los bordes superiores.
3. Los valores finales se ajustan midiendo con SC-007 y SC-011 a 390×844, 1024×768 y 1440×900
   (tarea de implementación). Esta investigación fija el criterio, no el píxel.

**Rationale**: SC-011 pide que la distancia entre el encabezado y el primer elemento del hero sea
≤ `--spacing-section` (64px a 360px, ~112px a 1440px). Con texto centrado esa distancia depende del
alto del teléfono y se rompe con facilidad. Alineado arriba, depende solo del padding.

**Alternativas**: achicar el teléfono (rechazada: las capturas pierden legibilidad); hero de alto
fijo `100svh` (rechazada: en celular empuja el contenido y no aporta a SC-007).

## R7. Ritmo vertical entre secciones (cómo se mide SC-008)

**Composición de Inicio**: Hero → Credibilidad (franja `surface-2`, `py-8 sm:py-12`) → Problemas
(`canvas`) → Beneficios (`surface`) → Cómo funciona (`canvas`) → Accesos (`surface`) → [Testimonios
oculto] → Cierre (`canvas`, `py-section` más el bloque oscuro) → pie.

**Definición operativa de "separación"**: para cada par de secciones contiguas posteriores a
Credibilidad, la distancia vertical entre el borde inferior del contenido de una (último hijo del
`Container`) y el borde superior del contenido de la siguiente. Para el cierre, el contenido es el
bloque oscuro. SC-008 exige que todas esas distancias sean iguales (tolerancia 1px por redondeo
subpixel) a 360px y a 1440px.

**Hallazgos**:
- Las secciones que usan `Section` aportan `py-section` arriba y abajo, así que la distancia
  entre contenidos es 2 × `--spacing-section`. Es consistente, y el cambio de fondo lo hace legible.
- **Cierre**: `bg-canvas py-section` alrededor del bloque oscuro. Con Testimonios oculto, entre
  Accesos (`surface`) y el cierre la separación es la misma 2 × sección; pero bajo el bloque oscuro
  quedan otros `--spacing-section` de canvas vacío (hasta 112px) antes del pie. Esa es la franja
  que se lee como "fin de página".
- **Credibilidad** es una franja angosta pegada al hero, no una sección de contenido. Se excluye
  de la medición (está antes del primer par medido) y no se cambia.

**Decisión**:
- El cierre conserva `pt-section` y su padding inferior pasa a la mitad (`pb-[calc(var(--spacing-section)/2)]`
  o una utilidad equivalente). El bloque queda más cerca del pie sin pegarse.
- Si al medir aparece otro par distinto, se corrige con el token `py-section` y nunca con un
  número suelto (Principio III).

**Alternativas**: un token nuevo de separación (rechazada: `--spacing-section` ya existe y es único).

## R8. Herramienta de verificación: Playwright + axe-core

**Decisión** (aprobada por el owner el 2026-11-17, ver plan "Constitution Check"):
devDependencies `@playwright/test` y `@axe-core/playwright`, solo Chromium. Suite en `tests/e2e/`
y configuración `playwright.config.ts` en la raíz. El `webServer` corre `npm run build && npm run start`
en un puerto propio (3100), para medir el sitio de producción y no el de desarrollo. Script
`npm run test:e2e`.

**Justificación en una línea (Principio IV)**: los criterios de la spec son geométricos y de
estilos computados en 4 anchos y 2 temas; sin un navegador automatizado no se pueden repetir en
cada cambio.

**Cómo se fija el tema en las pruebas**: `page.addInitScript` escribe `storeflow-theme` en
`localStorage` antes de cargar. El script inline del `<head>` lo lee y pone `data-theme` en
`<html>`. Se cubren `light` y `dark`.

**Cómo se mide cada criterio**: ver [contracts/verification.md](./contracts/verification.md).

**A verificar al instalar**: versión actual de `@playwright/test` y `@axe-core/playwright` y su API
(`AxeBuilder.include()`, `withRules(["color-contrast"])`), con Context7 o la documentación oficial
(Restricciones técnicas). La instalación (`npm install -D` y `npx playwright install chromium`)
requiere confirmación del owner en la sesión (Flujo de desarrollo).

**Alternativas**: un script de consola sin dependencias más Lighthouse (rechazado por el owner:
menos repetible); Cypress (más pesado y sin integración oficial de axe equivalente).

## R9. Cierre del menú al pasar a escritorio

**Decisión**: no se agrega lógica. El contenedor del menú móvil lleva `lg:hidden`, así que a
≥ 1024px el `<details>` y su panel no se muestran aunque `open` siga activo. Al volver a < 1024px
puede reaparecer abierto. Es aceptable: es el mismo comportamiento de hoy con 1280px, y el caso borde
de la spec solo pide que el panel no quede encima del encabezado de escritorio.
