# Quickstart: validar 008-tema-claro-contraste

## Prerrequisitos

- Rama `008-tema-claro-contraste`, dependencias ya instaladas.
- `npm run dev` corriendo; navegador con DevTools.

## 1. Build

```powershell
npm run build
```

Esperado: sin errores ni warnings nuevos.

## 2. Contraste de tokens

Ejecutar el verificador de contraste de la feature (lo crea la tarea correspondiente en
`specs/008-tema-claro-contraste/contrast-check.mjs`, sin dependencias) contra los valores de
`src/app/globals.css`:

```powershell
node specs/008-tema-claro-contraste/contrast-check.mjs
```

Esperado: todos los pares de [contracts/theme-tokens.md](contracts/theme-tokens.md) en PASS y
"bloques claros idénticos: OK" (FR-011), incluidas las secciones vecinas reales (contraste ≥ 1.08 o ΔE ≥ 10, SC-002).

## 3. Tema claro a mano (selector de tema → claro)

Recorrer en es y en: Inicio, Funcionalidades, Ayuda (índice y una guía), Sé partner, Descargar,
Contacto, Privacidad y una URL inexistente (404), a 360, 768 y 1440 px.

- Página gris; secciones blancas alternas se distinguen (US1).
- Tarjetas con borde naranjo claro en reposo; las de Atajos/Ayuda/FAQ/listas por rubro con fondo durazno; banda de Credibilidad durazno distinta del Hero y de Problemas (US1, US2).
- Hover y Tab sobre una tarjeta: borde naranjo oscuro + brillo cálido; anillo de foco sigue cian (US2).
- Hover sobre una captura de la app: anillo naranjo oscuro (FR-006).
- Hover en un chip del índice de Funcionalidades: borde naranjo oscuro (FR-008).
- Error en un campo de Contacto: borde y texto rojos (edge case).
- "Pruébala gratis" sigue cian y es lo más llamativo (FR-010).
- QR de Contacto sobre blanco.

## 4. Tema claro del sistema sin JavaScript

DevTools → deshabilitar JavaScript, emular `prefers-color-scheme: light`, recargar Inicio y Contacto.
Esperado: idéntico al paso 3 (FR-011).

## 5. Tema oscuro sin regresiones

Tomar capturas de Inicio, Funcionalidades y Contacto en oscuro en `main` y en la rama; comparar.
Esperado: sin diferencias, incluido el CTA final (SC-005, FR-009).

## 6. Movimiento reducido y táctil

- Emular `prefers-reduced-motion: reduce`: el color del borde cambia, sin desplazamiento.
- Emular dispositivo táctil: al presionar una tarjeta, borde naranjo oscuro; al soltar no queda pegado.

## 7. Lighthouse

Lighthouse móvil en tema claro sobre todas las páginas en español (Inicio, Funcionalidades, Para tu
negocio, Ayuda, una guía, Sé partner, Descargar, Contacto, Privacidad) y sobre Inicio,
Funcionalidades y Contacto en inglés.
Esperado en cada una: Accessibility ≥ 95, Performance ≥ 90, SEO ≥ 95 (SC-004, Principio VI).
