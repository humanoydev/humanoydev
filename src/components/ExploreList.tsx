"use client";

import { useState } from "react";
import { categories, contentItems, type Category } from "@/content/site";
import { ContentRow } from "./ContentRow";

type Filter = Category | "todo";

export function ExploreList() {
  const [filter, setFilter] = useState<Filter>("todo");

  const items = filter === "todo" ? contentItems : contentItems.filter((i) => i.category === filter);
  const countFor = (id: Filter) =>
    id === "todo" ? contentItems.length : contentItems.filter((i) => i.category === id).length;

  return (
    <>
      <div role="group" aria-label="Filtrar por tipo" className="filters">
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
            <h2 className="row__title">Todavía no hay artículos publicados</h2>
            <p>El primero está en camino. Mientras tanto, revisa los experimentos: ahí está lo que ya funciona.</p>
            <button type="button" className="btn btn--dark" onClick={() => setFilter("experimentos")}>
              Ver experimentos
            </button>
          </div>
        )}
      </div>
    </>
  );
}
