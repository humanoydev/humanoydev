import type { Metadata } from "next";
import "../styles";
import { SITE_URL } from "@/content/site";
import { openGraphBase } from "../shared-metadata";

const description =
  "Un espacio para construir software con IA sin dejar de pensar como humano. Experimentos, artículos y recursos.";

// Layout raíz en español. El de inglés está en (en)/layout.tsx; cada uno pone su <html lang>.
// Iconos: src/app/{favicon.ico,icon.svg,apple-icon.png}. Imagen para redes: public/og.png (y og-en.png en inglés).
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
