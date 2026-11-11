import { HelpPage } from "@/components/pages/HelpPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("help", "es");

export default function Page() {
  return <HelpPage locale="es" />;
}
