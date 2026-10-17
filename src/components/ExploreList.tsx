"use client";

import { useState } from "react";
import type { Locale } from "@/content/i18n";
import type { Category, ContentItem } from "@/content/site";
import { ContentRow } from "./ContentRow";

type Filter = Category | "todo";

const copy: Record<Locale, { filterLabel: string; emptyTitle: string; emptyText: string; emptyAction: string }> = {
  es: {
    filterLabel: "Filtrar por tipo",
    emptyTitle: "Todavía no hay artículos publicados",
    emptyText: "El primero está en camino. Mientras tanto, revisa los experimentos: ahí está lo que ya funciona.",
    emptyAction: "Ver experimentos",
  },
  en: {
    filterLabel: "Filter by type",
    emptyTitle: "No articles published yet",
    emptyText: "The first one is on its way. In the meantime, check out the experiments: that’s where the working stuff is.",
    emptyAction: "See experiments",
  },
};

type Props = {
  locale: Locale;
  items: ContentItem[];
  categories: { id: Filter; label: string }[];
};

export function ExploreList({ locale, items: contentItems, categories }: Props) {
  const [filter, setFilter] = useState<Filter>("todo");
  const t = copy[locale];

  const items = filter === "todo" ? contentItems : contentItems.filter((i) => i.category === filter);
  const countFor = (id: Filter) =>
    id === "todo" ? contentItems.length : contentItems.filter((i) => i.category === id).length;

  return (
    <>
      <div role="group" aria-label={t.filterLabel} className="filters">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className="filter"
            aria-pressed={filter === c.id}
            onClick={() => setFilter(c.id)}
          >
            {c.label} ({countFor(c.id)})
          </button>
        ))}
      </div>

      <div className="results" aria-live="polite">
        {items.length > 0 ? (
          <ul className="rows">
            {items.map((item) => (
              <ContentRow key={item.title} item={item} headingLevel="h2" />
            ))}
          </ul>
        ) : (
          <div className="empty">
            <h2 className="row__title">{t.emptyTitle}</h2>
            <p>{t.emptyText}</p>
            <button type="button" className="btn btn--dark" onClick={() => setFilter("experimentos")}>
              {t.emptyAction}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
