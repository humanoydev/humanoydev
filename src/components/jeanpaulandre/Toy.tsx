"use client";

import { useEffect, useRef, useState } from "react";
import { BAR_EVENT, type BarDetail } from "./BackgroundMusic";
import { OPENED } from "./Envelope";

// Juguetes de los costados: al pasar el mouse (o tocarlos en el celular) reaccionan,
// y también solos (ToyShow).
// Cada `play` es una reacción en globals.css (.jpa-toy--<play>); las que tienen
// rango en MOVES además se mudan a otro sitio cerca de donde estaban.
type Play = "fly" | "float-away" | "loop" | "tumble" | "hop" | "waddle" | "trumpet" | "puff" | "wobble";

const MOVES: Partial<Record<Play, { x: number; y: number }>> = {
  fly: { x: 140, y: 70 },
  hop: { x: 120, y: 0 },
  waddle: { x: 110, y: 0 },
  puff: { x: 160, y: 40 },
};

// Lo que dura cada reacción (ms); mientras dura, el juguete no vuelve a reaccionar.
const DURATION: Record<Play, number> = {
  fly: 1500,
  "float-away": 2600,
  loop: 1200,
  tumble: 1200,
  hop: 900,
  waddle: 1600,
  trumpet: 1600,
  puff: 1600,
  wobble: 1000,
};

type Offset = { x: number; y: number };

// Los juguetes con `dance` (los globos) reaccionan en cada compás de la música (BAR_EVENT);
// si su animación dura más que un compás, siguen en el siguiente que los encuentre libres.
// Mientras suena la música no siguen las pausas de ToyShow: solo bailan con ella.
// Arrancan antes del compás para que lo más marcado de su animación caiga en el tiempo fuerte:
// fly se inclina al 30 % (≈ un tiempo, 1/3 de compás); float-away vuelve a su sitio al final.
const ACCENT: Partial<Record<Play, (bar: number) => number>> = {
  fly: (bar) => bar / 3,
  "float-away": () => DURATION["float-away"],
};
let lastBar = 0;
const dancing = () => performance.now() - lastBar < 2000;

// Un sitio al azar cerca del original y lejos del actual, para que se note que se mudó.
function nextOffset(current: Offset, range: Offset): Offset {
  for (let i = 0; i < 10; i++) {
    const x = Math.round((Math.random() * 2 - 1) * range.x);
    const y = Math.round((Math.random() * 2 - 1) * range.y);
    if (Math.abs(x - current.x) > range.x / 2) return { x, y };
  }
  return { x: -current.x, y: -current.y };
}

// Juguetes en la página, para que ToyShow los haga reaccionar solos.
type Registered = { start: () => void; duration: number };
const registry = new Set<Registered>();

// La función automática: al abrir el sobre reaccionan todos a la vez (bienvenida) y después cada uno
// se repite cada vez más espaciado, con pausas de Fibonacci (2, 3, 5, 8, 13… s) contadas
// desde que termina su animación anterior.
const WELCOME_DELAY = 800;
const FIRST_PAUSE = [2000, 3000];

export function ToyShow() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        fn();
      }, ms);
      timers.add(timer);
    };
    const repeat = (toy: Registered, [pause, next]: number[]) => {
      toy.start();
      later(() => repeat(toy, [next, pause + next]), toy.duration + pause);
    };
    const welcome = () => later(() => registry.forEach((toy) => repeat(toy, FIRST_PAUSE)), WELCOME_DELAY);
    window.addEventListener(OPENED, welcome, { once: true });
    return () => {
      window.removeEventListener(OPENED, welcome);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return null;
}

type Props = {
  play: Play;
  // Posición, tamaño, animación de reposo y parallax del juguete.
  className: string;
  // Globo de diálogo que aparece mientras reacciona.
  bubble?: React.ReactNode;
  // Reacciona en cada compás de la música.
  dance?: boolean;
  children: React.ReactNode;
};

export function Toy({ play, className, bubble, dance = false, children }: Props) {
  const [playing, setPlaying] = useState(false);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const timer = useRef<number | undefined>(undefined);
  const busy = useRef(false);

  function start() {
    if (busy.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const range = MOVES[play];
    if (range) setOffset((current) => nextOffset(current, range));
    busy.current = true;
    setPlaying(true);
    timer.current = window.setTimeout(() => {
      busy.current = false;
      setPlaying(false);
    }, DURATION[play]);
  }
  const startRef = useRef(start);
  useEffect(() => {
    startRef.current = start;
  });

  useEffect(() => {
    const toy = { start: () => (dance && dancing() ? undefined : startRef.current()), duration: DURATION[play] };
    registry.add(toy);
    const beats = new Set<number>();
    const onBar = (event: Event) => {
      const { at, bar } = (event as CustomEvent<BarDetail>).detail;
      const now = performance.now();
      lastBar = now;
      let when = at - (ACCENT[play]?.(bar) ?? 0);
      while (when < now) when += bar;
      const beat = window.setTimeout(() => {
        beats.delete(beat);
        startRef.current();
      }, when - now);
      beats.add(beat);
    };
    if (dance) window.addEventListener(BAR_EVENT, onBar);
    return () => {
      registry.delete(toy);
      window.removeEventListener(BAR_EVENT, onBar);
      beats.forEach((beat) => window.clearTimeout(beat));
      window.clearTimeout(timer.current);
    };
  }, [play, dance]);

  return (
    <span
      className={`jpa-toy jpa-toy--${play}${playing ? " is-playing" : ""} ${className}`}
      style={{ "--toy-x": `${offset.x}px`, "--toy-y": `${offset.y}px` } as React.CSSProperties}
      // Mouse: al pasar por encima. Dedo o lápiz: al tocar (el click llega después del pointerenter).
      onPointerEnter={(event) => event.pointerType === "mouse" && start()}
      onClick={start}
      aria-hidden="true"
    >
      <span className="jpa-toy__move">
        <span className="jpa-toy__react">{children}</span>
        {bubble && <span className="jpa-toy__bubble">{bubble}</span>}
      </span>
    </span>
  );
}
