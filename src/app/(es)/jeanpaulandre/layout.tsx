import { BubbleField } from "@/components/jeanpaulandre/BubbleField";
import { Parallax } from "@/components/jeanpaulandre/Parallax";

// Envoltorio común de la web de Jean Paul André: sus colores (.jpa), las burbujas de
// fondo de toda la página y el parallax.
export default function JeanPaulAndreLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="jpa">
      <BubbleField />
      <Parallax />
      {children}
    </div>
  );
}
