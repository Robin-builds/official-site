import { HelpPage } from "@/components/pages/HelpPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("help", "en");

export default function Page() {
  return <HelpPage locale="en" />;
}
