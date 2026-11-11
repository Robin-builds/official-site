import { SiteShell } from "@/components/layout/SiteShell";
import { layoutMetadata } from "@/lib/metadata";

export { viewport } from "@/components/layout/RootDocument";
export const metadata = layoutMetadata("es");

/** Layout raíz del sitio en español (`<html lang="es-CL">`, rutas en la raíz; research R16). */
export default function SpanishLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="es">{children}</SiteShell>;
}
