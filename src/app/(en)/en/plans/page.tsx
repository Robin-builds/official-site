import { PlansPage } from "@/components/pages/PlansPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("plans", "en");

export default function Page() {
  return <PlansPage locale="en" />;
}
