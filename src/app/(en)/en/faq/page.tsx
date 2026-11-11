import { FaqPage } from "@/components/pages/FaqPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("faq", "en");

export default function Page() {
  return <FaqPage locale="en" />;
}
