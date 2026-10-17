import Link from "next/link";

export function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label="humanoydev, ir al inicio">
      <span className="serif">humano</span>
      <span className="wordmark__y">y</span>
      <span className="mono wordmark__dev">dev</span>
    </Link>
  );
}
