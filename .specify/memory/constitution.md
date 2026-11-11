<!--
Sync Impact Report
- Versión: 2.0.0 → 3.0.0 (MAJOR: se redefine el Principio VII; el sitio pasa a ser bilingüe)
- Principios modificados:
  - VII. "Español de Chile, sin jerga" → "Español de Chile e inglés, sin jerga": español como
    idioma principal y fuente de verdad; inglés como traducción equivalente revisada por el owner
  - I. Veracidad: + la versión en inglés no puede afirmar nada que la española no afirme
  - III. Contenido separado: + cada texto existe en ambos idiomas en el mismo módulo
- Restricciones técnicas: + `lang` y hreflang por idioma; + `experimental.globalNotFound`
  permitido solo para la 404 global
- Impacto en specs existentes: 005-official-site se amplía con el sitio en inglés (US8, FR-025+).
- TODOs: ninguno

Sync Impact Report anterior
- Versión: 1.1.0 → 2.0.0 (MAJOR: se redefinen los Principios II y III, que pasan de "la página"
  a "cada página" de un sitio multipágina; cambia el alcance de toda la constitución)
- Título: "StoreFlow Landing Constitution" → "StoreFlow Sitio Oficial Constitution"
- Principios modificados:
  - I. Veracidad del contenido: + fuente de referencia (guía rápida del owner), + exclusiones
    explícitas ("quién hizo cada movimiento", escritura desde el panel web), + regla para guías
  - II. Una conversión principal → II. Una conversión principal por página (+ excepción Contadores)
  - III. Contenido separado de la presentación: contenido en varios archivos de `src/content/`;
    URLs siguen en una sola constante
  - IV. Simplicidad: "la página" → "el sitio"; sin CMS, buscador con backend ni cuentas
  - V. Mobile-first y accesible: + menú de navegación operable con teclado; aplica a cada página
  - VI. Performance como requisito: metas por página
  - VII. Español de Chile, sin jerga: + regla para términos que aparecen en pantalla en la app
- Secciones añadidas: ninguna (se amplían "Restricciones técnicas" y "Flujo de desarrollo")
- Secciones eliminadas: ninguna
- Impacto en specs existentes:
  - 001–004 (heredadas de la landing): siguen válidas como base; sus reglas "de la página" se leen
    como "de Inicio".
  - 005-official-site: FR-005 y Assumptions actualizados: el sitio vive en un proyecto propio
    (este clon), repo `Robin-builds/official-site`, Vercel `storeflow-official-site`.
- Plantillas: no requieren cambios (leen la constitución en tiempo de ejecución).
- TODOs: ninguno
-->

# StoreFlow Sitio Oficial Constitution

## Core Principles

### I. Veracidad del contenido (NON-NEGOTIABLE)
- Todo lo que el sitio afirma MUST existir hoy en la app publicada en Google Play.
- La guía rápida del owner (`specs/005-official-site/fuentes/guia-rapida.md`) es fuente de
  referencia de funcionalidades. Una afirmación que no esté en la guía MUST verificarse contra la
  app publicada antes de publicarse. Si la guía y la app difieren, manda la app.
- MUST NOT incluir métricas de tracción, testimonios, logos de clientes, sellos de prensa ni precios
  que no sean reales y verificables.
- La sección de testimonios MUST renderizarse solo si el array `testimonios` contiene datos reales.
- Funcionalidades fuera de alcance (órdenes de compra, facturación/boletas/DTE/SII, iPhone, alertas
  por WhatsApp, importación desde Excel, integraciones, precios con montos) MUST NOT mencionarse ni
  insinuarse. Si una FAQ las toca, la respuesta MUST decir con honestidad que hoy no están disponibles.
- MUST NOT afirmarse que la app muestra quién hizo cada movimiento mientras la app no lo muestre.
- El panel web es de solo lectura: MUST NOT insinuarse que desde la web se registran movimientos,
  se crean productos o se gestionan usuarios o bodegas.
- Las guías de uso MUST describir pasos que existen hoy en la app, en el orden en que la app los pide.
- La versión en inglés MUST NOT afirmar nada que la versión en español no afirme. Si la app no
  está disponible en inglés, el sitio en inglés MUST decirlo.

