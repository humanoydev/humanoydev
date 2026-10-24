"use client";

import { useEffect } from "react";

// Parallax de la web de Jean Paul André. En cada escena (.jpa-scene) pone --scene-offset:
// cuántos píxeles está su centro del centro de la pantalla. Los dibujos con .jpa-px--*
// se desplazan una fracción de eso (globals.css), así que en el centro quedan en su sitio.
// Con "reducir movimiento" no hace nada y los dibujos quedan quietos.
export function Parallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const scenes = Array.from(document.querySelectorAll<HTMLElement>(".jpa-scene"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const center = window.innerHeight / 2;
      for (const scene of scenes) {
        const rect = scene.getBoundingClientRect();
        scene.style.setProperty("--scene-offset", String(Math.round(rect.top + rect.height / 2 - center)));
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
