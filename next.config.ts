import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exporta HTML estático a /out; el Worker de Cloudflare lo sirve como assets.
  // Nota: cacheComponents/partialPrefetching (que trae create-next-app) no son
  // compatibles con output: "export", por eso se quitaron.
  output: "export",
  // Sin servidor de Next no hay optimizador de imágenes.
  images: { unoptimized: true },
};

export default nextConfig;
