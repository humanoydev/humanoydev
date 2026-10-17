import Link from "next/link";

export default function NotFound() {
  return (
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
    </main>
  );
}
