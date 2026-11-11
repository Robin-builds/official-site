import type { Metadata } from "next";
import { GuidePage } from "@/components/pages/GuidePage";
import { readyGuides } from "@/content/guias";
import { guideMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ guide: string }> };

// Solo las guías listas existen; cualquier otro slug responde "no encontrada" (research R10)
export const dynamicParams = false;

export function generateStaticParams() {
  return readyGuides().map((g) => ({ guide: g.locales.en.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { guide } = await params;
  const match = readyGuides().find((g) => g.locales.en.slug === guide);
  return match ? guideMetadata(match.key, "en") : {};
}

export default async function Page({ params }: Props) {
  const { guide } = await params;
  return <GuidePage slug={guide} locale="en" />;
}
