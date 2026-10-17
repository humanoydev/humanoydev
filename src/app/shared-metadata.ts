import type { Metadata } from "next";

// Next fusiona los metadatos de forma superficial: si una página define
// `openGraph`, reemplaza el del layout. Por eso cada página parte de esta base.
export const openGraphBase = {
  type: "website",
  siteName: "humanoydev",
  locale: "es_PE",
  alternateLocale: "en_US",
  images: [
    {
      url: "/og.png",
      width: 1200,
      height: 630,
      alt: "humanoydev: construir software con IA sin dejar de pensar como humano.",
    },
  ],
} satisfies Metadata["openGraph"];

// Igual, para las páginas en inglés.
export const openGraphEn = {
  ...openGraphBase,
  locale: "en_US",
  alternateLocale: "es_PE",
  images: [
    {
      ...openGraphBase.images[0],
      url: "/og-en.png",
      alt: "humanoydev: building software with AI while still thinking like a human.",
    },
  ],
} satisfies Metadata["openGraph"];
