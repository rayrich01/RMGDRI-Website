import { cookies } from "next/headers";
import IntentForm from "@/components/admin/IntentForm";

export default async function IntentPage() {
  const cookieStore = await cookies();
  const passphrase = cookieStore.get("admin_session")?.value ?? "";
  return <IntentForm passphrase={passphrase} />;
}
