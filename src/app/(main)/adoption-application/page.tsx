import { redirect } from "next/navigation";

/**
 * Adoption Application — redirects to legacy Jotform for launch safety.
 * TTP-RMGDRI-JOTFORM-CUTOVER-SAFETY-001
 *
 * Internal Stage 1 form preserved at /apply/adopt (auth-gated).
 */
export default function AdoptionApplicationPage() {
  redirect("https://form.jotform.com/RMGDRI/adoption-foster-application");
}
