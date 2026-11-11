import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { InicioContent } from "@/content/inicio";
import type { HeroScreens, Locale, Screenshot } from "@/content/types";
import { fillTemplate } from "@/lib/text";
import { ScreensCarousel } from "./ScreensCarousel";

type CarouselCopy = InicioContent["hero"]["carousel"];

const HERO_SIZES = "(min-width: 1024px) 300px, (min-width: 640px) 280px, 248px";

/** "/screens/bodega.png" → "/screens/bodega-oscuro.png" (convención de la spec 003). */
function withSuffix(src: string, suffix: string) {
  return src.replace(/(\.[a-z0-9]+)$/i, `${suffix}$1`);
}

/** ¿Existe el archivo en /public? Se evalúa al construir: la página es estática. */
function existsInPublic(src: string) {
  return fs.existsSync(path.join(process.cwd(), "public", src));
}

/**
 * Marco de teléfono Android genérico hecho solo con CSS (sin marca de fabricante).
 * Proporción 9:19,5, la de las capturas reales (1080×2340).
 */
export function PhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Botones laterales: volumen y encendido */}
      <span aria-hidden="true" className="absolute top-[18%] -right-[3px] h-[9%] w-[3px] rounded-r bg-brand-ink ring-1 ring-line" />
      <span aria-hidden="true" className="absolute top-[30%] -right-[3px] h-[6%] w-[3px] rounded-r bg-brand-ink ring-1 ring-line" />

      {/* Bisel */}
      <div className="rounded-[2.6rem] bg-brand-ink p-2.5 shadow-phone ring-1 ring-line">
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.1rem] bg-surface-2">
          {/* Cámara perforada */}
          <span
            aria-hidden="true"
            className="absolute top-3 left-1/2 z-10 size-2.5 -translate-x-1/2 rounded-full bg-brand-ink"
          />
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Imagen de una captura real con sus variantes opcionales (research R19 y spec 003):
 * "x-en.png" en inglés y "x-oscuro.png" / "x-oscuro-en.png" para el tema oscuro.
 * Si una variante no existe, se usa la captura en español.
 *
 * Principio I: si falta el archivo, se muestra un placeholder neutro con la ruta esperada;
 * nunca se dibuja una interfaz ficticia.
 */
export function ScreenImage({
  screen,
  locale,
  pendingLabel,
  sizes,
  first = false,
}: {
  screen: Screenshot;
  locale: Locale;
  pendingLabel: string;
  sizes: string;
  /** Imagen principal de la página (LCP): se carga con prioridad */
  first?: boolean;
}) {
  const localized = (src: string) => {
    const en = withSuffix(src, "-en");
    return locale === "en" && existsInPublic(en) ? en : src;
  };
  const lightSrc = localized(screen.src);
  const darkSrc = localized(withSuffix(screen.src, "-oscuro"));
  const hasLight = existsInPublic(lightSrc);
  const hasDark = existsInPublic(darkSrc);

  /*
   * Prioridad de carga (doc de next/image, "preload" y "Theme detection"):
   * - Imagen principal con una sola versión: `preload` (es el LCP).
   * - Imagen principal con par claro/oscuro: `fetchPriority="high"` sin preload; con preload
   *   se descargarían ambas versiones. La oculta (display:none) no se descarga por ser lazy.
   * - Resto: lazy (por defecto).
   */
  const priority = first ? (hasDark ? { fetchPriority: "high" as const } : { preload: true }) : {};
  const common = { width: screen.width, height: screen.height, sizes, ...priority };

  return (
    <>
      {hasLight ? (
        <Image
          {...common}
          alt={screen.alt}
          src={lightSrc}
          className={`size-full object-cover ${hasDark ? "screen-light" : ""}`}
        />
      ) : (
        <div
          className={`flex size-full flex-col items-center justify-center gap-3 border-2 border-dashed border-line p-6 text-center ${hasDark ? "screen-light" : ""}`}
        >
          <span className="text-sm font-medium text-muted-2">{pendingLabel}</span>
          <code className="rounded bg-surface px-2 py-1 text-xs break-all text-fg-2">{`public${screen.src}`}</code>
        </div>
      )}
      {hasDark && <Image {...common} alt={screen.alt} src={darkSrc} className="screen-dark size-full object-cover" />}
    </>
  );
}

/**
 * Teléfono del hero con un recorrido de capturas reales de la app (spec 003).
 *
 * Todo lo pesado ocurre aquí, en el servidor: detectar qué capturas existen, armar cada
 * diapositiva con next/image y decidir cuál se carga con prioridad. ScreensCarousel (cliente)
 * solo decide cuál se ve, vía data-active; el CSS de globals.css hace el resto.
 */
export function PhoneMockup({
  screens,
  pendingLabel,
  carousel,
  locale,
}: {
  screens: HeroScreens;
  pendingLabel: string;
  carousel: CarouselCopy;
  locale: Locale;
}) {
  const total = screens.length;

  return (
    <ScreensCarousel captions={screens.map((s) => s.caption)} copy={carousel}>
      <PhoneFrame>
        {screens.map((screen, i) => (
          // Diapositivas apiladas; globals.css muestra solo la de data-active
          <div
            key={screen.src}
            data-slide={i}
            role="group"
            aria-roledescription={carousel.slideRoleDescription}
            aria-label={fillTemplate(carousel.slideLabel, { n: i + 1, total })}
            className="absolute inset-0"
          >
            <ScreenImage screen={screen} locale={locale} pendingLabel={pendingLabel} sizes={HERO_SIZES} first={i === 0} />
          </div>
        ))}
      </PhoneFrame>
    </ScreensCarousel>
  );
}
