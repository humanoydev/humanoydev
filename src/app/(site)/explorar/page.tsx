import type { Metadata } from "next";
import { ExploreList } from "@/components/ExploreList";

export const metadata: Metadata = {
  title: "Explorar",
  description: "Artículos, experimentos y recursos sobre desarrollar software con IA.",
};

export default function ExplorePage() {
  return (
    <div className="container page">
      <h1 className="page-title">Explorar</h1>
      <p className="page-intro">
        Artículos, experimentos y recursos. Aquí solo está lo que ya existe; lo demás llega cuando esté listo.
      </p>
      <ExploreList />
    </div>
  );
}