**Justificación:** el canal de crecimiento son los contadores, cuya confianza es el activo principal.
Una afirmación falsa en el sitio invalida toda la estrategia de canal.

### II. Una conversión principal por página
- Cada página MUST tener un solo objetivo primario: instalar la app desde Google Play ("Pruébala gratis").
- Excepción: la página de Contadores tiene como objetivo primario el contacto por WhatsApp.
- Las CTA secundarias (por ejemplo "Ver cómo funciona", "Ver la guía") MUST ser visualmente
  subordinadas a la principal de esa página.
- Los enlaces del menú de navegación y del pie no cuentan como CTA y MUST NOT competir visualmente
  con la CTA principal.
- Accesos utilitarios para usuarios existentes (Ingresar) no cuentan como conversión y MUST ser
  visualmente secundarios.
- Todas las URLs de destino externas MUST vivir en una sola constante en `src/content/`; ningún
  componente MUST tener URLs externas hardcodeadas.

**Justificación:** cada página puede ser la puerta de entrada (se comparten por separado); el destino
cambia (prueba cerrada → producción) y no debe requerir buscar enlaces en el código.

### III. Contenido separado de la presentación
- Todo el copy, listas, FAQs, guías y URLs MUST vivir en `src/content/`. Se permite un archivo por
  página o tema; lo compartido (marca, navegación, pie, URLs) MUST vivir en un solo archivo común.
- Cada texto MUST existir en español e inglés en el mismo módulo, con un tipo que haga fallar el
  build si falta una traducción.
- Los componentes MUST recibir contenido por import o props; MUST NOT contener strings de copy visibles.
- Los tokens de diseño (colores, tipografía, radios, sombras, espaciado de secciones) MUST definirse
  en un solo lugar y ser compartidos por todas las páginas.
- Los tokens de marca se derivan del tema de la app Android (`ui/theme/`). Un cambio de paleta en la
  app MUST reflejarse en el sitio.

**Justificación:** el sitio se itera visualmente y en texto; cambiar una frase o un color no debe
implicar tocar JSX, y repartir el contenido por página evita un archivo inmanejable.

### IV. Simplicidad
- El sitio MUST ser 100% estático: sin backend, sin Supabase, sin cuentas, sin CMS, sin buscador con
  servidor y sin formularios que envíen datos.
- MUST NOT agregarse dependencias (UI kits, librerías de animación, iconos, analytics, MDX) sin
  aprobación explícita del owner, justificada en una línea.
- Componentes base (Button, Section, Container) solo se crean si se reutilizan en 2+ lugares.
- MUST NOT crearse abstracciones, parámetros ni capas que ningún requisito pida.
- Una página sin contenido real MUST NOT publicarse ni aparecer en la navegación.

**Justificación:** es el sitio de un producto en etapa temprana; la complejidad no se paga sola.

### V. Mobile-first y accesible
- Cada página MUST partir de 360px y escalar a 768px y 1440px, sin scroll horizontal en ninguno.
- Textos y botones MUST cumplir contraste WCAG AA en tema claro y oscuro; el foco MUST ser visible;
  los elementos interactivos (FAQ, menú de navegación, menú móvil) MUST operar con teclado.
- La navegación MUST indicar la página actual y MUST funcionar sin JavaScript.
- Las animaciones MUST respetar `prefers-reduced-motion`.

**Justificación:** el público usa la app en el celular; el sitio lo ven en el mismo dispositivo.

### VI. Performance como requisito
- Cada página MUST alcanzar en Lighthouse móvil Performance ≥ 90, Accessibility ≥ 95 y SEO ≥ 95.
- Las imágenes MUST servirse con `next/image` y las fuentes con `next/font`.
- `"use client"` MUST usarse solo en componentes con interacción real.
- `npm run build` sin errores es condición necesaria, NO suficiente, para dar algo por terminado.

**Justificación:** un sitio lento en 4G pierde la conversión antes de que se lea el titular.

### VII. Español de Chile e inglés, sin jerga
- El sitio existe en dos idiomas. El español de Chile es el idioma principal y la fuente de verdad:
  todo texto se escribe primero en español y el inglés es su traducción equivalente.
