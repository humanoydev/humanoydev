import type { Metadata } from "next";
import Link from "next/link";
import { ContentRow } from "@/components/ContentRow";
import { pageAlternates } from "@/content/i18n";
import { JEAN_URL, type ContentItem } from "@/content/site";

// Versión en inglés de (es)/(site)/page.tsx.
export const metadata: Metadata = {
  alternates: pageAlternates("/en", "en"),
};

const featured: ContentItem[] = [
  {
    category: "recursos",
    kind: "Talk",
    title: "AI Fluency & Claude Code",
    description:
      "Claude Code as a lab for working with AI with judgment, beyond the feature list. Given at f13, at UTEC, Lima.",
    linkText: "See the talk",
    href: `${JEAN_URL}/en#talks`,
  },
  {
    category: "experimentos",
    kind: "Experiment",
    title: "claude-design-reconcile",
    description: "A skill that keeps Claude Design designs, React code and Figma in sync, in both directions.",
    linkText: "See the experiment",
    href: "/en/explore",
    mono: true,
  },
  {
    category: "recursos",
    kind: "Resource",
    title: "Claude Code with git worktrees",
    description: "How I work with worktrees, parallel sessions, and one model to plan and another to execute.",
    linkText: "See the resource",
    href: "/en/explore",
  },
];

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-title" className="container hero">
        {/* El nombre de la marca se queda en español. */}
        <h1 id="hero-title" className="hero-title" lang="es">
          <span className="serif">humano</span> <span className="hero-title__y">y</span>{" "}
          <span className="mono hero-title__dev">dev</span>
        </h1>
        <div className="hero-body">
          <p className="lead">
            A place to build software with AI without forgetting to think like a human. Experiments, articles and
            resources that come out of real work.
          </p>
          <div className="actions">
            <Link href="/en/explore" className="btn btn--primary">
              Explore the content
            </Link>
            <a href={`${JEAN_URL}/en`} className="btn btn--outline">
              Meet Jean
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="sel-title" className="container section">
        <div className="section-head">
          <h2 id="sel-title" className="section-title">
            Where to start
          </h2>
          <Link href="/en/explore" className="text-link">
            See all content
          </Link>
        </div>
        <ul className="rows">
          {featured.map((item) => (
            <ContentRow key={item.title} item={item} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="com-title" className="container section" style={{ paddingBottom: 112 }}>
        <div className="panel panel--split">
          <div className="panel__text">
            <h2 id="com-title" className="section-title">
              The community is under construction
            </h2>
            <p className="panel__desc">
              Newsletter, meetups and collaborations. We’re building it commit by commit: see how it’s going.
            </p>
          </div>
          <Link href="/en/community" className="btn btn--dark">
            See the progress
          </Link>
        </div>
      </section>
    </>
  );
}
