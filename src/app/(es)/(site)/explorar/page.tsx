import type { Metadata } from "next";
import { openGraphBase } from "@/app/shared-metadata";
import { pageAlternates } from "@/content/i18n";
import { categories, contentItems } from "@/content/site";
import { ExploreList } from "@/components/ExploreList";

const description = "Artículos, experimentos y recursos sobre desarrollar software con IA.";

export const metadata: Metadata = {
  title: "Explorar",
  description,
  openGraph: { ...openGraphBase, title: "Explorar · humanoydev", description, url: "/explorar" },
  alternates: pageAlternates("/explorar", "es"),
};

export default function ExplorePage() {
  return (
    <div className="container page">
      <h1 className="page-title">Explorar</h1>
      <p className="page-intro">
        Artículos, experimentos y recursos. Aquí solo está lo que ya existe; lo demás llega cuando esté listo.
      </p>
      <ExploreList locale="es" items={contentItems} categories={categories} />
    </div>
  );
}
