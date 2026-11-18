# Contrato UI: encabezado, pie, hero y cierre

Reemplaza la sección "Encabezado" de `specs/005-official-site/contracts/routes.md` para todas las
páginas e idiomas.

## Encabezado

### ≥ 1024px (escritorio)

En una sola línea, de izquierda a derecha:

| # | Elemento | Notas |
|---|---|---|
| 1 | Logo | Enlace a Inicio del idioma, `aria-label` "Inicio" |
| 2 | `<nav aria-label="Navegación principal">` | Exactamente 3 enlaces: Funcionalidades, Para tu negocio, Planes. La página actual con `aria-current="page"` y subrayado primario |
| 3 | Ingresar | Variante `ghost`: texto de enlace, sin fondo ni borde |
| 4 | ES/EN | Solo si `languages.en.published` |
| 5 | Pruébala gratis | Variante `primary`, `size="sm"`, va a Google Play |

**No contiene**: selector de tema, Preguntas frecuentes, Ayuda, Contacto.

### < 1024px (celular y tablet)

| # | Elemento | Notas |
|---|---|---|
| 1 | Logo | Igual |
| 2 | Pruébala gratis | Siempre visible, fuera del menú |
| 3 | Botón de menú (`<summary>`) | `<details>` nativo: funciona sin JS; Escape y tocar fuera lo cierran |

**Panel del menú** (orden): los 3 enlaces de sección → separador → Pruébala gratis (`md`) →
Ingresar (`ghost`) → ES/EN (si está publicado). **No contiene** el selector de tema.

## Pie

Sin cambios de estructura. Columna "Sitio": todas las páginas publicadas salvo Contacto. Columna
"Contacto y cuenta": Contacto, Ingresar a la versión web y Política de privacidad (externa
mientras no haya página propia). Selector de tema con su etiqueta bajo el logo.

## Hero (Inicio)

- Columna de texto alineada arriba en ≥ 1024px. Distancia entre el borde inferior del encabezado y
  el primer elemento del hero ≤ `--spacing-section`.
- Carrusel: teléfono, controles (pausa y puntos) y región `aria-live`. **Sin texto visible** bajo
  el teléfono.
- < 1024px: una columna, el texto primero y el teléfono después.

## Bloque de cierre (`FinalCta`, todas las páginas que lo usan)

- El bloque sigue con fondo de tinta y `data-theme="dark"` (título y texto claros en ambos temas).
- El botón va envuelto en `.page-primary`, así que su color es el primario del tema de la página:
  teal `#155e75` en claro y cian `#2ec6da` en oscuro.
- Foco visible del botón dentro del bloque: contorno `--text-1` (claro sobre la tinta).
- Separación: `pt-section` arriba; abajo la mitad de la separación estándar antes del pie.
