// Piezas comunes de la musiquita de fondo (BackgroundMusic.tsx) y sus canciones. Sin "use client":
// la portada importa su canción (sonata.ts) en el servidor y se la pasa al componente.

export type Voice = "melody" | "bass" | "chord";
export type Note = { at: number; midi: number; voice: Voice };
// `at`, `length` y `bar` van en pasos; `step` es cuánto dura un paso, en segundos.
export type Song = { notes: Note[]; length: number; bar: number; step: number };

const SEMITONES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
// "Bb3" → 58 (número MIDI). La alteración es opcional.
export const midi = (name: string) =>
  12 * (Number(name.slice(-1)) + 1) + SEMITONES[name[0]] + (name[1] === "b" ? -1 : name[1] === "#" ? 1 : 0);
