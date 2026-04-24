import { redirect } from "next/navigation";

/**
 * Rehome a Dane — redirects to intake pause page.
 * TTP-RMGDRI-INTAKE-PAUSE-PAGE-001
 * Original preserved at page.original.tsx.bak
 */
export default function RehomeADanePage() {
  redirect("/intake-pause");
}
