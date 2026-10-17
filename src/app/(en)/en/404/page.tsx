import type { Metadata } from "next";
import Link from "next/link";

// Se exporta como out/en/404.html. Con not_found_handling "404-page", Cloudflare
// sirve el 404.html más cercano, así que las URLs rotas bajo /en reciben este
// y el resto el de global-not-found.tsx. Bilingüe, igual que ese.
export const metadata: Metadata = {
  title: { absolute: "Page not found · humanoydev" },
  robots: { index: false },
};

export default function NotFoundEn() {
  return (
    <main className="container page">
      <h1 className="page-title">This page doesn’t exist</h1>
      <p className="page-intro">The link may be broken, or the content hasn’t been published yet.</p>
      <div className="actions" style={{ marginTop: 32 }}>
        <Link href="/en" className="btn btn--primary">
          Back to the home page
        </Link>
        <Link href="/en/explore" className="btn btn--outline">
          Explore the content
        </Link>
      </div>
      <p lang="es" className="page-intro" style={{ marginTop: 48 }}>
        Esta página no existe. <Link href="/">Ir al inicio en español</Link>.
      </p>
    </main>
  );
}
