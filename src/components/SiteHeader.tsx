"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "./Wordmark";

const links = [
  { href: "/explorar", label: "Explorar" },
  { href: "/comunidad", label: "Comunidad" },
  { href: "/acerca", label: "Acerca de" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="container site-header">
      <Wordmark />
      <nav aria-label="Principal">
        <ul className="nav-list">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="nav-link"
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            {/* TODO: enlazar a la versión en inglés cuando exista. */}
            <a href="#" lang="en" aria-label="English version" className="nav-link nav-link--quiet">
              EN
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
