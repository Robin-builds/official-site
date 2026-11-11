# StoreFlow · sitio oficial

Sitio estático y bilingüe de StoreFlow (Next.js 16, App Router, Tailwind 4). Español en la raíz
(`/funcionalidades`) e inglés bajo `/en` (`/en/features`). Especificación: `specs/005-official-site/`.

## Comandos

```bash
npm run dev     # desarrollo en http://localhost:3000
npm run build   # typecheck + prerender; todas las rutas deben salir estáticas (○ / ●)
npm run lint
```

## Dónde está cada cosa

- `src/content/`: **todo el texto y las URLs**, cada módulo como `{ es, en }` tipado (si falta una
  traducción, el build falla).
  - `site.ts`: `URLS` (única fuente de enlaces externos), interruptor de idiomas, registro de
    páginas (`pages`, alimenta menú, pie, selector de idioma, sitemap y metadata) y textos comunes.
  - Un módulo por página: `inicio.ts`, `funcionalidades.ts`, `negocios.ts`, `preguntas.ts`,
    `descargar.ts`, `partner.ts`, `privacidad.ts`, `ayuda.ts`; guías en `guias.ts`; capturas y su
    texto alternativo en `capturas.ts`.
- `src/app/(es)/` y `src/app/(en)/en/`: un layout raíz por idioma (`<html lang>` correcto). Cada
  `page.tsx` es una línea que llama a su vista de `src/components/pages/` con el idioma.
- `src/app/global-not-found.tsx`: 404 bilingüe para direcciones que no existen.
- `src/lib/`: ayudas de idioma y direcciones (`i18n.ts`), metadata con hreflang (`metadata.ts`) e
  imagen para compartir (`og.tsx`).

## Interruptores

- `languages.en.published` (`src/content/site.ts`): mientras sea `false`, toda dirección `/en/...`
  responde "no encontrada" y el sitio no muestra selector ES/EN ni hreflang en inglés. Solo se
  pasa a `true` tras la revisión del owner del texto en inglés. Para revisarlo en local, cámbialo
  sin commitear y corre `npm run build && npm run start`.
- `privacidad.{es,en}.text` (`src/content/privacidad.ts`): con `null`, la página de privacidad de
  ese idioma no existe y el pie enlaza a `URLS.privacyPolicy`.
- `ready` de cada guía (`src/content/guias.ts`) y `published` de cada página (`site.ts`).

## Capturas

Capturas reales en `public/screens/`. Variantes opcionales por convención: `x-oscuro.png` (tema
oscuro), `x-en.png` y `x-oscuro-en.png` (app en inglés). Si una variante no existe, se usa la base.
