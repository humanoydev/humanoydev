"use client";

import { useEffect, useRef, useState } from "react";

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
type Registered = { element: HTMLElement; start: () => void; duration: number };
const registry = new Set<Registered>();

// Pausas de la función automática (ms): antes de la primera ronda, entre juguete y juguete
// de esa ronda, y después, cada cuánto reacciona uno de los que están a la vista.
const INTRO_DELAY = 800;
const INTRO_GAP = 250;
const INTERVAL = 6000;

// Juguetes a la vista (los ocultos miden 0), de arriba abajo y de izquierda a derecha.
function visibleToys() {
  return Array.from(registry)
    .map((toy) => ({ toy, rect: toy.element.getBoundingClientRect() }))
    .filter(({ rect }) => rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight)
    .sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left)
    .map(({ toy }) => toy);
}

// Al cargar, los juguetes a la vista reaccionan uno tras otro. Después, cada INTERVAL,
// reacciona uno de los que estén a la vista, por turnos.
export function ToyShow() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number;
    let turn = 0;

    const next = () => {
      const toys = visibleToys();
      if (toys.length) toys[turn++ % toys.length].start();
      timer = window.setTimeout(next, INTERVAL);
    };
    const intro = (toys: Registered[]) => {
      const [toy, ...rest] = toys;
      if (!toy) {
        timer = window.setTimeout(next, INTERVAL);
        return;
      }
      toy.start();
      timer = window.setTimeout(() => intro(rest), toy.duration + INTRO_GAP);
    };
    timer = window.setTimeout(() => intro(visibleToys()), INTRO_DELAY);
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}

type Props = {
  play: Play;
  // Posición, tamaño, animación de reposo y parallax del juguete.
  className: string;
  // Globo de diálogo que aparece mientras reacciona.
  bubble?: React.ReactNode;
  children: React.ReactNode;
};

export function Toy({ play, className, bubble, children }: Props) {
  const [playing, setPlaying] = useState(false);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const timer = useRef<number | undefined>(undefined);
  const busy = useRef(false);
  const element = useRef<HTMLSpanElement>(null);

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
    const toy = { element: element.current!, start: () => startRef.current(), duration: DURATION[play] };
    registry.add(toy);
    return () => {
      registry.delete(toy);
      window.clearTimeout(timer.current);
    };
  }, [play]);

  return (
    <span
      ref={element}
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
