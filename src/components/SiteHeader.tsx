"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { translatePath, type Locale } from "@/content/i18n";
import { Wordmark } from "./Wordmark";

const links: Record<Locale, { href: string; label: string }[]> = {
  es: [
    { href: "/explorar", label: "Explorar" },
    { href: "/comunidad", label: "Comunidad" },
    { href: "/acerca", label: "Acerca de" },
  ],
  en: [
    { href: "/en/explore", label: "Explore" },
    { href: "/en/community", label: "Community" },
    { href: "/en/about", label: "About" },
  ],
};

// Botón para cambiar a la misma página en el otro idioma.
const switcher: Record<Locale, { to: Locale; text: string; label: string }> = {
  es: { to: "en", text: "EN", label: "English version" },
  en: { to: "es", text: "ES", label: "Versión en español" },
};

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const other = switcher[locale];

  return (
    <header className="container site-header">
      <Wordmark locale={locale} />
      <nav aria-label={locale === "es" ? "Principal" : "Main"}>
        <ul className="nav-list">
          {links[locale].map((link) => (
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
            {/* <a> y no <Link>: cada idioma tiene su layout raíz y Next recarga la página igual. */}
            <a
              href={translatePath(pathname, other.to)}
              hrefLang={other.to}
              lang={other.to}
              aria-label={other.label}
              className="nav-link nav-link--quiet"
            >
              {other.text}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
