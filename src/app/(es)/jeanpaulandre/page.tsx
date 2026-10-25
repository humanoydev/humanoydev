import type { Metadata } from "next";
import { DaysUntil } from "@/components/DaysUntil";
import { Star } from "@/components/jeanpaulandre/Doodles";
import { Reveal } from "@/components/jeanpaulandre/Reveal";
import { UltrasoundVideo } from "@/components/jeanpaulandre/UltrasoundVideo";
import { BABY_NAME, chapters, letter, ogImage, ultrasound } from "@/content/jeanpaulandre";
import { JEANPAULANDRE_URL, SITE_URL } from "@/content/site";

const description = "La web de Jean Paul André: una cápsula del tiempo que empezamos mientras lo esperábamos.";

// Esta ruta se sirve en jeanpaulandre.humanoydev.com: el Worker reescribe "/" a "/jeanpaulandre".
// No se indexa: es la web de un menor y solo la compartimos con familia y amigos.
export const metadata: Metadata = {
  title: { absolute: BABY_NAME },
  description,
  robots: { index: false, follow: false },
  alternates: { canonical: JEANPAULANDRE_URL },
  openGraph: {
    type: "website",
    locale: "es_PE",
    title: BABY_NAME,
    description,
    url: JEANPAULANDRE_URL,
    images: [{ ...ogImage, url: `${JEANPAULANDRE_URL}${ogImage.path}` }],
  },
};

function Lock() {
  return (
    <svg viewBox="0 0 24 24" className="jpc-lock" aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="10" rx="3" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" />
    </svg>
  );
}

// Portada: la cápsula del tiempo. Tiene su propia línea gráfica (.jpc, estilo álbum de
// recuerdos en azul y lavanda), distinta de la invitación del baby shower.
export default function JeanPaulAndrePage() {
  const next = chapters.find((chapter) => chapter.countdownTo);

  return (
    <div className="jpc">
      <Reveal />
      <header className="container jpc-top">
        <p className="jpc-brand">
          <span className="jpc-monogram" aria-hidden="true">
            JPA
          </span>
          Cápsula del tiempo
        </p>
        <p>Abierta en 2026</p>
      </header>

      <main>
        <section className="container jpc-cover" aria-labelledby="jpc-name">
          <div className="jpc-cover__text">
            <p className="jpc-kicker">Te soñamos antes de conocerte</p>
            <h1 id="jpc-name" className="jpc-name">
              Jean Paul <em>André</em>
            </h1>
            <p className="jpc-tagline">te estamos esperando.</p>
          </div>
          <figure className="jpc-arch">
            <Star className="jpc-star jpc-star--1" />
            <Star className="jpc-star jpc-star--2" />
            <Star className="jpc-star jpc-star--3" />
            <div className="jpc-arch__frame">
              <UltrasoundVideo src={ultrasound.video} poster={ultrasound.poster} label={ultrasound.label} />
            </div>
            <figcaption className="jpc-hand jpc-arch__note">aquí estás tú · {ultrasound.caption}</figcaption>
          </figure>
        </section>

        <section className="container" aria-label="Datos de la cápsula">
          <dl className="jpc-facts jpc-reveal">
            <div>
              <dt>Abierta</dt>
              <dd>2026</dd>
            </div>
            <div>
              <dt>Capítulos</dt>
              <dd>{chapters.length}</dd>
            </div>
            {next && (
              <div>
                <dt>Próximo momento</dt>
                <dd>
                  {next.title}
                  {next.countdownTo && (
                    <span className="jpc-hand jpc-facts__count">
                      <DaysUntil date={next.countdownTo} />
                    </span>
                  )}
                </dd>
              </div>
            )}
            <div>
              <dt>Hecha por</dt>
              <dd>Papá y mamá</dd>
            </div>
          </dl>
        </section>

        <section className="container jpc-letter-wrap" aria-labelledby="jpc-letter">
          <article className="jpc-letter jpc-reveal">
            <span className="jpc-stamp" aria-hidden="true">
              <Star />
            </span>
            <p className="jpc-kicker">Para Jean Paul André</p>
            <h2 id="jpc-letter" className="jpc-title">
              Una carta para ti
            </h2>
            {letter.paragraphs.map((p) => (
              <p key={p} className="jpc-letter__p">
                {p}
              </p>
            ))}
            <p className="jpc-hand jpc-letter__sign">{letter.signature}</p>
          </article>
        </section>

        <section className="container jpc-chapters" aria-labelledby="jpc-chapters">
          <p className="jpc-kicker">Índice</p>
          <h2 id="jpc-chapters" className="jpc-title">
            Capítulos
          </h2>
          <ol className="jpc-timeline">
            {chapters.map((chapter) => {
              const open = Boolean(chapter.href || chapter.countdownTo);
              return (
                <li key={chapter.numeral} className={`jpc-chapter${open ? "" : " is-locked"}`}>
                  <span className="jpc-chapter__dot" aria-hidden="true">
                    {chapter.numeral}
                  </span>
                  <div className="jpc-chapter__card jpc-reveal">
                    <p className="jpc-kicker">Capítulo {chapter.numeral}</p>
                    <h3 className="jpc-chapter__title">{chapter.title}</h3>
                    <p className="jpc-chapter__sub">{chapter.subtitle}</p>
                    {chapter.countdownTo && (
                      <p className="jpc-hand jpc-chapter__count">
                        <DaysUntil date={chapter.countdownTo} />
                      </p>
                    )}
                    {chapter.href ? (
                      <a href={chapter.href} className="jpc-button">
                        {chapter.status} <span aria-hidden="true">→</span>
                      </a>
                    ) : (
                      <p className="jpc-chapter__lock">
                        <Lock />
                        {chapter.status}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="jpc-hand jpc-continue">continuará…</p>
        </section>
      </main>

      <footer className="container jpc-footer">
        <p>Hecha con amor por papá y mamá, 2026</p>
        <a href={SITE_URL}>humanoydev.com</a>
      </footer>
    </div>
  );
}
