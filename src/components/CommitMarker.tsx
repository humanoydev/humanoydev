export type CommitState = "done" | "active" | "todo";

export function CommitMarker({ state }: { state: CommitState }) {
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
