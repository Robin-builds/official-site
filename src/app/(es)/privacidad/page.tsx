import { PrivacyPage } from "@/components/pages/PrivacyPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("privacy", "es");

export default function Page() {
  return <PrivacyPage locale="es" />;
}
