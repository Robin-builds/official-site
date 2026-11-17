import { ogContentType, ogSize, pageOgAlt, pageOgImage } from "@/lib/og";

export const alt = pageOgAlt("plans", "es");
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return pageOgImage("plans", "es");
}
