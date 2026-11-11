import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { languages } from "@/content/site";
import { layoutMetadata } from "@/lib/metadata";

export { viewport } from "@/components/layout/RootDocument";
export const metadata = layoutMetadata("en");

/**
 * Layout raíz del sitio en inglés (`<html lang="en">`, rutas bajo /en; research R16).
 *
 * Guardia de publicación (FR-031, constitución VII): mientras el owner no apruebe el inglés
 * (`languages.en.published = false`), ninguna dirección /en/... existe en el sitio publicado,
 * aunque sus rutas estén en el código: el layout responde "no encontrada" antes de renderizar.
 */
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  if (!languages.en.published) notFound();
  return <SiteShell locale="en">{children}</SiteShell>;
}
