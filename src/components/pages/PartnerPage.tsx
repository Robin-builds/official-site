import { partner } from "@/content/partner";
import type { Locale } from "@/content/types";
import { PartnerPanel } from "@/components/sections/PartnerPanel";

/** "Sé partner" (FR-010): una sola sección; su conversión es WhatsApp. */
export function PartnerPage({ locale }: { locale: Locale }) {
  return <PartnerPanel partner={partner[locale]} locale={locale} />;
}
