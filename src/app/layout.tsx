import type { Metadata } from "next";
// Fuentes self-hosted (no dependen de Google Fonts al compilar).
// "humano": serif cursiva. "dev": monoespaciada. Texto: grotesca.
import "@fontsource-variable/newsreader/opsz-italic.css";
import "@fontsource-variable/schibsted-grotesk/index.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "humanoydev",
    template: "%s · humanoydev",
  },
  description:
    "Un espacio para construir software con IA sin dejar de pensar como humano. Experimentos, artículos y recursos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
