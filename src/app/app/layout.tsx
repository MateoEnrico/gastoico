import type { ReactNode } from "react";
import { Confirmaciones } from "@/components/confirmaciones";
import { ConSesion } from "@/components/con-sesion";
import { MarcoApp } from "@/components/marco-app";

export default function LayoutApp({ children }: { children: ReactNode }) {
  return (
    <ConSesion>
      <MarcoApp>{children}</MarcoApp>
      <Confirmaciones />
    </ConSesion>
  );
}
