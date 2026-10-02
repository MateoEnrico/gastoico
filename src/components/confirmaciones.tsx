"use client";

import { Check } from "lucide-react";
import { useConfirmacion } from "@/lib/confirmacion";

export function Confirmaciones() {
  const actual = useConfirmacion();
  if (!actual) return null;
  return (
    <div
      key={actual.id}
      role="status"
      className="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)_+_5.75rem)] z-50 mx-auto flex max-w-md items-center gap-2.5 rounded-tarjeta bg-cipres px-4 py-3 text-sm text-piedra shadow-lg lg:bottom-6"
    >
      <Check className="size-4 shrink-0 text-bronce" strokeWidth={2.25} aria-hidden="true" />
      {actual.texto}
    </div>
  );
}
