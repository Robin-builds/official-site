import { DownloadPage } from "@/components/pages/DownloadPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("download", "en");

export default function Page() {
  return <DownloadPage locale="en" />;
}
