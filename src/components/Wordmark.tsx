import Link from "next/link";
import type { Locale } from "@/content/i18n";

export function Wordmark({ locale }: { locale: Locale }) {
  return (
    <Link
      href={locale === "es" ? "/" : "/en"}
      className="wordmark"
      aria-label={locale === "es" ? "humanoydev, ir al inicio" : "humanoydev, go to the home page"}
    >
      <span className="serif">humano</span>
      <span className="wordmark__y">y</span>
      <span className="mono wordmark__dev">dev</span>
    </Link>
  );
}
