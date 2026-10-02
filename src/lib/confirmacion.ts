"use client";

import { toast } from "sonner";

/**
 * El "Listo: …" que aparece abajo después de guardar algo. Con `deshacer`, ofrece volver atrás: así
 * borrar o archivar no necesita una pregunta de confirmación antes.
 */
export function confirmar(texto: string, deshacer?: () => void) {
  toast(texto, {
    duration: deshacer ? 5000 : 3500,
    action: deshacer ? { label: "Deshacer", onClick: () => (deshacer(), toast("Listo: lo volviste atrás.", { duration: 2500 })) } : undefined,
  });
}
