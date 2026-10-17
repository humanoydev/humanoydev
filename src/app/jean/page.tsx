import type { Metadata } from "next";
import Image from "next/image";
import { openGraphBase } from "@/app/shared-metadata";
import { CONTACT_EMAIL, JEAN_URL, SITE_URL, projects, talks, type Talk } from "@/content/site";

const title = "Jean Paul Diaz · web dev";
const description = "Charlas, diapositivas y proyectos de Jean Paul Diaz, web dev.";

// Esta ruta se sirve en jean.humanoydev.com: el Worker reescribe "/" a "/jean".
// La imagen vive en public/jean/og.png, que el subdominio sirve como /og.png.
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: JEAN_URL },
  openGraph: {
    ...openGraphBase,
    type: "profile",
    title,
    description,
    url: JEAN_URL,
    images: [{ url: `${JEAN_URL}/og.png`, width: 1200, height: 630, alt: "Jean Paul Diaz, web dev" }],
  },
};

const sections = [
  { href: "#charlas", label: "Charlas" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#contacto", label: "Contacto" },
];

const VISIBLE_TALKS = 3;

function renderTalk(talk: Talk) {
  return (
    <li key={talk.title} className="row">
      <p className="row__meta">{talk.date}</p>
      <div className="row__body">
        <h3 className="row__title">{talk.title}</h3>
        <p className="row__sub">
          {talk.eventHref ? <a href={talk.eventHref}>{talk.event}</a> : talk.event}
        </p>
        <p className="row__desc">{talk.description}</p>
      </div>
      <a href={talk.slidesHref} className="text-link">
        Ver diapositivas
      </a>
    </li>
  );
}

export default function JeanPage() {
  return (
    <>
      <header className="container site-header">
        <a href="#inicio" className="serif nav-link" style={{ fontSize: 26, padding: 0 }}>
          Jean Paul Diaz
        </a>
        <nav aria-label="Secciones">
          <ul className="nav-list">
            {sections.map((s) => (
              <li key={s.href}>
                <a href={s.href} className="nav-link">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={SITE_URL} className="nav-link nav-link--quiet">
                humanoydev.com
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main id="inicio">
        <section aria-labelledby="bio-title" className="container bio">
          <div className="bio__text">
            <h1 id="bio-title" className="serif bio__name">
              Jean Paul Diaz
            </h1>
            <p className="mono bio__role">web dev</p>
            <p className="bio__desc">
              Frontend developer en Brikl. Trabajo con Next.js, React, GraphQL y Apollo Client, y me interesa cómo cambia
              nuestro oficio cuando la IA entra al flujo de trabajo. Lo que aprendo lo comparto en humanoydev.
            </p>
            <div className="actions">
              <a href="#contacto" className="btn btn--primary">
                Invitarme a una charla
              </a>
              <a href="#charlas" className="btn btn--outline">
                Ver diapositivas
              </a>
            </div>
          </div>
          {/* Ruta con /jean: funciona en local (/jean) y en el subdominio (el Worker sirve el asset). */}
          <Image
            src="/jean/images/foto-saco-680.jpg"
            width={680}
            height={850}
            alt="Jean Paul Diaz con saco gris y los brazos cruzados"
            className="photo"
            priority
          />
        </section>

        <section id="charlas" aria-labelledby="charlas-title" className="container section">
          <h2 id="charlas-title" className="section-title section-head">
            Charlas y presentaciones
          </h2>
          <ol className="rows">{talks.slice(0, VISIBLE_TALKS).map(renderTalk)}</ol>
          {talks.length > VISIBLE_TALKS && (
            <details className="more">
              <summary className="text-link">
                <span className="more__open">Ver más charlas</span>
                <span className="more__close">Ver menos</span>
              </summary>
              <ol className="rows" start={VISIBLE_TALKS + 1}>
                {talks.slice(VISIBLE_TALKS).map(renderTalk)}
              </ol>
            </details>
          )}
        </section>

        <section id="proyectos" aria-labelledby="proyectos-title" className="container section">
          <h2 id="proyectos-title" className="section-title">
            Proyectos destacados
          </h2>
          <div className="projects">
            {projects.map((project) => (
              <article key={project.title} className="project">
                <p className="project__kind">{project.kind}</p>
                <h3 className={`project__title${project.mono ? " mono" : ""}`}>{project.title}</h3>
                <p className="project__desc">{project.description}</p>
                <a href={project.href} className="text-link">
                  {project.linkText}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="contacto" aria-labelledby="contacto-title" className="container section" style={{ paddingBottom: 112 }}>
          <div className="contact">
            <div style={{ flex: "1 1 460px", minWidth: 0 }}>
              <h2 id="contacto-title" className="contact__title">
                ¿Organizas un evento?
              </h2>
              <p className="contact__desc">
                Doy charlas sobre AI Fluency, Claude Code y flujos de diseño a código. Cuéntame la fecha, el público y el
                formato, y vemos si encaja.
              </p>
            </div>
            <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn--light">
              Escribir a Jean
            </a>
          </div>
        </section>
      </main>

      <footer className="container site-footer">
        <p>© 2026 Jean Paul Diaz</p>
        <a href={SITE_URL}>Parte de humanoydev.com</a>
      </footer>
    </>
  );
}
