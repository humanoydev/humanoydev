import Link from "next/link";
import { ContentRow } from "@/components/ContentRow";
import { JEAN_URL, type ContentItem } from "@/content/site";

const featured: ContentItem[] = [
  {
    category: "recursos",
    kind: "Charla",
    title: "AI Fluency & Claude Code",
    description:
      "Claude Code como laboratorio para trabajar con IA con criterio, más allá de la lista de funciones. Presentada en f13, en UTEC, Lima.",
    linkText: "Ver la charla",
    href: `${JEAN_URL}/#charlas`,
  },
  {
    category: "experimentos",
    kind: "Experimento",
    title: "claude-design-reconcile",
    description:
      "Una skill que mantiene sincronizados los diseños de Claude Design, el código React y Figma, en ambas direcciones.",
    linkText: "Ver el experimento",
    href: "/explorar",
    mono: true,
  },
  {
    category: "recursos",
    kind: "Recurso",
    title: "Claude Code con git worktrees",
    description:
      "Cómo trabajo con worktrees, sesiones en paralelo y un modelo para planificar y otro para ejecutar.",
    linkText: "Ver el recurso",
    href: "/explorar",
  },
];

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-title" className="container hero">
        <h1 id="hero-title" className="hero-title">
          <span className="serif">humano</span> <span className="hero-title__y">y</span>{" "}
          <span className="mono hero-title__dev">dev</span>
        </h1>
        <div className="hero-body">
          <p className="lead">
            Un espacio para construir software con IA sin dejar de pensar como humano. Experimentos, artículos y
            recursos que salen del trabajo real.
          </p>
          <div className="actions">
            <Link href="/explorar" className="btn btn--primary">
              Explorar el contenido
            </Link>
            <a href={JEAN_URL} className="btn btn--outline">
              Conocer a Jean
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="sel-title" className="container section">
        <div className="section-head">
          <h2 id="sel-title" className="section-title">
            Para empezar
          </h2>
          <Link href="/explorar" className="text-link">
            Ver todo el contenido
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
              La comunidad está en construcción
            </h2>
            <p className="panel__desc">
              Newsletter, encuentros y colaboraciones. La estamos armando commit a commit: mira en qué va.
            </p>
          </div>
          <Link href="/comunidad" className="btn btn--dark">
            Ver el avance
          </Link>
        </div>
      </section>
    </>
  );
}
