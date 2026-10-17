import type { Metadata } from "next";

export type Locale = "es" | "en";

// Cada página del sitio principal con su ruta en cada idioma.
// Si agregas una página, agrégala aquí para que funcione el botón ES/EN.
const pagePaths: Record<Locale, string>[] = [
  { es: "/", en: "/en" },
  { es: "/explorar", en: "/en/explore" },
  { es: "/comunidad", en: "/en/community" },
  { es: "/acerca", en: "/en/about" },
];

// Ruta equivalente en el otro idioma; si no hay, la portada de ese idioma.
export function translatePath(pathname: string, to: Locale): string {
  const from: Locale = to === "en" ? "es" : "en";
  return pagePaths.find((p) => p[from] === pathname)?.[to] ?? pagePaths[0][to];
}

// `alternates` para metadata: canonical + hreflang de ambas versiones.
export function pageAlternates(pathname: string, locale: Locale): Metadata["alternates"] {
  const es = locale === "es" ? pathname : translatePath(pathname, "es");
  const en = locale === "en" ? pathname : translatePath(pathname, "en");
  return { canonical: pathname, languages: { es, en, "x-default": es } };
}
