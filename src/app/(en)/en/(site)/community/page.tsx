import type { Metadata } from "next";
import { openGraphEn } from "@/app/shared-metadata";
import { CommitMarker, type CommitState } from "@/components/CommitMarker";
import { pageAlternates } from "@/content/i18n";

const description = "The humanoydev community is under construction: newsletter, meetups and collaborations.";

export const metadata: Metadata = {
  title: "Community",
  description,
  openGraph: { ...openGraphEn, title: "Community · humanoydev", description, url: "/en/community" },
  alternates: pageAlternates("/en/community", "en"),
};

const commits: { message: string; state: CommitState; description: string }[] = [
  { message: "init: reserve this space", state: "done", description: "It exists. You’re reading it." },
  {
    message: "feat: newsletter",
    state: "active",
    description: "An email every now and then with what’s new at humanoydev. No noise.",
  },
  {
    message: "feat: meetups",
    state: "todo",
    description: "Get-togethers to share what we’re trying out with AI.",
  },
  {
    message: "feat: collaborations",
    state: "todo",
    description: "Projects and experiments built together with other people.",
  },
];

const stateLabel: Record<CommitState, string> = { done: "Done", active: "In progress", todo: "To do" };

export default function CommunityPage() {
  const done = commits.filter((c) => c.state === "done").length;

  return (
    <div className="container page split">
      <div className="split__main">
        <h1 className="page-title">Community</h1>
        <p className="page-intro" style={{ maxWidth: "44ch" }}>
          It’s not open yet. We’re building it the way we build everything else: on a branch, commit by commit.
        </p>

        <div className="branch">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="6" cy="5" r="2.5" />
            <circle cx="6" cy="19" r="2.5" />
            <circle cx="18" cy="8" r="2.5" />
            <path d="M6 7.5v9" />
            <path d="M18 10.5c0 4-4.5 4-9.5 6.5" />
          </svg>
          <p className="mono branch__name">feature/community</p>
          <p className="branch__status">
            Not merged into main yet. {done} of {commits.length} commits done.
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
          Want a heads-up when it merges?
        </h2>
        <p className="panel__desc" style={{ fontSize: 18 }}>
          Leave your email and I’ll write when the newsletter opens.
        </p>
        {/* TODO: conectar a un servicio de newsletter o a una ruta del Worker (igual que en la versión en español). */}
        <div className="field">
          <label htmlFor="correo">Email</label>
          <input id="correo" type="email" autoComplete="email" placeholder="you@email.com" />
          <button type="button" className="btn btn--primary">
            Notify me when it opens
          </button>
        </div>
      </aside>
    </div>
  );
}
