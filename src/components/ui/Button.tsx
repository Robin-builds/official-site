import Link from "next/link";
import { ui } from "@/content/site";
import type { Locale } from "@/content/types";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  /** Idioma de la página: define el aviso "se abre en una pestaña nueva" para lectores. */
  locale: Locale;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

// Jerarquía de acciones (Principio II):
// primary   = única conversión de la página ("Pruébala gratis"), relleno con el primario del tema.
// secondary = acciones subordinadas ("Ver cómo funciona", "Ver la guía"), solo contorno.
// ghost     = acceso utilitario ("Ingresar"), texto de enlace sin borde ni relleno.
const variants = {
  primary: "bg-primary text-on-primary shadow-card hover:bg-primary-hover",
  secondary: "border border-line text-fg hover:bg-surface-2",
  ghost: "text-link underline-offset-4 hover:underline",
} as const;

// min-h-11 = 44px: área táctil mínima en móvil
const sizes = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-12 px-5 text-base",
  lg: "min-h-13 px-7 text-base sm:text-lg",
} as const;

/**
 * Enlace con apariencia de botón. Externos: pestaña nueva con aviso para lectores.
 * Internos ("/…"): next/link, navegación sin recargar dentro del mismo idioma.
 * Anclas ("#…"): enlace normal.
 */
export function Button({ href, children, locale, variant = "primary", size = "md", className = "" }: ButtonProps) {
  const external = href.startsWith("http");
  // ghost no lleva padding horizontal grande: se lee como enlace
  const sizeClass = variant === "ghost" ? sizes[size].replace(/px-\d+/, "px-2") : sizes[size];
  const classes = `inline-flex items-center justify-center gap-2 rounded-button font-semibold transition-colors duration-150 ${variants[variant]} ${sizeClass} ${className}`;

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={classes}>
      {children}
      {/* Aviso solo para lectores de pantalla: el enlace abre otra pestaña */}
      {external && <span className="sr-only"> {ui[locale].a11y.newTab}</span>}
    </a>
  );
}
