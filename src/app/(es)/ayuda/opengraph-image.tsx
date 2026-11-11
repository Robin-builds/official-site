import { ogContentType, ogSize, pageOgAlt, pageOgImage } from "@/lib/og";

export const alt = pageOgAlt("help", "es");
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return pageOgImage("help", "es");
}
