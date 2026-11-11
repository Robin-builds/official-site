import path from "node:path";
import type { NextConfig } from "next";

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
};

export default nextConfig;
