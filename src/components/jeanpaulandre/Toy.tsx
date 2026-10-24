"use client";

import { useEffect, useRef, useState } from "react";

// Juguetes de los costados: al pasar el mouse (o tocarlos en el celular) reaccionan.
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

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function start() {
    if (playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const range = MOVES[play];
    if (range) setOffset((current) => nextOffset(current, range));
    setPlaying(true);
    timer.current = window.setTimeout(() => setPlaying(false), DURATION[play]);
  }

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
