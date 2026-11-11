import type { Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { THEME_STORAGE_KEY } from "@/components/ui/theme";
import "@/app/globals.css";

/*
 * Documento HTML común a los dos layouts raíz (`(es)` y `(en)`, research R16) y a la 404
 * global: idioma, tipografía, estilos y script de tema en un solo lugar.
 */

// Tipografía de la app (Type.kt). next/font la autoaloja: sin peticiones a Google en runtime.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

// Color de la barra del navegador móvil según el tema del sistema (fondos de cada tema)
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#131620" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

/*
 * Fija data-theme en <html> ANTES del primer pintado, así nunca se ve el tema equivocado
 * (patrón de la guía de Next 16 "preventing-flash-before-hydration").
 * Prioridad: elección guardada > preferencia del sistema (claro) > oscuro.
 * La elección se guarda en localStorage, así se mantiene entre páginas e idiomas (FR-022).
 * Todo va en try/catch: sin localStorage o matchMedia la página igual se muestra.
 */
const themeScript = `(function(){var d=document.documentElement,k=${JSON.stringify(THEME_STORAGE_KEY)};function saved(){try{var t=localStorage.getItem(k);return t==="dark"||t==="light"?t:null}catch(e){return null}}try{var m=window.matchMedia("(prefers-color-scheme: light)");d.setAttribute("data-theme",saved()||(m.matches?"light":"dark"));m.addEventListener("change",function(e){if(!saved())d.setAttribute("data-theme",e.matches?"light":"dark")})}catch(e){d.setAttribute("data-theme",saved()||"dark")}})()`;

export function RootDocument({ lang, children }: { lang: "es-CL" | "en"; children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: el script cambia data-theme antes de que React hidrate
    <html lang={lang} className={jakarta.variable} suppressHydrationWarning>
      {/* La regla apunta a pages/; aquí es el <head> de los layouts raíz del App Router */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
