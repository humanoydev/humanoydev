import type { Metadata } from "next";
import Image from "next/image";
import { openGraphEn } from "@/app/shared-metadata";
import { CONTACT_EMAIL, JEAN_URL, LINKEDIN_URL, SITE_URL, type Talk } from "@/content/site";
import { projects, talks } from "@/content/site.en";

const title = "Jean Paul Diaz · web dev";
const description = "Talks, slides and projects by Jean Paul Diaz, web dev.";

// Versión en inglés de (es)/jean/page.tsx. Se sirve en jean.humanoydev.com/en:
// el Worker reescribe "/en" a "/en/jean".
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${JEAN_URL}/en`, languages: { es: JEAN_URL, en: `${JEAN_URL}/en`, "x-default": JEAN_URL } },
  openGraph: {
    ...openGraphEn,
    type: "profile",
    title,
    description,
    url: `${JEAN_URL}/en`,
    images: [{ url: `${JEAN_URL}/og-en.png`, width: 1200, height: 630, alt: "Jean Paul Diaz, web dev" }],
  },
};

const sections = [
  { href: "#talks", label: "Talks" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
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
        See slides
      </a>
    </li>
  );
}

export default function JeanPage() {
  return (
    <>
      <header className="container site-header">
        <a href="#home" className="serif nav-link" style={{ fontSize: 26, padding: 0 }}>
          Jean Paul Diaz
        </a>
        <nav aria-label="Sections">
          <ul className="nav-list">
            {sections.map((s) => (
              <li key={s.href}>
                <a href={s.href} className="nav-link">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`${SITE_URL}/en`} className="nav-link nav-link--quiet">
                humanoydev.com
              </a>
            </li>
            <li>
              <a href={JEAN_URL} hrefLang="es" lang="es" aria-label="Versión en español" className="nav-link nav-link--quiet">
                ES
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main id="home">
        <section aria-labelledby="bio-title" className="container bio">
          <div className="bio__text">
            <h1 id="bio-title" className="serif bio__name">
              Jean Paul Diaz
            </h1>
            <p className="mono bio__role">web dev</p>
            <p className="bio__desc">
              Frontend developer at Brikl. I work with Next.js, React, GraphQL and Apollo Client, and I’m interested in how
              our craft changes when AI enters the workflow. What I learn, I share on humanoydev.
            </p>
            <div className="actions">
              <a href="#contact" className="btn btn--primary">
                Invite me to speak
              </a>
              <a href="#talks" className="btn btn--outline">
                See slides
              </a>
            </div>
          </div>
          {/* Ruta con /jean: funciona en local (/jean) y en el subdominio (el Worker sirve el asset). */}
          <Image
            src="/jean/images/foto-saco-680.jpg"
            width={680}
            height={850}
            alt="Jean Paul Diaz in a gray blazer with arms crossed"
            className="photo"
            priority
          />
        </section>

        <section id="talks" aria-labelledby="talks-title" className="container section">
          <h2 id="talks-title" className="section-title section-head">
            Talks and presentations
          </h2>
          <ol className="rows">{talks.slice(0, VISIBLE_TALKS).map(renderTalk)}</ol>
          {talks.length > VISIBLE_TALKS && (
            <details className="more">
              <summary className="text-link">
                <span className="more__open">See more talks</span>
                <span className="more__close">See less</span>
              </summary>
              <ol className="rows" start={VISIBLE_TALKS + 1}>
                {talks.slice(VISIBLE_TALKS).map(renderTalk)}
              </ol>
            </details>
          )}
        </section>

        <section id="projects" aria-labelledby="projects-title" className="container section">
          <h2 id="projects-title" className="section-title">
            Featured projects
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

        <section id="contact" aria-labelledby="contact-title" className="container section" style={{ paddingBottom: 112 }}>
          <div className="contact">
            <div style={{ flex: "1 1 460px", minWidth: 0 }}>
              <h2 id="contact-title" className="contact__title">
                Organizing an event?
              </h2>
              <p className="contact__desc">
                I give talks on AI Fluency, Claude Code and design-to-code workflows. Tell me the date, the audience and the
                format, and we’ll see if it’s a fit.
              </p>
            </div>
            <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn--light">
              Write to Jean
            </a>
          </div>
        </section>
      </main>

      <footer className="container site-footer">
        <p>© 2026 Jean Paul Diaz</p>
        <ul className="footer-links">
          <li>
            <a href={LINKEDIN_URL}>LinkedIn</a>
          </li>
          <li>
            <a href={`${SITE_URL}/en`}>Part of humanoydev.com</a>
          </li>
        </ul>
      </footer>
    </>
  );
}
