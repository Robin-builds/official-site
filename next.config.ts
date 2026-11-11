import path from "node:path";
import type { NextConfig } from "next";
import { privacidad } from "./src/content/privacidad";
import { languages } from "./src/content/site";

const nextConfig: NextConfig = {
  turbopack: {
    // Fija la raíz al proyecto: hay un package-lock.json suelto en una carpeta superior
    // que Next tomaría como raíz y genera un warning en el build.
    root: path.resolve(process.cwd()),
    // Tailwind v4 se procesa con su loader de Turbopack (configurado por create-next-app 16)
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    // 404 bilingüe para URLs que no calzan con ninguna ruta: con un layout raíz por idioma
    // no hay layout común para componerla (research R12). Único flag experimental permitido
    // por la constitución 3.0.1.
    globalNotFound: true,
  },
  /*
   * Direcciones que no deben existir en el sitio publicado se mandan ANTES de buscar archivos
   * a una ruta inexistente, así responden la 404 global (con marca y tema, también sin JS) y
   * no dejan ver su contenido ni su metadata:
   * - Inglés sin publicar (FR-031): toda /en/... mientras `languages.en.published` sea false.
   *   El layout (en) además llama a notFound() como segunda barrera.
   * - Privacidad sin texto del owner en ese idioma (FR-019, research R11).
   */
  async rewrites() {
    const hidden = "/_no-publicado";
    const sources: string[] = [];
    if (!languages.en.published) sources.push("/en", "/en/:path*");
    if (privacidad.es.text === null) sources.push("/privacidad", "/privacidad/:path*");
    if (languages.en.published && privacidad.en.text === null) sources.push("/en/privacy", "/en/privacy/:path*");
    return { beforeFiles: sources.map((source) => ({ source, destination: hidden })) };
  },
};

export default nextConfig;
