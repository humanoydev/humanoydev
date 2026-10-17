import type { Metadata } from "next";
import "../styles";
import { SITE_URL } from "@/content/site";
import { openGraphEn } from "../shared-metadata";

const description =
  "A place to build software with AI without forgetting to think like a human. Experiments, articles and resources.";

// Layout raíz en inglés: todo lo que está bajo /en.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "humanoydev",
    template: "%s · humanoydev",
  },
  description,
  openGraph: { ...openGraphEn, title: "humanoydev", description, url: "/en" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
