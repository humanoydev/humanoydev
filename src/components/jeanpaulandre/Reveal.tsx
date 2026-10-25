"use client";

import { useEffect } from "react";

// Portada (cápsula del tiempo): los bloques .jpc-reveal aparecen suavemente al llegar a la
// pantalla. Sin JavaScript o con "reducir movimiento" se ven desde el principio: la clase
// .jpc--motion, que los esconde, solo la pone este componente.
export function Reveal() {
  useEffect(() => {
    const root = document.querySelector(".jpc");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.classList.add("jpc--motion");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    root.querySelectorAll(".jpc-reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
