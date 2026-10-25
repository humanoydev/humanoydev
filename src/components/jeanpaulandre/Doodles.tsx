import { Toy } from "./Toy";

// Dibujos de la web de Jean Paul André, estilo cuento: rellenos pastel con contorno.
// Son decorativos (aria-hidden). Tamaño, posición y profundidad del parallax
// (jpa-px--*) salen de la clase que reciben.

// `style` lo usa la imagen de vista previa (opengraph-image.tsx) para ubicar y medir cada dibujo.
type Props = { className?: string; style?: React.CSSProperties };

const INK = "#4a372c";
const PINK = "#f3a99a";
// Contorno común de los dibujos.
const line = { stroke: INK, strokeWidth: 2.4, strokeLinejoin: "round", strokeLinecap: "round" } as const;

export function Cloud({ className, style }: Props) {
  return (
    <svg viewBox="0 0 120 64" className={className} style={style} aria-hidden="true">
      <g fill="currentColor">
        <circle cx="36" cy="38" r="18" />
        <circle cx="62" cy="28" r="24" />
        <circle cx="90" cy="40" r="16" />
        <rect x="18" y="38" width="88" height="22" rx="11" />
      </g>
    </svg>
  );
}

export function Star({ className, style }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path
        d="M12 2 L14.7 8.3 L21.5 8.9 L16.4 13.4 L17.9 20.1 L12 16.6 L6.1 20.1 L7.6 13.4 L2.5 8.9 L9.3 8.3 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Moon({ className, style }: Props) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={style} aria-hidden="true">
      <path d="M20 3a13 13 0 1 0 9 20.5A10.5 10.5 0 0 1 20 3z" fill="currentColor" />
    </svg>
  );
}

export function Heart({ className, style }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path
        d="M12 21s-7.5-4.6-9.6-9.2A5.2 5.2 0 0 1 12 6.4a5.2 5.2 0 0 1 9.6 5.4C19.5 16.4 12 21 12 21z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Birds({ className, style }: Props) {
  return (
    <svg viewBox="0 0 64 30" className={className} style={style} aria-hidden="true">
      <g fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" opacity="0.6">
        <path className="jpa-bird" d="M4 14 q6 -8 12 0 q6 -8 12 0" />
        <path className="jpa-bird jpa-bird--late" d="M36 24 q5 -6 10 0 q5 -6 10 0" />
      </g>
    </svg>
  );
}

// Las piezas que van dentro de un <svg> son funciones que devuelven elementos SVG, no
// componentes: la imagen de vista previa (opengraph-image.tsx) solo acepta elementos SVG ahí.

// Ojo con brillo, para que los animalitos se vean vivos.
function eye(cx: number, cy: number, r = 3.4) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={INK} />
      <circle cx={cx + r * 0.35} cy={cy - r * 0.4} r={r * 0.36} fill="#fff" />
    </g>
  );
}

