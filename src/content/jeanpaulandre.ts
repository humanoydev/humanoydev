// Contenido de jeanpaulandre.humanoydev.com, la web de Jean Paul André.
// Solo en español: es una excepción a la regla bilingüe del resto del sitio.

export const BABY_NAME = "Jean Paul André";

export const letter = {
  paragraphs: [
    "Hijo, esta es tu web. ❤️",
    "La empezamos antes de conocerte, cuando todavía soñábamos con tu llegada. Queríamos guardar aquí cada pedacito de tu historia, para que algún día puedas descubrir cuánto te esperamos, cuánto te soñamos y quiénes estuvieron a nuestro lado desde el principio.",
    "Cada capítulo guarda un momento de tu vida, un recuerdo, una emoción o una persona que forma parte de tu historia.",
    "El primero comenzó mucho antes de que llegaras: cuando ya tenías un lugar inmenso en nuestros corazones, incluso antes de poder abrazarte.",
    "Bienvenido a tu historia, hijo.",
  ],
  signature: "Papá y mamá",
};

// Ecografía 3D de la polaroid de la portada. Rutas con /jeanpaulandre: funcionan en local
// y en el subdominio (el Worker sirve el archivo de public/jeanpaulandre/).
export const ultrasound = {
  video: "/jeanpaulandre/videos/ecografia-22-semanas.mp4",
  poster: "/jeanpaulandre/images/ecografia-22-semanas.jpg",
  label: "Ecografía 3D de Jean Paul André a las 22 semanas: su carita y sus manitos.",
  caption: "22 semanas y 3 días",
};

// La dirección no va aquí: este archivo termina en el HTML público. Solo la ve
// quien abre su link personal (la entrega la API del Worker).
export const babyShower = {
  date: "2026-11-15",
  dateLabel: "Domingo 15 de noviembre de 2026",
  start: "2026-11-15T16:00:00-05:00",
  end: "2026-11-15T21:00:00-05:00",
  timeLabel: "4:00 p. m. a 9:00 p. m.",
  // Hoja de calendario grande de la tarjeta "Cuándo".
  calendar: { weekday: "Domingo", day: "15", month: "Noviembre" },
  rsvpByLabel: "sábado 31 de octubre",
};

// Imagen de vista previa para WhatsApp y redes (la genera src/app/(es)/jeanpaulandre/og.png/).
export const ogImage = {
  path: "/og.png",
  width: 1200,
  height: 630,
  alt: `Baby shower de ${BABY_NAME}: ${babyShower.dateLabel}`,
};

export type Chapter = {
  numeral: string;
  title: string;
  subtitle: string;
  // Fecha AAAA-MM-DD para la cuenta regresiva.
  countdownTo?: string;
  // Sin href ni cuenta regresiva, el capítulo aparece como pendiente.
  href?: string;
  status: string;
};

export const chapters: Chapter[] = [
  {
    numeral: "I",
    title: "La espera",
    subtitle: `Baby shower · ${babyShower.dateLabel}`,
    countdownTo: babyShower.date,
    href: "/babyshower",
    status: "Ver la invitación",
  },
  {
    numeral: "II",
    title: "Llegaste",
    subtitle: "El día en que te conocimos.",
    status: "Por escribir",
  },
];
