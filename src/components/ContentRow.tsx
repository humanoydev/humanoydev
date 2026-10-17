import type { ContentItem } from "@/content/site";

export function ContentRow({ item, headingLevel = "h3" }: { item: ContentItem; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <li className="row">
      <p className="row__meta">{item.kind}</p>
      <div className="row__body">
        <Heading className={`row__title${item.mono ? " mono" : ""}`}>{item.title}</Heading>
        <p className="row__desc">{item.description}</p>
      </div>
      <a href={item.href} className="text-link">
        {item.linkText}
      </a>
    </li>
  );
}
