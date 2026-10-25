"use client";

import { useEffect, useRef, useState } from "react";

// Musiquita de fondo: un vals original de cajita de música, sintetizada con Web Audio
// (sin archivos ni licencias). Los navegadores no dejan sonar audio hasta que la persona
// toca la página, así que arranca con el primer toque o tecla. El botón la silencia y la
// preferencia queda guardada en el navegador.

const TEMPO = 144;
const VOLUME = 0.5;
const STORAGE_KEY = "jpa-music";

// Melodía en corcheas: "nota:duración", "-" es silencio; un compás de 3/4 (6 corcheas) por bloque.
const BAR = 6;
const MELODY = `
  D5:2 G5:2 B5:2 | D6:3 B5:1 G5:2 | E5:2 G5:2 C6:2 | B5:4 A5:1 G5:1 |
  G5:2 B5:2 E6:2 | C6:3 B5:1 A5:2 | F#5:2 A5:2 D6:2 | A5:4 -:2 |
  B5:2 D6:2 G6:2 | F#6:1 G6:1 D6:2 B5:2 | C6:2 E6:2 G5:2 | A5:2 C6:2 E6:2 |
  D6:3 B5:1 G5:2 | A5:2 C6:1 B5:1 A5:2 | G5:4 B5:1 A5:1 | G5:4 -:2
`;
const CHORDS = "G G C G Em Am D D G G C Am G D G G".split(" ");
// Bajo (fundamental y quinta) y las dos notas del acorde.
const CHORD_NOTES: Record<string, string[]> = {
  G: ["G2", "D3", "B3", "D4"],
  C: ["C3", "G2", "E3", "G3"],
  D: ["D3", "A2", "F#3", "A3"],
  Em: ["E3", "B2", "G3", "B3"],
  Am: ["A2", "E3", "C4", "E4"],
};
// Acompañamiento de vals: [corchea del compás, notas de CHORD_NOTES] (bajo, acorde, acorde).
const PATTERN: [number, number[]][] = [
  [0, [0]],
  [2, [2, 3]],
  [4, [2, 3]],
];

type Voice = "melody" | "bass" | "chord";
type Note = { at: number; midi: number; voice: Voice };

const SEMITONES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
// "Bb3" → 58 (número MIDI). La alteración es opcional.
const midi = (name: string) =>
  12 * (Number(name.slice(-1)) + 1) + SEMITONES[name[0]] + (name[1] === "b" ? -1 : name[1] === "#" ? 1 : 0);

function buildSong() {
  const notes: Note[] = [];
  let at = 0;
  for (const token of MELODY.split(/[\s|]+/).filter(Boolean)) {
    const [name, length] = token.split(":");
    if (name !== "-") notes.push({ at, midi: midi(name), voice: "melody" });
    at += Number(length);
  }
  CHORDS.forEach((chord, bar) =>
    PATTERN.forEach(([step, indexes]) =>
      indexes.forEach((i) =>
        notes.push({ at: bar * BAR + step, midi: midi(CHORD_NOTES[chord][i]), voice: i < 2 ? "bass" : "chord" }),
      ),
    ),
  );
  return { notes: notes.sort((a, b) => a.at - b.at), length: CHORDS.length * BAR };
}

// Sonido de cajita: senos con un parcial inarmónico (campanita) que se apagan rápido.
const VOICES: Record<Voice, { peak: number; decay: number; partials: [number, number][] }> = {
  melody: { peak: 0.22, decay: 1.6, partials: [[1, 1], [2, 0.3], [3, 0.1], [4.2, 0.08]] },
  bass: { peak: 0.16, decay: 1.2, partials: [[1, 1], [2, 0.25]] },
  chord: { peak: 0.06, decay: 0.9, partials: [[1, 1], [2, 0.2]] },
};

function playNote(ctx: AudioContext, out: AudioNode, note: Note, time: number) {
  const { peak, decay, partials } = VOICES[note.voice];
  const freq = 440 * 2 ** ((note.midi - 69) / 12);
  for (const [ratio, amp] of partials) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const length = ratio > 1 ? decay / 2 : decay;
    osc.frequency.value = freq * ratio;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(peak * amp, time + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + length);
    osc.connect(gain).connect(out);
    osc.start(time);
    osc.stop(time + length + 0.05);
  }
}

// Eco suave: respuesta de impulso hecha con ruido que se apaga.
function reverb(ctx: AudioContext) {
  const length = ctx.sampleRate * 2;
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
  }
  const convolver = ctx.createConvolver();
  convolver.buffer = impulse;
  return convolver;
}

function readPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function savePreference(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {}
}

