import { PartnerPage } from "@/components/pages/PartnerPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("partner", "es");

export default function Page() {
  return <PartnerPage locale="es" />;
}
