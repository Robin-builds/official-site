import path from "node:path";
import type { NextConfig } from "next";
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
   * Inglés sin publicar (FR-031): mientras `languages.en.published` sea false, toda dirección
   * /en/... se manda ANTES de buscar archivos a una ruta que no existe, así responde la 404
   * global (con marca y tema) y no deja ver nada del texto en inglés.
   * El layout (en) además llama a notFound() como segunda barrera.
   */
  async rewrites() {
    if (languages.en.published) return { beforeFiles: [] };
    const hidden = "/_ingles-no-publicado";
    return {
      beforeFiles: [
        { source: "/en", destination: hidden },
        { source: "/en/:path*", destination: hidden },
      ],
    };
  },
};

export default nextConfig;
