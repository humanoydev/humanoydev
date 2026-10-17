import type { Metadata } from "next";
import { openGraphBase } from "@/app/shared-metadata";
import { CONTACT_EMAIL, JEAN_URL } from "@/content/site";

const description = "La visión de humanoydev, quién está detrás y cómo participar.";

export const metadata: Metadata = {
  title: "Acerca de",
  description,
  openGraph: { ...openGraphBase, title: "Acerca de · humanoydev", description, url: "/acerca" },
};

export default function AboutPage() {
  return (
    <div className="container page">
      <h1 className="page-title">Acerca de</h1>
      <p className="serif question">
        ¿Qué significa ser buen desarrollador cuando la IA escribe buena parte del código?
      </p>
      <p className="prose">
        humanoydev nace de esa pregunta. Creemos que la respuesta está en el criterio: saber qué pedir, dar el contexto
        correcto, verificar lo que se entrega y hacerse cargo del resultado. Aquí compartimos cómo se ve eso en el
        trabajo diario.
      </p>

      <div className="columns">
        <section aria-labelledby="nombre-title" className="column">
          <h2 id="nombre-title">Un nombre, dos lecturas</h2>
          <p>
            En español se lee <span className="ink">humano y dev</span>. En inglés,{" "}
            <span lang="en" className="ink">
              humanoid dev
            </span>
            . Las dos son ciertas: somos personas que trabajan cada vez más junto a máquinas.
          </p>
        </section>

        <section aria-labelledby="quien-title" className="column">
          <h2 id="quien-title">Quién está detrás</h2>
          <p>
            Jean Paul Diaz, web dev. Frontend developer en Brikl, trabaja con Next.js, React, GraphQL y Apollo Client, y
            da charlas sobre AI Fluency y Claude Code.
          </p>
          <a href={JEAN_URL} className="text-link" style={{ marginTop: 8 }}>
            Ir a jean.humanoydev.com
          </a>
        </section>

        <section aria-labelledby="participar-title" className="column">
          <h2 id="participar-title">Cómo participar</h2>
          <ul>
            <li>Propón un tema o una colaboración.</li>
            <li>Comparte tus experimentos con IA.</li>
            <li>Súmate a la newsletter cuando abra.</li>
          </ul>
          <p className="ink" style={{ fontSize: 17 }}>
            Escribe a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </section>
      </div>
    </div>
  );
}
