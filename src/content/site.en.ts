// Versión en inglés del contenido de site.ts. Si cambias algo allá, actualízalo aquí.
import { JEAN_URL, SITE_URL, type Category, type ContentItem, type Project, type Talk } from "./site";

export const contentItems: ContentItem[] = [
  {
    category: "experimentos",
    kind: "Experiment",
    title: "claude-design-reconcile",
    description:
      "A skill that keeps Claude Design designs, React code and Figma in sync, in both directions.",
    linkText: "See the experiment",
    href: "#",
    mono: true,
  },
  {
    category: "recursos",
    kind: "Resource",
    title: "Claude Code with git worktrees",
    description: "How I work with worktrees, parallel sessions, and one model to plan and another to execute.",
    linkText: "See the resource",
    href: "#",
  },
  {
    category: "recursos",
    kind: "Resource",
    title: "Slides: AI Fluency & Claude Code",
    description: "Slides from the talk given at f13, at UTEC, Lima.",
    linkText: "See the slides",
    href: `${JEAN_URL}/en#talks`,
  },
];

export const categories: { id: Category | "todo"; label: string }[] = [
  { id: "todo", label: "All" },
  { id: "articulos", label: "Articles" },
  { id: "experimentos", label: "Experiments" },
  { id: "recursos", label: "Resources" },
];

// Mismo orden que en site.ts: la página de Jean muestra las primeras 3.
export const talks: Talk[] = [
  {
    date: "Oct 17, 2026",
    title: "AI writes my code. So what am I getting paid for?",
    event: "CodeOn 2026",
    eventHref: "https://codeon-2026.lovable.app/",
    description: "From generated code to delivering value with agents.",
    slidesHref: `${JEAN_URL}/get-on-code-2026/`,
  },
  {
    date: "Sep 12–13, 2026",
    title: "AI Fluency & Claude Code",
    event: "F13: Code Summit, UTEC, Lima",
    eventHref: "https://f13.pe/",
    description:
      "From coding with AI to engineering with AI: Claude Code as a lab for working with judgment, not a feature tutorial.",
    slidesHref:
      "https://docs.google.com/presentation/d/1ON7QR0ZnDbmqnaetGMMabgJn_TCFmDEQ5Ymij1tAZcY/edit?usp=sharing",
  },
  {
    date: "Mar 27, 2019",
    title: "Progressive Web Apps & Workbox",
    event: "Google I/O Extended",
    description:
      "What makes a web app installable, fast and reliable: manifest, service workers, caching strategies with Workbox, and Lighthouse.",
    slidesHref: "https://jeanpaul1304.github.io/pwa-expo/",
  },
  {
    date: "Jul 11, 2016",
    title: "Automating the front-end workflow",
    event: "ISIL JS Day",
    description: "Jade (now Pug), Stylus, CoffeeScript and Gulp.js to automate the front-end workflow.",
    slidesHref: "https://jeanpaul1304.github.io/gulpjs-expo/",
  },
];

export const projects: Project[] = [
  {
    kind: "Frontend Architecture & Team Lead",
    title: "Interbank Online Banking",
    description:
      "I designed the frontend architecture and led the team behind the web platform Interbank customers use for their accounts, transfers and payments.",
    linkText: "See Online Banking",
    href: "https://interbank.pe/canales-digitales/banca-por-internet",
  },
  {
    kind: "Banking Tech Lead",
    title: "RappiBank",
    description:
      "I led the banking technology of the digital bank born from the partnership between Rappi and Interbank in Peru.",
    linkText: "See RappiBank",
    href: "https://interbank.pe/rappibank?tabs=que-es",
  },
  {
    kind: "Frontend Tech Lead",
    title: "Comunal: app and dashboard",
    description:
      "I led the frontend of the app for finding, booking and paying for meeting rooms across Comunal’s coworking network, and of its dashboard.",
    linkText: "See Comunal",
    href: "https://app.comunal.co/",
  },
  {
    kind: "Workflow",
    title: "Claude Code with git worktrees",
    description: "Parallel sessions, one model to plan and another to execute.",
    linkText: "See the project",
    href: "#",
  },
  {
    kind: "Brand",
    title: "humanoydev",
    description: "Where I publish articles, experiments and resources about building software with AI.",
    linkText: "Go to humanoydev.com",
    href: `${SITE_URL}/en`,
  },
];
