import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comunidad",
  description: "La comunidad de humanoydev está en construcción: newsletter, encuentros y colaboraciones.",
};

type CommitState = "done" | "active" | "todo";

const commits: { message: string; state: CommitState; description: string }[] = [
  { message: "init: reservar este espacio", state: "done", description: "Ya existe. Lo estás leyendo." },
  {
    message: "feat: newsletter",
    state: "active",
    description: "Un correo de vez en cuando con lo nuevo de humanoydev. Sin ruido.",
  },
  {
    message: "feat: encuentros",
    state: "todo",
    description: "Reuniones para compartir lo que estamos probando con IA.",
  },
  {
    message: "feat: colaboraciones",
    state: "todo",
    description: "Proyectos y experimentos hechos en conjunto con otras personas.",
  },
];

const stateLabel: Record<CommitState, string> = { done: "Hecho", active: "En curso", todo: "Pendiente" };

function CommitMarker({ state }: { state: CommitState }) {
  if (state === "done") {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <circle cx="14" cy="14" r="12" fill="var(--ink)" />
        <path d="M8.5 14.5l3.5 3.5 7.5-8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (state === "active") {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <circle cx="14" cy="14" r="11" fill="var(--ground)" stroke="var(--accent)" strokeWidth="2.5" />
        <path d="M14 3a11 11 0 0 1 0 22z" fill="var(--accent)" />
      </svg>
    );
  }
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <circle cx="14" cy="14" r="11" fill="none" stroke="var(--muted)" strokeWidth="2" strokeDasharray="3 3" />
    </svg>
  );
}

export default function CommunityPage() {
  const done = commits.filter((c) => c.state === "done").length;

  return (
    <div className="container page split">
      <div className="split__main">
        <h1 className="page-title">Comunidad</h1>
        <p className="page-intro" style={{ maxWidth: "44ch" }}>
          Todavía no abre. La estamos construyendo como construimos todo lo demás: en una rama, commit a commit.
        </p>

        <div className="branch">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="6" cy="5" r="2.5" />
            <circle cx="6" cy="19" r="2.5" />
            <circle cx="18" cy="8" r="2.5" />
            <path d="M6 7.5v9" />
            <path d="M18 10.5c0 4-4.5 4-9.5 6.5" />
          </svg>
          <p className="mono branch__name">feature/comunidad</p>
          <p className="branch__status">
            Aún no se fusiona con main. Va {done} de {commits.length} commits.
          </p>
        </div>

        <ol className="commits">
          {commits.map((commit, index) => (
            <li key={commit.message} className="commit">
              <div className="commit__rail">
                <CommitMarker state={commit.state} />
                {index < commits.length - 1 && <div className="commit__line" />}
              </div>
              <div className="commit__body">
                <p className="mono commit__msg">{commit.message}</p>
                <p className={`commit__state commit__state--${commit.state}`}>{stateLabel[commit.state]}</p>
                <p className="commit__desc">{commit.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <aside aria-labelledby="notify-title" className="split__aside panel">
        <h2 id="notify-title" className="section-title" style={{ fontSize: 30, lineHeight: 1.2 }}>
          ¿Te aviso cuando se fusione?
        </h2>
        <p className="panel__desc" style={{ fontSize: 18 }}>
          Deja tu correo y te escribo cuando abra la newsletter.
        </p>
        {/* TODO: conectar a un servicio de newsletter o a una ruta del Worker. */}
        <div className="field">
          <label htmlFor="correo">Correo electrónico</label>
          <input id="correo" type="email" autoComplete="email" placeholder="tu@correo.com" />
          <button type="button" className="btn btn--primary">
            Avisarme cuando abra
          </button>
        </div>
      </aside>
    </div>
  );
}
