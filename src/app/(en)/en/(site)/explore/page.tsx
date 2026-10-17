import type { Metadata } from "next";
import { openGraphEn } from "@/app/shared-metadata";
import { ExploreList } from "@/components/ExploreList";
import { pageAlternates } from "@/content/i18n";
import { categories, contentItems } from "@/content/site.en";

const description = "Articles, experiments and resources about building software with AI.";

export const metadata: Metadata = {
  title: "Explore",
  description,
  openGraph: { ...openGraphEn, title: "Explore · humanoydev", description, url: "/en/explore" },
  alternates: pageAlternates("/en/explore", "en"),
};

export default function ExplorePage() {
  return (
    <div className="container page">
      <h1 className="page-title">Explore</h1>
      <p className="page-intro">
        Articles, experiments and resources. Only what already exists is here; the rest arrives when it’s ready.
      </p>
      <ExploreList locale="en" items={contentItems} categories={categories} />
    </div>
  );
}
