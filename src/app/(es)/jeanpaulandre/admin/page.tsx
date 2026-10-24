import type { Metadata } from "next";
import { AdminPanel } from "@/components/jeanpaulandre/AdminPanel";
import { Star } from "@/components/jeanpaulandre/Doodles";
import { BABY_NAME } from "@/content/jeanpaulandre";

// jeanpaulandre.humanoydev.com/admin: lo protege Cloudflare Access (y la API verifica el login).
export const metadata: Metadata = {
  title: { absolute: `Invitados · ${BABY_NAME}` },
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <>
      <header className="container jpa__top">
        {/* <a> y no <Link>: en el subdominio "/" es la portada del bebé (la reescribe el Worker). */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="jpa__brand">
          <Star className="jpa__brand-star" />
          {BABY_NAME}
        </a>
        <p>Administración</p>
      </header>
      <main>
        <AdminPanel />
      </main>
    </>
  );
}
