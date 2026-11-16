<!--
Sync Impact Report
- Versión: 4.0.0 → 5.0.0 (MAJOR: se redefinen los Principios I, II y IV para la página "Planes",
  spec 009-planes-pricing, sesión 2026-11-16)
- Principios modificados:
  - I. Veracidad del contenido: excepción para la página Planes, que puede mostrar montos
    referenciales con el aviso "Precios referenciales, pueden cambiar"; las funciones que hoy no
    existen en la app se muestran como "Próximamente". Fuera de Planes siguen prohibidos los montos.
  - II. Una conversión principal por página: nueva excepción "Planes" (conversión principal = botón
    del plan recomendado, que abre el formulario de intención). Se corrige el encabezado de
    excepciones, que aún decía "contacto por WhatsApp" aunque Contacto ya envía por correo.
  - IV. Simplicidad: segunda ruta de servidor permitida (formulario de intención de planes, envía
    correo y no guarda datos); se aprueba una herramienta de medición liviana, sin datos personales,
    solo para contar clics de los botones de planes.
- Restricciones técnicas: la ruta de planes reutiliza RESEND_API_KEY y CONTACT_TO_EMAIL.
- Secciones añadidas/eliminadas: ninguna
- Plantillas: no requieren cambios (leen la constitución en tiempo de ejecución).
- Impacto en specs existentes: 009-planes-pricing queda habilitada; 006-contacto sin cambios.
  La FAQ "Precio" (src/content/preguntas.ts) puede seguir sin montos y enlazar a Planes.
- TODOs: ninguno

Sync Impact Report anterior
- Versión: 3.1.0 → 4.0.0 (MAJOR: se redefine el Principio IV; el sitio deja de ser 100% estático
  para el formulario de Contacto, sesión 2026-11-15)
- Principios modificados:
  - IV. Simplicidad: excepción única para la ruta `/api/contact`, que envía el formulario de
    Contacto por correo al owner con Resend. Sigue prohibido guardar los datos.
  - II. Una conversión principal por página: en Contacto la CTA principal pasa a ser el envío del
    formulario por correo; el botón directo a WhatsApp y el QR siguen subordinados.
- Restricciones técnicas: + variables de entorno RESEND_API_KEY y CONTACT_TO_EMAIL.
- Impacto en specs existentes: 006-contacto (FR-004, FR-005, FR-010, SC-005) se actualiza.
- TODOs: ninguno

Sync Impact Report anterior
- Versión: 3.0.1 → 3.1.0 (MINOR: se amplía materialmente la excepción del Principio II con la
  página "Contacto", spec 006, sesión 2026-11-15)
- Principios modificados:
  - II. Una conversión principal por página: la excepción pasa de una página ("Sé partner") a
    dos ("Sé partner" y "Contacto"); en Contacto el objetivo primario es el envío del formulario
    que arma el mensaje de WhatsApp, y el botón directo y el QR quedan subordinados.
  - IV. Simplicidad: sin cambio de reglas; se aclara en su justificación que un formulario que
    solo arma un enlace en el navegador no envía datos.
- Secciones añadidas/eliminadas: ninguna
- Impacto en specs existentes: 005 FR-015 se lee con la nueva excepción; 006-contacto FR-010
  queda habilitado.
- TODOs: ninguno

Sync Impact Report anterior
- Versión: 3.0.0 → 3.0.1 (PATCH: la excepción del Principio II pasa de "Contadores" a "Sé partner",
  mismo significado; aclaración de la spec 005, sesión 2026-11-10)

Sync Impact Report anterior
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
  que no sean reales y verificables, salvo la excepción de la página "Planes" descrita abajo.
- Excepción "Planes": solo la página Planes puede mostrar montos referenciales de los planes. MUST
  mostrar, cerca de los precios, el aviso "Precios referenciales, pueden cambiar", y MUST marcar como
  "Próximamente" toda función de un plan que hoy no exista en la app publicada. MUST NOT decir ni
  insinuar que hoy se puede pagar o contratar un plan pago. Ninguna otra página MUST mostrar montos.
- La sección de testimonios MUST renderizarse solo si el array `testimonios` contiene datos reales.
- Funcionalidades fuera de alcance (órdenes de compra, facturación/boletas/DTE/SII, iPhone, alertas
  por WhatsApp, importación desde Excel, integraciones, precios con montos fuera de la página
  Planes) MUST NOT mencionarse ni
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
- Excepciones: estas páginas tienen otro objetivo primario:
  - "Sé partner" (antes Contadores): el contacto por WhatsApp.
  - "Contacto": su CTA principal es el envío del formulario, que manda los datos del visitante
    por correo a StoreFlow. El botón directo a WhatsApp y el código QR MUST ser visualmente
    subordinados a ese envío.
  - "Planes": su CTA principal es el botón del plan recomendado (Standard), que abre el formulario
    de intención. Los botones de los otros planes (incluido "Empezar gratis", que va a Google Play)
    MUST ser visualmente subordinados a ese botón.
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
- El sitio MUST ser estático: sin backend, sin Supabase, sin cuentas, sin CMS, sin buscador con
  servidor y sin formularios que envíen datos.
- Excepciones (solo estas dos rutas de servidor):
  - `/api/contact` recibe el formulario de Contacto y lo envía por correo al owner con Resend.
  - La ruta del formulario de intención de la página Planes recibe plan, periodicidad, precio
    mostrado, correo, idioma y origen, y los envía por correo al owner con Resend.
  - Ambas MUST validar en el servidor y MUST NOT guardar, registrar ni medir los datos (fuera del
    correo mismo). Cualquier otra ruta de servidor requiere una nueva enmienda.
- Medición: se permite una sola herramienta de medición liviana, sin cookies de seguimiento ni datos
  personales, y solo para contar los clics en los botones de la página Planes (plan, periodicidad,
  tipo e idioma). MUST NOT usarse para medir otras páginas o acciones sin una nueva enmienda.
- MUST NOT agregarse dependencias (UI kits, librerías de animación, iconos, analytics, MDX) sin
  aprobación explícita del owner, justificada en una línea. La herramienta de medición de Planes
  queda aprobada por esta constitución; cuál se usa se decide y justifica en el plan de la spec 009.
- Componentes base (Button, Section, Container) solo se crean si se reutilizan en 2+ lugares.
- MUST NOT crearse abstracciones, parámetros ni capas que ningún requisito pida.
- Una página sin contenido real MUST NOT publicarse ni aparecer en la navegación.

**Justificación:** es el sitio de un producto en etapa temprana; la complejidad no se paga sola.
Contacto y Planes son las excepciones porque el owner prefiere recibir esos datos por correo:
rutas sin base de datos que solo reenvían el mensaje. La medición de clics de Planes existe porque
es la señal de disposición a pagar que se quiere validar antes de construir el cobro.

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
- `/api/contact` y la ruta de intención de Planes leen `RESEND_API_KEY` y `CONTACT_TO_EMAIL` de las
  variables de entorno de Vercel; MUST NOT escribirse en el código ni en el repositorio.
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

**Version**: 5.0.0 | **Ratified**: 2026-11-07 | **Last Amended**: 2026-11-16
