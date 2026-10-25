import { BubbleField } from "@/components/jeanpaulandre/BubbleField";
import { Parallax } from "@/components/jeanpaulandre/Parallax";
import { ToyShow } from "@/components/jeanpaulandre/Toy";

// Envoltorio común de la web de Jean Paul André: sus colores (.jpa), las burbujas de
// fondo de toda la página, el parallax y los juguetes que reaccionan solos.
export default function JeanPaulAndreLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="jpa">
      <BubbleField />
      <Parallax />
      <ToyShow />
      {children}
    </div>
  );
}
