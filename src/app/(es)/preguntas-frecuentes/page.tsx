import { FaqPage } from "@/components/pages/FaqPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("faq", "es");

export default function Page() {
  return <FaqPage locale="es" />;
}
