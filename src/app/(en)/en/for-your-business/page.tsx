import { BusinessPage } from "@/components/pages/BusinessPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("business", "en");

export default function Page() {
  return <BusinessPage locale="en" />;
}
