import { readyGuides } from "@/content/guias";
import { guideOgImage, ogContentType, ogSize, pageOgAlt } from "@/lib/og";

export const alt = pageOgAlt("help", "es");
export const size = ogSize;
export const contentType = ogContentType;

// Una imagen por guía lista, generada en el build (FR-024: todo estático)
export function generateStaticParams() {
  return readyGuides().map((g) => ({ guia: g.locales.es.slug }));
}

export default async function Image({ params }: { params: Promise<{ guia: string }> }) {
  const { guia } = await params;
  return guideOgImage(guia, "es");
}
