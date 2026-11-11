import { BusinessPage } from "@/components/pages/BusinessPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("business", "es");

export default function Page() {
  return <BusinessPage locale="es" />;
}
