import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader locale="es" />
      <main>{children}</main>
      <SiteFooter locale="es" />
    </>
  );
}
