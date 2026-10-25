"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Star } from "./Doodles";

// Portada de la invitación: un sobre cerrado que se abre al tocarlo. Ese toque es el gesto que
// los navegadores piden para que suene la música (BackgroundMusic lo escucha en toda la
// página), y al abrirse avisa con el evento OPENED para que empiece la función de los juguetes.
// Viene en el HTML estático, para que la invitación no se asome antes; sin JavaScript se esconde.
export const OPENED = "jpa:opened";
const OPEN_MS = 1900;

export function Envelope({ name }: { name?: string }) {
  const [state, setState] = useState<"closed" | "opening" | "open">("closed");
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (state === "open") return;
    button.current?.focus();
    // Mientras está cerrado, la página de atrás no se mueve.
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [state]);

  function open() {
    if (state !== "closed") return;
    setState("opening");
    window.scrollTo(0, 0);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(
      () => {
        setState("open");
        window.dispatchEvent(new Event(OPENED));
      },
      reduced ? 300 : OPEN_MS,
    );
  }

  if (state === "open") return null;
  return (
    <div
      className={`jpa-envelope${state === "opening" ? " is-opening" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="jpa-envelope-title"
    >
      <noscript>
        <style>{".jpa-envelope { display: none; }"}</style>
      </noscript>
      <Star className="jpa-envelope__star jpa-envelope__star--1" />
      <Star className="jpa-envelope__star jpa-envelope__star--2" />
      <Star className="jpa-envelope__star jpa-envelope__star--3" />
      <p id="jpa-envelope-title" className="jpa-envelope__title">
        {name ? `${name}, tienes una invitación` : "Tienes una invitación"}
      </p>
      <button ref={button} type="button" className="jpa-envelope__button" onClick={open}>
        <span className="jpa-envelope__paper" aria-hidden="true">
          <span className="jpa-envelope__card">
            Baby shower
            <strong>Jean Paul André</strong>
          </span>
          <span className="jpa-envelope__pocket" />
          <span className="jpa-envelope__flap" />
          <span className="jpa-envelope__seal">
            <Heart />
          </span>
        </span>
        <span className="jpa-envelope__cta">Toca para abrirla</span>
      </button>
    </div>
  );
}
