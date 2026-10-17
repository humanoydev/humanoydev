import type { Metadata } from "next";
// Fuentes self-hosted (no dependen de Google Fonts al compilar).
// "humano": serif cursiva. "dev": monoespaciada. Texto: grotesca.
import "@fontsource-variable/newsreader/opsz-italic.css";
import "@fontsource-variable/schibsted-grotesk/index.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import "./globals.css";
import { SITE_URL } from "@/content/site";
import { openGraphBase } from "./shared-metadata";

const description =
  "Un espacio para construir software con IA sin dejar de pensar como humano. Experimentos, artículos y recursos.";

// Iconos: src/app/{favicon.ico,icon.svg,apple-icon.png}. Imagen para redes: public/og.png.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "humanoydev",
    template: "%s · humanoydev",
  },
  description,
  openGraph: { ...openGraphBase, title: "humanoydev", description, url: "/" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
