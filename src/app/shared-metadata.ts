import type { Metadata } from "next";

// Next fusiona los metadatos de forma superficial: si una página define
// `openGraph`, reemplaza el del layout. Por eso cada página parte de esta base.
export const openGraphBase = {
  type: "website",
  siteName: "humanoydev",
  locale: "es_PE",
  images: [
    {
      url: "/og.png",
      width: 1200,
      height: 630,
      alt: "humanoydev: construir software con IA sin dejar de pensar como humano.",
    },
  ],
} satisfies Metadata["openGraph"];
