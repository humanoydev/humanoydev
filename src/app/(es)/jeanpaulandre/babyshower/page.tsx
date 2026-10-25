import type { Metadata } from "next";
import { BackgroundMusic } from "@/components/jeanpaulandre/BackgroundMusic";
import { BubbleField } from "@/components/jeanpaulandre/BubbleField";
import { Heart, Star } from "@/components/jeanpaulandre/Doodles";
import { Invitation } from "@/components/jeanpaulandre/Invitation";
import { Parallax } from "@/components/jeanpaulandre/Parallax";
import { ToyShow } from "@/components/jeanpaulandre/Toy";
import { BABY_NAME, babyShower, ogImage } from "@/content/jeanpaulandre";
import { JEANPAULANDRE_URL } from "@/content/site";

const title = `Baby shower de ${BABY_NAME}`;
const description = `${babyShower.dateLabel}. Te invitamos a celebrar la llegada de ${BABY_NAME}.`;

// Se sirve en jeanpaulandre.humanoydev.com/babyshower. Cada invitado entra con su link (?i=...).
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  robots: { index: false, follow: false },
  alternates: { canonical: `${JEANPAULANDRE_URL}/babyshower` },
  openGraph: {
    type: "website",
    locale: "es_PE",
    title,
    description,
    url: `${JEANPAULANDRE_URL}/babyshower`,
    images: [{ ...ogImage, url: `${JEANPAULANDRE_URL}${ogImage.path}` }],
  },
};

export default function BabyShowerPage() {
  return (
    <>
      <BubbleField />
      <Parallax />
      <ToyShow />
      <header className="container jpa__top">
        {/* <a> y no <Link>: en el subdominio "/" es la portada del bebé (la reescribe el Worker),
            y <Link> navegaría en el cliente a la portada de humanoydev. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="jpa__brand">
          <Star className="jpa__brand-star" />
          {BABY_NAME}
        </a>
        <p>Capítulo I · La espera</p>
      </header>

      <main>
        <Invitation />
      </main>

      <footer className="container jpa__footer">
        <p>
          Con amor, papá y mamá <Heart className="jpa__heart" />
        </p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">Visita la web de {BABY_NAME}</a>
      </footer>

      <BackgroundMusic />
    </>
  );
}
