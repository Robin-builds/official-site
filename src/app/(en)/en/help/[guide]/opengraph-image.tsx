import { readyGuides } from "@/content/guias";
import { guideOgImage, ogContentType, ogSize, pageOgAlt } from "@/lib/og";

export const alt = pageOgAlt("help", "en");
export const size = ogSize;
export const contentType = ogContentType;

// Una imagen por guía lista, generada en el build (FR-024: todo estático)
export function generateStaticParams() {
  return readyGuides().map((g) => ({ guide: g.locales.en.slug }));
}

export default async function Image({ params }: { params: Promise<{ guide: string }> }) {
  const { guide } = await params;
  return guideOgImage(guide, "en");
}
