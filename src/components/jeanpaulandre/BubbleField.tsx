"use client";

import { useEffect, useRef } from "react";

// Fondo interactivo: burbujas de jabón que suben por toda la página (un solo lienzo, para
// que no se corten entre secciones; el encabezado las tapa con su cielo). Se apartan del
// cursor y revientan en estrellitas al tocarlas (o al pasar el mouse muy cerca).
// Escucha los eventos en todo su contenedor, así funciona también encima de las tarjetas.
// Solo dibuja las burbujas que están en pantalla; con "reducir movimiento" no se dibuja.

type Bubble = { x: number; y: number; r: number; speed: number; phase: number; color: string };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string };

const COLORS = ["#d6e8f5", "#fbdccb", "#dbe9d2", "#f8e6a8", "#f6c1b5"];
const SPARK_COLORS = ["#f2c14e", "#e98a6d", "#8fb6d9", "#9cc28a"];

function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.45;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
  }
  ctx.closePath();
  ctx.fill();
}

export function BubbleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !section || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0;
    let height = 0;
    let bubbles: Bubble[] = [];
    let sparks: Spark[] = [];
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    let visible = false;

    const random = (min: number, max: number) => min + Math.random() * (max - min);
    const newBubble = (y = height + random(20, 120)): Bubble => ({
      x: random(0, width),
      y,
      r: random(10, 30),
      speed: random(0.35, 0.95),
      phase: random(0, Math.PI * 2),
      color: COLORS[Math.floor(random(0, COLORS.length))],
    });

    // Revienta la burbuja en (x, y) y la vuelve a lanzar desde abajo.
    const pop = (bubble: Bubble, x = bubble.x) => {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + random(-0.2, 0.2);
        const speed = random(1.5, 3.5);
        sparks.push({
          x,
          y: bubble.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color: SPARK_COLORS[i % SPARK_COLORS.length],
        });
      }
      Object.assign(bubble, newBubble());
    };

    const resize = () => {
      width = section.clientWidth;
      height = section.clientHeight;
      // El lienzo es tan alto como la página: se limita a ~8 millones de píxeles reales.
      const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(8e6 / Math.max(1, width * height)));
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Una burbuja cada ~28.000 px² (como mucho 90), repartidas por toda la altura al empezar.
      const count = Math.min(90, Math.round((width * height) / 28000));
      bubbles = Array.from({ length: count }, () => newBubble(random(0, height)));
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      // Franja visible del contenedor: fuera de ella las burbujas se mueven pero no se dibujan.
      const viewTop = -section.getBoundingClientRect().top - 60;
      const viewBottom = viewTop + window.innerHeight + 120;

      for (const b of bubbles) {
        b.y -= b.speed;
        const x = b.x + Math.sin(time / 1400 + b.phase) * 14;
        if (b.y < -b.r * 2) Object.assign(b, newBubble());

        if (pointer) {
          const dx = x - pointer.x;
          const dy = b.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          // Muy cerca revienta; un poco más lejos, se aparta del cursor.
          if (distance < b.r * 0.6) {
            pop(b, x);
            continue;
          }
          if (distance < b.r + 70) {
            const push = (b.r + 70 - distance) / 30;
            b.x += (dx / (distance || 1)) * push;
            b.y += (dy / (distance || 1)) * push;
          }
        }

        if (b.y < viewTop || b.y > viewBottom) continue;
        const gradient = ctx.createRadialGradient(x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.1, x, b.y, b.r);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.85)");
        gradient.addColorStop(0.6, `${b.color}88`);
        gradient.addColorStop(1, `${b.color}dd`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Brillo
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, b.y, b.r * 0.68, Math.PI * 1.1, Math.PI * 1.45);
        ctx.stroke();
      }

      sparks = sparks.filter((s) => s.life > 0);
      for (const s of sparks) {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05;
        s.life -= 0.025;
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.fillStyle = s.color;
        star(ctx, s.x, s.y, 3 + s.life * 4);
      }
      ctx.globalAlpha = 1;

      frame = visible ? requestAnimationFrame(draw) : 0;
    };

    const local = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const onMove = (event: PointerEvent) => {
      pointer = local(event);
    };
    const onLeave = () => {
      pointer = null;
    };
    // Tocar o hacer clic revienta las burbujas cercanas al punto.
    const onDown = (event: PointerEvent) => {
      const p = local(event);
      for (const b of bubbles) {
        if (Math.hypot(b.x - p.x, b.y - p.y) < b.r + 24) pop(b);
      }
      if (event.pointerType !== "mouse") pointer = null;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(draw);
    });
    const resizer = new ResizeObserver(resize);

    resize();
    observer.observe(section);
    resizer.observe(section);
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    section.addEventListener("pointerdown", onDown);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizer.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={canvasRef} className="jpa-bubbles" aria-hidden="true" />;
}
