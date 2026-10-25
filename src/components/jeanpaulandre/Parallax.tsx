"use client";

import { useEffect } from "react";

// Parallax de la web de Jean Paul André. En cada dibujo con .jpa-px pone --px-offset: cuántos
// píxeles está su centro (sin contar el propio desplazamiento) del centro de la pantalla, y se
// desplaza una fracción de eso (globals.css), así que en el centro queda en su sitio. Se mide
// cada dibujo y no su escena: en una escena alta (p. ej. con la lista de regalos abierta), los
// dibujos de abajo se iban muy lejos del lugar donde están.
// Con "reducir movimiento" no hace nada y los dibujos quedan quietos.
export function Parallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(document.querySelectorAll<HTMLElement>(".jpa-px"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const center = window.innerHeight / 2;
      for (const item of items) {
        // offsetTop no incluye el translate del parallax: la medida no se mueve con el dibujo.
        const parent = item.offsetParent;
        if (!parent) continue;
        const middle = parent.getBoundingClientRect().top + item.offsetTop + item.offsetHeight / 2;
        item.style.setProperty("--px-offset", String(Math.round(middle - center)));
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Si la página cambia de alto sin scroll (p. ej. al abrir una categoría de regalos).
    const resizer = new ResizeObserver(schedule);
    resizer.observe(document.body);
    return () => {
      resizer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
