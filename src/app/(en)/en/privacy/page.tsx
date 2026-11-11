import { PrivacyPage } from "@/components/pages/PrivacyPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("privacy", "en");

export default function Page() {
  return <PrivacyPage locale="en" />;
}
