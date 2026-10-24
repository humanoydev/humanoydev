import type { Metadata } from "next";
import { DaysUntil } from "@/components/DaysUntil";
import { Toy } from "@/components/jeanpaulandre/Toy";
import {
  Balloons,
  Blocks,
  Cloud,
  Heart,
  HeroScene,
  HotAirBalloon,
  Kite,
  Star,
} from "@/components/jeanpaulandre/Doodles";
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

export default function JeanPaulAndrePage() {
  return (
    <>
      <header className="container jpa__top">
        <p className="jpa__brand">
          <Star className="jpa__brand-star" />
          Cápsula del tiempo
        </p>
        <p>Abierta en 2026</p>
      </header>

      <main>
        <section aria-labelledby="jpa-name">
          <HeroScene>
            <h1 id="jpa-name" className="jpa__name">
              Jean Paul <span className="jpa__name-accent">André</span>
            </h1>
            <p className="serif jpa__tagline">te estamos esperando.</p>
          </HeroScene>
        </section>

        <section aria-labelledby="jpa-letter" className="jpa-scene">
          <Toy play="float-away" className="jpa-deco jpa-deco--balloons jpa-px jpa-px--near">
            <Balloons />
          </Toy>
          <Toy play="puff" className="jpa-deco jpa-deco--cloud jpa-px jpa-px--far">
            <Cloud />
          </Toy>
          <Toy play="fly" className="jpa-deco jpa-deco--balloon-right jpa-px jpa-px--mid">
            <HotAirBalloon color="sky" />
          </Toy>
          <div className="container jpa__letter">
            <figure className="jpa__photo">
              <span className="jpa__tape jpa__tape--left" aria-hidden="true" />
              <span className="jpa__tape jpa__tape--right" aria-hidden="true" />
              <UltrasoundVideo src={ultrasound.video} poster={ultrasound.poster} label={ultrasound.label} />
              <figcaption className="serif jpa__photo-caption">{ultrasound.caption}</figcaption>
            </figure>
            <div className="jpa__letter-text">
              <h2 id="jpa-letter" className="jpa__label">
                Una carta para ti
              </h2>
              {letter.paragraphs.map((p) => (
                <p key={p} className="jpa__prose">
                  {p}
                </p>
              ))}
              <p className="serif jpa__sign">
                {letter.signature}
                <Heart className="jpa__heart" />
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="jpa-chapters" className="jpa-scene">
          <Toy play="loop" className="jpa-deco jpa-deco--kite jpa-px jpa-px--near">
            <Kite />
          </Toy>
          <Toy play="puff" className="jpa-deco jpa-deco--cloud-left jpa-px jpa-px--far">
            <Cloud />
          </Toy>
          <Toy play="tumble" className="jpa-deco jpa-deco--blocks jpa-px jpa-px--mid">
            <Blocks />
          </Toy>
          <div className="container jpa__chapters">
            <h2 id="jpa-chapters" className="jpa__label">
              Capítulos
            </h2>
            <ol className="jpa__chapter-list">
              {chapters.map((chapter) => (
                <li
                  key={chapter.numeral}
                  className={`jpa__chapter${chapter.href || chapter.countdownTo ? "" : " jpa__chapter--pending"}`}
                >
                  <p className="jpa__numeral" aria-hidden="true">
                    {chapter.numeral}
                  </p>
                  <div className="jpa__chapter-body">
                    <h3 className="jpa__chapter-title">
                      <span className="sr-only">Capítulo {chapter.numeral}: </span>
                      {chapter.href ? <a href={chapter.href}>{chapter.title}</a> : chapter.title}
                    </h3>
                    <p className="jpa__chapter-sub">{chapter.subtitle}</p>
                  </div>
                  <p className="jpa__chapter-status">
                    {chapter.countdownTo && (
                      <span className="jpa__countdown">
                        <DaysUntil date={chapter.countdownTo} />
                      </span>
                    )}
                    {chapter.status}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="container jpa__footer">
        <p>
          Hecha con amor por papá y mamá, 2026 <Heart className="jpa__heart" />
        </p>
        <a href={SITE_URL}>humanoydev.com</a>
      </footer>
    </>
  );
}
