// URLs públicas. En local puedes sobrescribirlas con variables de entorno.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://humanoydev.com";
export const JEAN_URL = process.env.NEXT_PUBLIC_JEAN_URL ?? "https://jean.humanoydev.com";

// TODO: reemplazar por tu correo real.
export const CONTACT_EMAIL = "[correo]";

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
  description: string;
  slidesHref: string;
};

export const talks: Talk[] = [
  {
    date: "12–13 sep 2026",
    title: "AI Fluency & Claude Code",
    event: "f13, UTEC, Lima",
    description:
      "Claude Code como laboratorio para trabajar con IA con criterio, no como un tutorial de funciones.",
    slidesHref: "#",
  },
  {
    // TODO: confirmar título oficial y fecha.
    date: "[fecha]",
    title: "¿Por qué me pagan?",
    event: "GDG Lima",
    description:
      "Conocimiento, contexto, ejecución y valor: lo que aporta un desarrollador cuando la IA escribe código.",
    slidesHref: "#",
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
    kind: "Skill para Claude",
    title: "claude-design-reconcile",
    description:
      "Sincroniza diseños de Claude Design, componentes React y Figma en ambas direcciones.",
    linkText: "Ver el proyecto",
    href: "#",
    mono: true,
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
