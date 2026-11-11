import { DownloadPage } from "@/components/pages/DownloadPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("download", "es");

export default function Page() {
  return <DownloadPage locale="es" />;
}
