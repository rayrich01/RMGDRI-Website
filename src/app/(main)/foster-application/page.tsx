import { redirect } from "next/navigation";

/**
 * Foster Application — redirects to legacy Jotform for launch safety.
 * TTP-RMGDRI-JOTFORM-CUTOVER-SAFETY-001
 *
 * Internal Stage 1 form preserved at /apply/foster (auth-gated).
 */
export default function FosterApplicationPage() {
  redirect("https://form.jotform.com/RMGDRI/adoption-foster-application");
}