export function BackgroundMusic() {
  const [state, setState] = useState<"off" | "waiting" | "on">("off");
  const toggleRef = useRef<() => void>(() => {});

  useEffect(() => {
    let wanted = readPreference() !== "off";
    // El contexto de audio se crea dentro del primer toque: así Safari y Chrome lo dejan sonar.
    let ctx: AudioContext | null = null;
    let scheduler = 0;
    let beatFrame = 0;
    const update = () => setState(!wanted ? "off" : ctx?.state === "running" ? "on" : "waiting");

    function setup() {
      // En iPhone, Web Audio respeta el botón de silencio salvo que se declare como "playback".
      const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
      if (session) session.type = "playback";

      const audio = new AudioContext();
      const master = audio.createGain();
      const bus = audio.createGain();
      const wet = audio.createGain();
      master.gain.value = 0;
      wet.gain.value = 0.3;
      bus.connect(master);
      bus.connect(reverb(audio)).connect(wet).connect(master);
      master.connect(audio.destination);

      const fadeIn = () => {
        master.gain.cancelScheduledValues(audio.currentTime);
        master.gain.setValueAtTime(0, audio.currentTime);
        master.gain.linearRampToValueAtTime(VOLUME, audio.currentTime + 1.5);
      };
      const song = buildSong();
      const step = 60 / TEMPO / 2;
      let index = 0;
      let loopStart = audio.currentTime + 0.1;
      const songStart = loopStart;

      // Los globos (.jpa-beat) laten con cada pulso: --pulse salta a 1 en el tiempo fuerte del
      // compás (0,6 en los otros dos) y se apaga antes del siguiente. Se calcula con el reloj del
      // audio, no con timers, para que no se desfase; solo mientras suena.
      const balloons = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? []
        : Array.from(document.querySelectorAll<HTMLElement>(".jpa-beat"));
      const pulse = () => {
        const latency = audio.outputLatency || audio.baseLatency || 0;
        const beats = (audio.currentTime - latency - songStart) / (step * 2);
        const beat = Math.floor(beats);
        const value = beats < 0 ? 0 : Math.exp(-(beats - beat) * 5) * (beat % 3 === 0 ? 1 : 0.6);
        balloons.forEach((balloon) => balloon.style.setProperty("--pulse", value.toFixed(3)));
        beatFrame = requestAnimationFrame(pulse);
      };
      const syncBeat = () => {
        cancelAnimationFrame(beatFrame);
        if (audio.state === "running" && balloons.length) beatFrame = requestAnimationFrame(pulse);
        else balloons.forEach((balloon) => balloon.style.removeProperty("--pulse"));
      };

      audio.onstatechange = () => {
        if (audio.state === "running") fadeIn();
        syncBeat();
        update();
      };
      if (audio.state === "running") fadeIn();
      syncBeat();
      // Programa las notas de los próximos 0,4 s (con el contexto en pausa, el reloj no avanza).
      scheduler = window.setInterval(() => {
        while (true) {
          const note = song.notes[index];
          const time = loopStart + note.at * step;
          if (time > audio.currentTime + 0.4) break;
          if (time >= audio.currentTime) playNote(audio, bus, note, time);
          index++;
          if (index === song.notes.length) {
            index = 0;
            loopStart += song.length * step;
          }
        }
      }, 100);
      return audio;
    }

    const start = () => {
      if (!wanted || document.hidden) return;
      ctx ??= setup();
      if (ctx.state !== "running") ctx.resume().catch(() => {});
      update();
    };

    toggleRef.current = () => {
      wanted = !(wanted && ctx?.state === "running");
      savePreference(wanted);
      if (wanted) start();
      else ctx?.suspend();
      update();
    };

    // El primer toque en cualquier parte (menos el botón, que tiene su propia acción) la enciende.
    // En la invitación, ese primer toque es el de abrir el sobre (Envelope).
    const onGesture = (event: Event) => {
      if (!(event.target instanceof Element && event.target.closest(".jpa-music"))) start();
    };
    // Al cambiar de pestaña o de app, se calla.
    const onVisibility = () => (document.hidden ? ctx?.suspend() : ctx && start());
    const gestures = ["pointerdown", "pointerup", "mousedown", "click", "touchend", "keydown"];
    gestures.forEach((name) => window.addEventListener(name, onGesture, true));
    document.addEventListener("visibilitychange", onVisibility);
    update();

    return () => {
      clearInterval(scheduler);
      cancelAnimationFrame(beatFrame);
      gestures.forEach((name) => window.removeEventListener(name, onGesture, true));
      document.removeEventListener("visibilitychange", onVisibility);
      ctx?.close();
    };
  }, []);

  const on = state === "on";
  return (
    <button
      type="button"
      className={`jpa-music jpa-music--${state}`}
      onClick={() => toggleRef.current()}
      aria-pressed={on}
      aria-label={on ? "Silenciar la música" : undefined}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 17.5V6l10-2v11.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="6.5" cy="17.5" r="2.5" />
        <circle cx="16.5" cy="15.5" r="2.5" />
        {state === "off" && <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
      </svg>
      {!on && <span className="jpa-music__label">Poner música</span>}
    </button>
  );
}