function bearFace() {
  return (
    <g>
      <circle cx="15" cy="12" r="8" fill="#b98a6a" {...line} />
      <circle cx="15" cy="12" r="3.8" fill="#e9c7a8" />
      <circle cx="45" cy="12" r="8" fill="#b98a6a" {...line} />
      <circle cx="45" cy="12" r="3.8" fill="#e9c7a8" />
      <circle cx="30" cy="30" r="19" fill="#c99a78" {...line} />
      <ellipse cx="30" cy="37" rx="8.5" ry="6.5" fill="#f1d9c0" />
      <ellipse cx="30" cy="34" rx="3.4" ry="2.5" fill={INK} />
      {eye(22.5, 26, 2.6)}
      {eye(37.5, 26, 2.6)}
      <circle cx="17.5" cy="34" r="3.2" fill={PINK} opacity="0.8" />
      <circle cx="42.5" cy="34" r="3.2" fill={PINK} opacity="0.8" />
      <path d="M27 39q3 3 6 0" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}

const BALLOON_COLORS = {
  peach: { main: "#fbdccb", stripe: "#f8e6a8", side: "#d6e8f5" },
  sky: { main: "#d6e8f5", stripe: "#fffaf3", side: "#dbe9d2" },
  butter: { main: "#f8e6a8", stripe: "#fbdccb", side: "#fffaf3" },
};

// Globo aerostático; `bear` pone un osito en la canasta.
export function HotAirBalloon({
  className,
  style,
  color = "peach",
  bear = false,
}: Props & { color?: keyof typeof BALLOON_COLORS; bear?: boolean }) {
  const c = BALLOON_COLORS[color];
  return (
    <svg viewBox="0 0 120 200" className={className} style={style} aria-hidden="true">
      <path d="M60 6C22 6 8 40 14 70c6 28 30 42 36 54h20c6-12 30-26 36-54C112 40 98 6 60 6z" fill={c.main} {...line} />
      <path
        d="M60 6C30 20 22 70 36 106l14 18h4C40 96 40 34 60 6zM60 6c30 14 38 64 24 100l-14 18h-4c14-28 14-90-6-118z"
        fill={c.side}
        stroke={INK}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M60 6C44 30 42 90 52 124h16c10-34 8-94-8-118z"
        fill={c.stripe}
        stroke={INK}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M50 124l-6 38M70 124l6 38" stroke={INK} strokeWidth="1.8" />
      {bear && <g transform="translate(30 120)">{bearFace()}</g>}
      <rect x="38" y="160" width="44" height="34" rx="6" fill="#d79a6b" {...line} />
      <path d="M40 171h40M40 182h40" stroke="#a9714a" strokeWidth="1.8" />
      {bear && (
        <g>
          <circle cx="47" cy="161" r="5.5" fill="#c99a78" {...line} />
          <circle cx="73" cy="161" r="5.5" fill="#c99a78" {...line} />
        </g>
      )}
    </svg>
  );
}

export function Bunny({ className, style }: Props) {
  return (
    <svg viewBox="0 0 100 124" className={className} style={style} aria-hidden="true">
      <g className="jpa-bunny__ear jpa-bunny__ear--left">
        <ellipse cx="37" cy="28" rx="10" ry="25" transform="rotate(-12 37 28)" fill="#fffaf3" {...line} />
        <ellipse cx="37" cy="30" rx="4.5" ry="16" transform="rotate(-12 37 30)" fill="#f6c1b5" />
      </g>
      <g className="jpa-bunny__ear">
        <ellipse cx="63" cy="28" rx="10" ry="25" transform="rotate(12 63 28)" fill="#fffaf3" {...line} />
        <ellipse cx="63" cy="30" rx="4.5" ry="16" transform="rotate(12 63 30)" fill="#f6c1b5" />
      </g>
      <circle cx="82" cy="104" r="8" fill="#fffaf3" {...line} />
      <ellipse cx="50" cy="96" rx="30" ry="24" fill="#fffaf3" {...line} />
      <ellipse cx="35" cy="117" rx="12" ry="6" fill="#fffaf3" {...line} />
      <ellipse cx="65" cy="117" rx="12" ry="6" fill="#fffaf3" {...line} />
      <circle cx="50" cy="60" r="25" fill="#fffaf3" {...line} />
      {eye(41, 57)}
      {eye(59, 57)}
      <ellipse cx="50" cy="65" rx="3.4" ry="2.4" fill="#e98a6d" />
      <path d="M46 69q4 4 4 0q0 4 4 0" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="35" cy="66" r="4.6" fill={PINK} opacity="0.75" />
      <circle cx="65" cy="66" r="4.6" fill={PINK} opacity="0.75" />
      <ellipse cx="42" cy="100" rx="6" ry="8" fill="#fffaf3" {...line} />
      <ellipse cx="58" cy="100" rx="6" ry="8" fill="#fffaf3" {...line} />
    </svg>
  );
}

export function Duck({ className, style }: Props) {
  return (
    <svg viewBox="0 0 112 100" className={className} style={style} aria-hidden="true">
      <path d="M44 84l-7 10h15zM68 84l-7 10h15z" fill="#f0a35e" {...line} />
      <path d="M86 52l18-14-4 24z" fill="#f8d977" {...line} />
      <ellipse cx="60" cy="64" rx="36" ry="24" fill="#f8d977" {...line} />
      <path d="M50 62q16-14 32 0q-10 15-32 0z" fill="#f2c94c" {...line} />
      <path d="M33 15q1-9 7-7M33 15q-4-8-9-4" fill="none" {...line} />
      <circle cx="34" cy="34" r="19" fill="#f8d977" {...line} />
      <path d="M18 34q-15-3-15 4q4 7 17 3z" fill="#f0a35e" {...line} />
      {eye(30, 30)}
      <circle cx="39" cy="40" r="4.6" fill={PINK} opacity="0.75" />
    </svg>
  );
}

export function Elephant({ className, style }: Props) {
  return (
    <svg viewBox="0 0 150 126" className={className} style={style} aria-hidden="true">
      <path d="M128 72q12 6 7 18" fill="none" {...line} />
      <ellipse cx="112" cy="104" rx="15" ry="13" fill="#c9d3e3" {...line} />
      <ellipse cx="90" cy="78" rx="42" ry="33" fill="#c9d3e3" {...line} />
      <rect x="60" y="90" width="22" height="30" rx="10" fill="#c9d3e3" {...line} />
      <rect x="88" y="94" width="22" height="26" rx="10" fill="#c9d3e3" {...line} />
      <path d="M64 116h14M92 116h14" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="80" cy="48" rx="21" ry="27" fill="#c9d3e3" {...line} />
      <ellipse cx="80" cy="49" rx="12" ry="18" fill="#f6c1b5" />
      <circle cx="54" cy="52" r="30" fill="#c9d3e3" {...line} />
      <path d="M36 62C24 70 18 82 20 94c1 7 10 8 12 2c1-4-2-6-4-4c-1-8 4-16 16-22z" fill="#c9d3e3" {...line} />
      {eye(47, 46)}
      <circle cx="58" cy="60" r="5" fill={PINK} opacity="0.75" />
      <path d="M58 30q4-8 10-6" fill="none" {...line} />
    </svg>
  );
}

// Cubo de juguete con una letra, en perspectiva simple.
function block({
  x,
  y,
  letter,
  front,
  top,
  side,
  tilt = 0,
}: {
  x: number;
  y: number;
  letter?: string;
  front: string;
  top: string;
  side: string;
  tilt?: number;
}) {
  const s = 52;
  const d = 12;
  return (
    // .jpa-block: lo anima la reacción "tumble" de Toy (cada cubo salta por separado).
    <g className="jpa-block">
      <g transform={`rotate(${tilt} ${x + s / 2} ${y + s / 2})`}>
        <path d={`M${x} ${y}l${d} ${-d}h${s}l${-d} ${d}z`} fill={top} {...line} />
        <path d={`M${x + s} ${y}l${d} ${-d}v${s}l${-d} ${d}z`} fill={side} {...line} />
        <rect x={x} y={y} width={s} height={s} rx="5" fill={front} {...line} />
        <rect
          x={x + 6}
          y={y + 6}
          width={s - 12}
          height={s - 12}
          rx="4"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          opacity="0.8"
        />
        {letter && (
          <text
            x={x + s / 2}
            y={y + s / 2 + 11}
            textAnchor="middle"
            fontFamily="'Fredoka Variable', system-ui, sans-serif"
            fontSize="32"
            fontWeight="700"
            fill={INK}
          >
            {letter}
          </text>
        )}
      </g>
    </g>
  );
}

// Torre de cubos con sus iniciales: J sobre P y A.
// Sin `letters`, los cubos van vacíos: la imagen de vista previa no dibuja <text> y pone las letras encima.
export function Blocks({ className, style, letters = true }: Props & { letters?: boolean }) {
  const letter = (value: string) => (letters ? value : undefined);
  return (
    <svg viewBox="0 0 136 136" className={className} style={style} aria-hidden="true">
      {block({ x: 6, y: 78, letter: letter("P"), front: "#d6e8f5", top: "#eaf3f9", side: "#b9d3e8" })}
      {block({ x: 64, y: 78, letter: letter("A"), front: "#dbe9d2", top: "#ecf4e6", side: "#bfd6b0" })}
      {block({ x: 36, y: 24, letter: letter("J"), front: "#fbdccb", top: "#fdeee5", side: "#f0bfa4", tilt: -6 })}
    </svg>
  );
}

// Tres globos atados.
export function Balloons({ className, style }: Props) {
  return (
    <svg viewBox="0 0 100 172" className={className} style={style} aria-hidden="true">
      <path d="M30 66q6 40 22 104M64 60q-4 50-12 110M48 90q8 40 4 80" fill="none" stroke="#6f5a4c" strokeWidth="1.4" />
      <ellipse cx="30" cy="40" rx="20" ry="25" fill="#fbdccb" {...line} />
      <path d="M27 65l3 5 3-5z" fill="#fbdccb" {...line} />
      <ellipse cx="64" cy="34" rx="20" ry="25" fill="#d6e8f5" {...line} />
      <path d="M61 59l3 5 3-5z" fill="#d6e8f5" {...line} />
      <ellipse cx="48" cy="64" rx="20" ry="25" fill="#f8e6a8" {...line} />
      <path d="M45 89l3 5 3-5z" fill="#f8e6a8" {...line} />
      <g fill="#fff" opacity="0.7">
        <ellipse cx="23" cy="30" rx="4" ry="7" transform="rotate(20 23 30)" />
        <ellipse cx="57" cy="24" rx="4" ry="7" transform="rotate(20 57 24)" />
        <ellipse cx="41" cy="54" rx="4" ry="7" transform="rotate(20 41 54)" />
      </g>
    </svg>
  );
}

export function Kite({ className, style }: Props) {
  return (
    <svg viewBox="0 0 80 160" className={className} style={style} aria-hidden="true">
      <path d="M40 4l28 36-28 46-28-46z" fill="#dbe9d2" {...line} />
      <path d="M40 6v78M14 40h52" stroke="#fff" strokeWidth="2.4" />
      <path d="M40 86q-12 16 0 32t0 32" fill="none" stroke={INK} strokeWidth="1.6" />
      <g fill="#fbdccb" stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
        <path d="M33 100l7 4-7 4zM47 100l-7 4 7 4z" />
        <path d="M33 132l7 4-7 4zM47 132l-7 4 7 4z" />
      </g>
    </svg>
  );
}

// Corazones que salen de la trompa del elefante.
function Hearts() {
  return (
    <span className="jpa-hearts">
      <Heart />
      <Heart />
      <Heart />
    </span>
  );
}

// Colinas al pie del cielo. Se estiran al ancho del encabezado.
function Hills({ className, style }: Props) {
  return (
    <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className={className} style={style} aria-hidden="true">
      <path d="M0 90Q260 10 540 84T1000 56V200H0z" fill="#c9ddbb" />
      <path d="M0 130Q300 60 620 126T1000 112V200H0z" fill="#dbe9d2" />
    </svg>
  );
}

// Encabezado a pantalla completa, con cielo en capas a todo el ancho: al hacer scroll,
// lo lejano (luna, estrellas, globo pequeño) va más lento que lo cercano (globo con el
// osito, nubes grandes) y el texto se queda atrás detrás de las colinas. Ver Parallax.tsx.
// Los objetos son juguetes (Toy): reaccionan al mouse o al tocarlos.
export function HeroScene({ children }: { children: React.ReactNode }) {
  return (
    <div className="jpa__hero jpa-scene">
      <div className="jpa-sky" aria-hidden="true">
        <Toy play="wobble" className="jpa-sky__moon jpa-px jpa-px--far">
          <Moon />
        </Toy>
        <Star className="jpa-sky__star jpa-sky__star--1 jpa-px jpa-px--far" />
        <Star className="jpa-sky__star jpa-sky__star--2 jpa-px jpa-px--far" />
        <Star className="jpa-sky__star jpa-sky__star--3 jpa-px jpa-px--mid" />
        <Star className="jpa-sky__star jpa-sky__star--4 jpa-px jpa-px--far" />
        <Toy play="fly" dance className="jpa-sky__balloon jpa-sky__balloon--small jpa-px jpa-px--far">
          <HotAirBalloon color="butter" />
        </Toy>
        <Toy play="puff" className="jpa-sky__cloud jpa-sky__cloud--2 jpa-px jpa-px--far">
          <Cloud />
        </Toy>
        <Birds className="jpa-sky__birds jpa-px jpa-px--mid" />
        <Toy play="fly" dance className="jpa-sky__balloon jpa-sky__balloon--mid jpa-px jpa-px--mid">
          <HotAirBalloon color="sky" />
        </Toy>
        <Toy play="puff" className="jpa-sky__cloud jpa-sky__cloud--1 jpa-px jpa-px--mid">
          <Cloud />
        </Toy>
        <Toy play="fly" dance bubble="¡Hola!" className="jpa-sky__balloon jpa-sky__balloon--bear jpa-px jpa-px--near">
          <HotAirBalloon bear />
        </Toy>
        <Toy play="puff" className="jpa-sky__cloud jpa-sky__cloud--3 jpa-px jpa-px--front">
          <Cloud />
        </Toy>
        <Toy play="puff" className="jpa-sky__cloud jpa-sky__cloud--4 jpa-px jpa-px--front">
          <Cloud />
        </Toy>
      </div>
      <div className="container jpa__hero-content jpa-px jpa-px--content">{children}</div>
      <div className="jpa-ground" aria-hidden="true">
        <Hills className="jpa-ground__hills" />
        <Toy play="hop" className="jpa-ground__bunny">
          <Bunny />
        </Toy>
        <Toy play="tumble" className="jpa-ground__blocks">
          <Blocks />
        </Toy>
        <Toy play="waddle" bubble="¡Cuac!" className="jpa-ground__duck">
          <Duck />
        </Toy>
        <Toy play="trumpet" bubble={<Hearts />} className="jpa-ground__elephant">
          <Elephant />
        </Toy>
      </div>
    </div>
  );
}
