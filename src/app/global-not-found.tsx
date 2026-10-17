import type { Metadata } from "next";
import Link from "next/link";
import "./styles";

// Con un layout raíz por idioma no hay un layout común para el 404, así que este
// archivo trae su propio <html> (requiere experimental.globalNotFound). Es bilingüe
// porque no sabemos en qué idioma estaba la URL rota.
export const metadata: Metadata = {
  title: "Esta página no existe · humanoydev",
};

export default function GlobalNotFound() {
  return (
    <html lang="es">
      <body>
        <main className="container page">
          <h1 className="page-title">Esta página no existe</h1>
          <p className="page-intro">Puede que el enlace esté roto o que el contenido todavía no se haya publicado.</p>
          <div className="actions" style={{ marginTop: 32 }}>
            <Link href="/" className="btn btn--primary">
              Volver al inicio
            </Link>
            <Link href="/explorar" className="btn btn--outline">
              Explorar el contenido
            </Link>
          </div>
          <p lang="en" className="page-intro" style={{ marginTop: 48 }}>
            This page doesn’t exist. <Link href="/en">Go to the English home page</Link>.
          </p>
        </main>
      </body>
    </html>
  );
}
