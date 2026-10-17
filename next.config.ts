import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exporta HTML estático a /out; el Worker de Cloudflare lo sirve como assets.
  // Nota: cacheComponents/partialPrefetching (que trae create-next-app) no son
  // compatibles con output: "export", por eso se quitaron.
  output: "export",
  // Sin servidor de Next no hay optimizador de imágenes.
  images: { unoptimized: true },
  // Hay un layout raíz por idioma ((es) y (en)), así que el 404 vive en
  // src/app/global-not-found.tsx con su propio <html>.
  experimental: { globalNotFound: true },
};

export default nextConfig;