- El copy en español MUST usar tuteo; MUST NOT usar voseo ni modismos rioplatenses.
- El copy en inglés MUST ser inglés claro y directo, de segunda persona ("you"), sin regionalismos
  marcados. Ningún texto en inglés se publica sin revisión del owner.
- El copy visible MUST NOT usar jerga técnica ("offline-first", "sync", "SaaS", "cloud",
  "multi-tenant", "dashboard"); se traduce a beneficio ("funciona sin internet", "tus datos se
  guardan solos", "panel web").
- Excepción: en las guías, los nombres de botones, tarjetas y tipos que aparecen en pantalla en la
  app (por ejemplo ENTRADA, SALIDA, AJUSTE, "Configurar productos") MUST citarse tal como aparecen.
  En inglés se citan igual, tal como aparecen en la app, seguidos de su traducción la primera vez
  (por ejemplo: ENTRADA (stock in)).
- Se evitan clichés vacíos en ambos idiomas ("revoluciona", "siguiente nivel", "solución
  integral", "game-changer", "next level", "all-in-one solution").

**Justificación:** el lector es un dueño de minimarket o un contador, no un desarrollador; y una guía
que nombra distinto lo que ve en pantalla lo confunde.

## Restricciones técnicas

- Stack: Next.js (App Router) + TypeScript (strict) + Tailwind CSS, deploy en Vercel.
- Proyecto propio, creado como clon de la landing (`Landing-pages-storeflow`, remoto `plantilla`).
  MUST NOT desplegarse sobre el proyecto de Vercel de la landing ni empujarse cambios al repo de la
  landing. Repo propio: GitHub `Robin-builds/official-site` (remoto `origin`); proyecto Vercel
  `storeflow-official-site`. Independiente también del dashboard `stockflow-web`; no comparten código ni dependencias.
- Server Components por defecto; cada página se genera de forma estática.
- Antes de usar una API de Next.js o Tailwind, su firma y sintaxis MUST verificarse contra la versión
  instalada (Context7 o docs oficiales). MUST NOT asumirse Tailwind v3 vs v4.
- Metadata obligatoria por página e idioma: title, description, Open Graph propios, `lang`
  correcto (`es-CL` o `en`) y enlaces hreflang a la versión en el otro idioma; el sitio MUST
  publicar mapa del sitio con ambos idiomas.
- Se permite el flag `experimental.globalNotFound` de Next.js solo para la página 404 global
  (requerido por tener un layout raíz por idioma). Cualquier otro flag experimental requiere
  aprobación del owner.
- Los screenshots del producto MUST ser capturas reales de la versión publicada, en `/public/screens/`.
  MUST NOT dibujarse UI ficticia de la app.
- Comentarios inline en todo bloque no obvio, explicando qué hace y por qué.

## Flujo de desarrollo

- Spec-Driven Development con speckit: `specify` → `plan` → `tasks` → `implement`. Ningún cambio de
  alcance entra sin pasar por un spec.
- Cada sesión de implementación tiene un alcance atómico (una página o una responsabilidad) con
  criterios de salida explícitos.
- El agente MUST pedir confirmación antes de ejecutar comandos que instalen o scaffoldeen
  (`create-next-app`, `npm install`, `npx ...`).
- Commits en Conventional Commits (`feat:`, `fix:`, `style:`, `content:`, `docs:`); una rama por
  spec, merge a `main` cuando cumple sus criterios de aceptación.
- Criterios de aceptación de cada spec: build limpio + Principios V y VI verificados en cada página
  afectada + revisión del copy contra el Principio I.

## Gobernanza

- Esta constitución prevalece sobre cualquier spec, plan o instrucción de sesión. Un plan que la
  viole MUST declararlo en su Constitution Check y justificarlo, o rechazarse.
- Cuando se mergea una funcionalidad nueva en la app Android o cambia la guía del owner, la lista de
  funcionalidades permitidas/excluidas del Principio I MUST actualizarse antes de reflejarla en el copy.
- Las enmiendas requieren: cambio documentado, actualización del Sync Impact Report y bump de versión:
  - MAJOR: se elimina o redefine un principio.
  - MINOR: se agrega un principio o sección, o se amplía materialmente una regla.
  - PATCH: aclaraciones de redacción sin cambio de significado.

**Version**: 3.0.0 | **Ratified**: 2026-11-07 | **Last Amended**: 2026-11-10
