import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader locale="en" />
      <main>{children}</main>
      <SiteFooter locale="en" />
    </>
  );
}
