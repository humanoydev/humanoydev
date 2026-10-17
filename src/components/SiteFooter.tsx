import Link from "next/link";
import type { Locale } from "@/content/i18n";
import { INSTAGRAM_URL, JEAN_URL } from "@/content/site";

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="container site-footer">
      <p>© 2026 Jean Paul Diaz</p>
      <ul className="footer-links">
        <li>
          {locale === "es" ? <Link href="/acerca">Acerca de</Link> : <Link href="/en/about">About</Link>}
        </li>
        <li>
          <a href={locale === "es" ? JEAN_URL : `${JEAN_URL}/en`}>jean.humanoydev.com</a>
        </li>
        <li>
          <a href={INSTAGRAM_URL}>Instagram</a>
        </li>
      </ul>
    </footer>
  );
}
