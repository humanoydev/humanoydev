import { midi, type Note, type Song, type Voice } from "./music";

// Mozart, Sonata para piano n.º 16 en do mayor, K. 545, primer movimiento (la partitura es de
// dominio público): el tema y las escalas de los compases 1 a 8, con un cierre corto para que
// vuelva a empezar. Más lenta que el Allegro original, como de cajita de música.

// Pasos de semicorchea: un compás de 4/4 son 16.
const BAR = 16;
// Negras por minuto (el Allegro va a unas 130).
const TEMPO = 72;

// Compás de escalas en semicorcheas: sube una octava desde `from` ("A4") y baja hasta la nota de
// abajo de `from`, donde empieza la escala del compás siguiente.
function run(from: string) {
  const names = "CDEFGAB";
  const start = Number(from[1]) * 7 + names.indexOf(from[0]);
  return Array.from({ length: 16 }, (_, i) => {
    const degree = start + (i < 8 ? i : 14 - i);
    return `${names[degree % 7]}${Math.floor(degree / 7)}:1`;
  }).join(" ");
}

// "nota:duración" en semicorcheas, "-" es silencio, "|" separa compases.
const RIGHT = `
  C5:8 E5:4 G5:4 | B4:6 C5:1 D5:1 C5:8 | A5:8 G5:4 C6:4 | G5:4 F5:2 E5:1 F5:1 E5:8 |
  ${run("A4")} | ${run("G4")} | ${run("F4")} | ${run("E4")} |
  G4:4 B4:4 D5:4 F5:4 | E5:4 D5:4 C5:8
`;

// Bajo Alberti en corcheas (compases 1–4), bajos largos bajo las escalas y el cierre.
const LEFT = `
  C4:2 G4:2 E4:2 G4:2 C4:2 G4:2 E4:2 G4:2 | D4:2 G4:2 F4:2 G4:2 C4:2 G4:2 E4:2 G4:2 |
  C4:2 A4:2 F4:2 A4:2 C4:2 G4:2 E4:2 G4:2 | B3:2 G4:2 D4:2 G4:2 C4:2 G4:2 E4:2 G4:2 |
  F3:8 A3:8 | E3:8 G3:8 | D3:8 F3:8 | C3:8 E3:8 |
  G3:2 D4:2 B3:2 D4:2 G3:2 F4:2 B3:2 F4:2 | C4:2 G4:2 E4:2 G4:2 C3:8
`;

// La primera nota de cada compás de la mano izquierda es el bajo (marca el compás); las demás,
// el acompañamiento, más suave.
function parse(text: string, voice: (at: number) => Voice) {
  const notes: Note[] = [];
  let at = 0;
  for (const token of text.split(/[\s|]+/).filter(Boolean)) {
    const [name, length] = token.split(":");
    if (name !== "-") notes.push({ at, midi: midi(name), voice: voice(at) });
    at += Number(length);
  }
  return { notes, length: at };
}

const right = parse(RIGHT, () => "melody");
const left = parse(LEFT, (at) => (at % 8 === 0 ? "bass" : "chord"));

export const SONATA: Song = {
  notes: [...right.notes, ...left.notes].sort((a, b) => a.at - b.at),
  length: Math.max(right.length, left.length),
  bar: BAR,
  step: 60 / TEMPO / 4,
};
