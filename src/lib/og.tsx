import { ImageResponse } from "next/og";
import { inicio } from "@/content/inicio";
import { ui } from "@/content/site";
import type { Locale, PageKey } from "@/content/types";
import { getPage } from "./i18n";
import { BRAND_ICON_PATHS, BRAND_ICON_VIEWBOX } from "@/components/ui/BrandIcon";

/*
 * Imagen para compartir en WhatsApp/redes (1200×630), generada en el build con la marca de la
 * app. Cada página la llama con su propio título (research R6, FR-020).
 * Los colores van literales porque ImageResponse no lee las variables CSS de globals.css;
 * corresponden a los tokens del tema oscuro: --bg-top #131620, --bg-bottom #0F1219,
 * --brand-ink #0D1519, --brand-cyan #2EC6DA, --brand-orange #F0921E, --text-1 #F5F5F5, --text-3 #9CA3AF.
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const CYAN = "#2EC6DA";
const ORANGE = "#F0921E";

export function renderOgImage({ title, note }: { title: string; note: string }) {
  const { first, second } = ui.es.brand.wordmark;
  // Títulos largos (guías) bajan de tamaño para no salirse de la imagen
  const fontSize = title.length > 50 ? 60 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(180deg, #131620 0%, #171B25 60%, #0F1219 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* Tile de marca con el ícono de la app */}
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 20,
              background: "#0D1519",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(255,255,255,0.08)",
            }}
          >
            <svg width="56" height="56" viewBox={BRAND_ICON_VIEWBOX}>
              {BRAND_ICON_PATHS.map((p) => (
                <path key={p.d} d={p.d} fill={p.tone === "cyan" ? CYAN : ORANGE} />
              ))}
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 800, letterSpacing: -1 }}>
            <span style={{ color: CYAN }}>{first}</span>
            <span style={{ color: ORANGE }}>{second}</span>
          </div>
        </div>
        <div style={{ fontSize, fontWeight: 800, color: "#F5F5F5", lineHeight: 1.1, maxWidth: 1000 }}>{title}</div>
        <div style={{ fontSize: 32, color: "#9CA3AF" }}>{note}</div>
      </div>
    ),
    ogSize,
  );
}

/** Título que muestra la imagen de una página: Inicio usa el titular del hero. */
function ogTitle(key: PageKey, locale: Locale) {
  return key === "home" ? inicio[locale].hero.title : getPage(key).locales[locale].title;
}

/** Texto alternativo de la imagen para compartir de una página. */
export function pageOgAlt(key: PageKey, locale: Locale) {
  return `StoreFlow: ${ogTitle(key, locale)}`;
}

/** Imagen para compartir de una página del registro; la usa cada `opengraph-image.tsx`. */
export function pageOgImage(key: PageKey, locale: Locale) {
  return renderOgImage({ title: ogTitle(key, locale), note: ui[locale].ogNote });
}
