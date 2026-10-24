// URLs públicas. En local puedes sobrescribirlas con variables de entorno.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://humanoydev.com";
export const JEAN_URL = process.env.NEXT_PUBLIC_JEAN_URL ?? "https://jean.humanoydev.com";
export const JEANPAULANDRE_URL = process.env.NEXT_PUBLIC_JEANPAULANDRE_URL ?? "https://jeanpaulandre.humanoydev.com";
export const INSTAGRAM_URL = "https://www.instagram.com/humanoydev/";
export const LINKEDIN_URL = "https://www.linkedin.com/in/jeanpaul1304/";

// TODO: reemplazar por tu correo real.
export const CONTACT_EMAIL = "humanoydev@gmail.com";

export type Category = "articulos" | "experimentos" | "recursos";

export type ContentItem = {
  category: Category;
  kind: string;
  title: string;
  description: string;
  linkText: string;
  href: string;
  mono?: boolean;
};

// Solo lo que ya existe. Los href "#" son placeholders.
export const contentItems: ContentItem[] = [
  {
    category: "experimentos",
    kind: "Experimento",
    title: "claude-design-reconcile",
    description:
      "Una skill que mantiene sincronizados los diseños de Claude Design, el código React y Figma, en ambas direcciones.",
    linkText: "Ver el experimento",
    href: "#",
    mono: true,
  },
  {
    category: "recursos",
    kind: "Recurso",
    title: "Claude Code con git worktrees",
    description:
      "Cómo trabajo con worktrees, sesiones en paralelo y un modelo para planificar y otro para ejecutar.",
    linkText: "Ver el recurso",
    href: "#",
  },
  {
    category: "recursos",
    kind: "Recurso",
    title: "Diapositivas: AI Fluency & Claude Code",
    description: "Las diapositivas de la charla presentada en f13, en UTEC, Lima.",
    linkText: "Ver las diapositivas",
    href: `${JEAN_URL}/#charlas`,
  },
];

export const categories: { id: Category | "todo"; label: string }[] = [
  { id: "todo", label: "Todo" },
  { id: "articulos", label: "Artículos" },
  { id: "experimentos", label: "Experimentos" },
  { id: "recursos", label: "Recursos" },
];

export type Talk = {
  date: string;
  title: string;
  event: string;
  eventHref?: string;
  description: string;
  slidesHref: string;
};

// De la más reciente a la más antigua: la página de Jean muestra las primeras 3.
export const talks: Talk[] = [
  {
    date: "17 oct 2026",
    title: "La IA me escribe el código. Entonces, ¿para qué me pagan?",
    event: "CodeOn 2026",
    eventHref: "https://codeon-2026.lovable.app/",
    description: "Del código generado a la entrega de valor con agentes.",
    slidesHref: `${JEAN_URL}/get-on-code-2026/`,
  },
  {
    date: "12–13 sep 2026",
    title: "AI Fluency & Claude Code",
    event: "F13: Code Summit, UTEC, Lima",
    eventHref: "https://f13.pe/",
    description:
      "De programar con IA a hacer ingeniería con IA: Claude Code como laboratorio para trabajar con criterio, no como un tutorial de funciones.",
    slidesHref:
      "https://docs.google.com/presentation/d/1ON7QR0ZnDbmqnaetGMMabgJn_TCFmDEQ5Ymij1tAZcY/edit?usp=sharing",
  },
  {
    date: "27 mar 2019",
    title: "Progressive Web Apps & Workbox",
    event: "Google I/O Extended",
    description:
      "Qué hace a una web app instalable, rápida y confiable: manifest, service workers, estrategias de caché con Workbox y Lighthouse.",
    slidesHref: "https://jeanpaul1304.github.io/pwa-expo/",
  },
  {
    date: "11 jul 2016",
    title: "Automatización en el flujo front-end",
    event: "ISIL JS Day",
    description:
      "Jade (hoy Pug), Stylus, CoffeeScript y Gulp.js para automatizar el flujo de trabajo front-end.",
    slidesHref: "https://jeanpaul1304.github.io/gulpjs-expo/",
  },
];

export type Project = {
  kind: string;
  title: string;
  description: string;
  linkText: string;
  href: string;
  mono?: boolean;
};

export const projects: Project[] = [
  {
    kind: "Arquitectura y Team Lead Frontend",
    title: "Banca por Internet Interbank",
    description:
      "Diseñé la arquitectura frontend y lideré al equipo de la plataforma web con la que los clientes de Interbank operan sus cuentas, transferencias y pagos.",
    linkText: "Ver Banca por Internet",
    href: "https://interbank.pe/canales-digitales/banca-por-internet",
  },
  {
    kind: "Banking Tech Lead",
    title: "RappiBank",
    description:
      "Lideré la tecnología bancaria del banco digital que nació de la alianza entre Rappi e Interbank en el Perú.",
    linkText: "Ver RappiBank",
    href: "https://interbank.pe/rappibank?tabs=que-es",
  },
  {
    kind: "Frontend Tech Lead",
    title: "Comunal: app y dashboard",
    description:
      "Lideré el frontend de la app para buscar, reservar y pagar salas de reuniones en la red de coworking de Comunal, y de su dashboard.",
    linkText: "Ver Comunal",
    href: "https://app.comunal.co/",
  },
  {
    kind: "Flujo de trabajo",
    title: "Claude Code con git worktrees",
    description: "Sesiones en paralelo, un modelo para planificar y otro para ejecutar.",
    linkText: "Ver el proyecto",
    href: "#",
  },
  {
    kind: "Marca",
    title: "humanoydev",
    description:
      "Donde publico artículos, experimentos y recursos sobre desarrollar software con IA.",
    linkText: "Ir a humanoydev.com",
    href: SITE_URL,
  },
];
