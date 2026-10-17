import type { Metadata } from "next";
import { openGraphEn } from "@/app/shared-metadata";
import { pageAlternates } from "@/content/i18n";
import { CONTACT_EMAIL, JEAN_URL } from "@/content/site";

const description = "The vision behind humanoydev, who’s behind it and how to get involved.";

export const metadata: Metadata = {
  title: "About",
  description,
  openGraph: { ...openGraphEn, title: "About · humanoydev", description, url: "/en/about" },
  alternates: pageAlternates("/en/about", "en"),
};

export default function AboutPage() {
  return (
    <div className="container page">
      <h1 className="page-title">About</h1>
      <p className="serif question">What does it mean to be a good developer when AI writes much of the code?</p>
      <p className="prose">
        humanoydev was born from that question. We believe the answer is judgment: knowing what to ask for, giving the
        right context, verifying what gets delivered and owning the result. Here we share what that looks like in
        day-to-day work.
      </p>

      <div className="columns">
        <section aria-labelledby="nombre-title" className="column">
          <h2 id="nombre-title">One name, two readings</h2>
          <p>
            In Spanish it reads{" "}
            <span lang="es" className="ink">
              humano y dev
            </span>{" "}
            (human and dev). In English, <span className="ink">humanoid dev</span>. Both are true: we are people who
            work more and more alongside machines.
          </p>
        </section>

        <section aria-labelledby="quien-title" className="column">
          <h2 id="quien-title">Who’s behind it</h2>
          <p>
            Jean Paul Diaz, web dev. Frontend developer at Brikl, working with Next.js, React, GraphQL and Apollo Client,
            and giving talks on AI Fluency and Claude Code.
          </p>
          <a href={`${JEAN_URL}/en`} className="text-link" style={{ marginTop: 8 }}>
            Go to jean.humanoydev.com
          </a>
        </section>

        <section aria-labelledby="participar-title" className="column">
          <h2 id="participar-title">How to get involved</h2>
          <ul>
            <li>Suggest a topic or a collaboration.</li>
            <li>Share your experiments with AI.</li>
            <li>Join the newsletter when it opens.</li>
          </ul>
          <p className="ink" style={{ fontSize: 17 }}>
            Write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </section>
      </div>
    </div>
  );
}
