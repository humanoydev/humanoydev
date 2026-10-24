"use client";

import { useEffect, useRef, useState } from "react";

type Props = { src: string; poster: string; label: string };

// Video de la ecografía en bucle y sin sonido, con botón de pausa (dura más de 5 s).
// Con "reducir movimiento" empieza en pausa.
export function UltrasoundVideo({ src, poster, label }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Si el navegador bloquea la reproducción automática, queda el póster y el botón.
    video.current?.play().catch(() => {});
  }, []);

  function toggle() {
    const el = video.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  }

  return (
    <div className="jpa__video">
      <video
        ref={video}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        className="jpa__video-toggle"
        onClick={toggle}
        aria-label={playing ? "Pausar video" : "Reproducir video"}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5.5v13l10.5-6.5z" />}
        </svg>
      </button>
    </div>
  );
}
