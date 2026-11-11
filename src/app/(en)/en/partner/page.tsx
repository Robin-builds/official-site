import { PartnerPage } from "@/components/pages/PartnerPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("partner", "en");

export default function Page() {
  return <PartnerPage locale="en" />;
}
