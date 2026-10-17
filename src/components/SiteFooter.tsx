import Link from "next/link";
import { JEAN_URL } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="container site-footer">
      <p>© 2026 Jean Paul Diaz</p>
      <ul className="footer-links">
        <li>
          <Link href="/acerca">Acerca de</Link>
        </li>
        <li>
          <a href={JEAN_URL}>jean.humanoydev.com</a>
        </li>
      </ul>
    </footer>
  );
}
