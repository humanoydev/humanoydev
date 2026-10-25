// Envoltorio común de la web de Jean Paul André: sus colores y tokens (.jpa). Cada página
// pone su propio fondo: la invitación, las burbujas, el parallax y los juguetes; la portada
// (cápsula del tiempo) tiene otra línea gráfica, .jpc.
export default function JeanPaulAndreLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="jpa">{children}</div>;
}
