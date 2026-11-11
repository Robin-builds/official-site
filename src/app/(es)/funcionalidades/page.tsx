import { FeaturesPage } from "@/components/pages/FeaturesPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("features", "es");

export default function Page() {
  return <FeaturesPage locale="es" />;
}
