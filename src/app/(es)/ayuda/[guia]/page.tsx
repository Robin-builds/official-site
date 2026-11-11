import type { Metadata } from "next";
import { GuidePage } from "@/components/pages/GuidePage";
import { readyGuides } from "@/content/guias";
import { guideMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ guia: string }> };

// Solo las guías listas existen; cualquier otro slug responde "no encontrada" (research R10)
export const dynamicParams = false;

export function generateStaticParams() {
  return readyGuides().map((g) => ({ guia: g.locales.es.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { guia } = await params;
  const match = readyGuides().find((g) => g.locales.es.slug === guia);
  return match ? guideMetadata(match.key, "es") : {};
}

export default async function Page({ params }: Props) {
  const { guia } = await params;
  return <GuidePage slug={guia} locale="es" />;
}
