import { FeaturesPage } from "@/components/pages/FeaturesPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("features", "en");

export default function Page() {
  return <FeaturesPage locale="en" />;
}
