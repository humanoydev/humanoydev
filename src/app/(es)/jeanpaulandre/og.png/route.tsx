import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { Blocks, Bunny, Cloud, Elephant, HotAirBalloon } from "@/components/jeanpaulandre/Doodles";
import { babyShower } from "@/content/jeanpaulandre";

// Imagen de vista previa (WhatsApp, redes) de la web de Jean Paul André y de su invitación.
// Se exporta en el build como out/jeanpaulandre/og.png, que el subdominio sirve como /og.png
// (como public/jean/og.png). Los dibujos son los mismos de la web, como SVG.

export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

const INK = "#4a372c";
const ACCENT = "#b4532f";

// Fredoka 600 en woff (el generador no lee woff2). Licencia OFL.
const fredoka = await readFile(join(process.cwd(), "assets/fonts/fredoka-latin-600-normal.woff"));

// Posición y tamaño de un dibujo; el alto sale de la proporción de su viewBox.
const place = (width: number, ratio: number, position: React.CSSProperties): React.CSSProperties => ({
  position: "absolute",
  width,
  height: Math.round(width * ratio),
  ...position,
});

// Torre de cubos J·P·A: posición y tamaño (las letras se ponen encima, ver abajo).
const BLOCKS = { left: 270, bottom: 22, size: 118 };

const hills = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200" preserveAspectRatio="none"><path d="M0 90Q300 10 650 84T1200 56V200H0z" fill="#c9ddbb"/><path d="M0 130Q360 60 740 126T1200 112V200H0z" fill="#dbe9d2"/></svg>`;

export function GET() {
  const white = { color: "#fff" };
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "linear-gradient(180deg, #c6dff1, #d6e8f5 40%, #eaf3f9 75%, #fdf3e6)",
        fontFamily: "Fredoka",
        color: INK,
      }}
    >
      <Cloud style={{ ...place(190, 64 / 120, { top: 40, left: 250 }), ...white }} />
      <Cloud style={{ ...place(180, 64 / 120, { top: 250, right: 8 }), opacity: 0.9, ...white }} />
      <HotAirBalloon color="butter" style={place(70, 200 / 120, { top: 30, right: 230 })} />
      <HotAirBalloon color="sky" style={place(120, 200 / 120, { top: 60, right: 70 })} />
      <HotAirBalloon bear style={place(190, 200 / 120, { top: 70, left: 50 })} />
      {}
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse solo entiende <img> */}
      <img
        alt=""
        src={`data:image/svg+xml;base64,${Buffer.from(hills).toString("base64")}`}
        style={{ position: "absolute", left: 0, bottom: 0, width: 1200, height: 170 }}
      />
      <Bunny style={place(96, 124 / 100, { left: 120, bottom: 54 })} />
      <Blocks letters={false} style={place(BLOCKS.size, 1, { left: BLOCKS.left, bottom: BLOCKS.bottom })} />
      {/* Letras de los cubos, en su centro (coordenadas del viewBox 136×136 de Blocks). */}
      {[
        { letter: "P", x: 32, y: 104 },
        { letter: "A", x: 90, y: 104 },
        { letter: "J", x: 62, y: 50 },
      ].map(({ letter, x, y }) => (
        <div
          key={letter}
          style={{
            position: "absolute",
            left: BLOCKS.left + (x / 136) * BLOCKS.size - 20,
            top: size.height - BLOCKS.bottom - BLOCKS.size + (y / 136) * BLOCKS.size - 20,
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
          }}
        >
          {letter}
        </div>
      ))}
      <Elephant style={place(190, 126 / 150, { right: 70, bottom: 30 })} />

      <div
        style={{
          marginTop: 150,
          padding: "8px 26px",
          borderRadius: 999,
          background: "#fff",
          color: ACCENT,
          fontSize: 30,
          letterSpacing: 1,
        }}
      >
        Baby shower
      </div>
      <div style={{ marginTop: 18, display: "flex", fontSize: 104, lineHeight: 1 }}>
        Jean Paul<span style={{ marginLeft: 26, color: ACCENT }}>André</span>
      </div>
      <div style={{ marginTop: 26, fontSize: 36, color: "#6f5a4c" }}>
        {`${babyShower.dateLabel.replace(/ de \d{4}$/, "")} · ${babyShower.timeLabel.split(" a ")[0]}`}
      </div>
    </div>,
    { ...size, fonts: [{ name: "Fredoka", data: fredoka, style: "normal", weight: 600 }] },
  );
}
