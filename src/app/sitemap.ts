import type { MetadataRoute } from "next";
import { pagePaths } from "@/content/i18n";
import { JEAN_URL, SITE_URL } from "@/content/site";

// Incluye las URLs de jean.humanoydev.com: es válido porque su robots.txt
// (el mismo de la raíz, lo sirve el Worker) apunta a este sitemap.
export const dynamic = "force-static";

// Cada URL lleva sus dos versiones de idioma, como pide Google para hreflang.
function pair(es: string, en: string): MetadataRoute.Sitemap {
  const languages = { es, en, "x-default": es };
  return [
    { url: es, alternates: { languages } },
    { url: en, alternates: { languages } },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const absolute = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);
  return [
    ...pagePaths.flatMap((p) => pair(absolute(p.es), absolute(p.en))),
    ...pair(JEAN_URL, `${JEAN_URL}/en`),
    { url: `${JEAN_URL}/get-on-code-2026/` },
  ];
}
