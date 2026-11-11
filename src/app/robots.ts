import type { MetadataRoute } from "next";
import { URLS } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${URLS.site}/sitemap.xml`,
  };
}
