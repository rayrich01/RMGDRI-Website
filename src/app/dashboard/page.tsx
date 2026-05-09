import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/dashboard");

  const { data: applications } = await supabase
    .from("applications")
    .select("id, type, status, created_at, updated_at, submitted_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>

      {(!applications || applications.length === 0) ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <p className="text-gray-600 mb-4">You haven&apos;t started any applications yet.</p>
          <Link href="/apply/adopt" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Start Adoption Application
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900 capitalize">{app.type} Application</p>
                <p className="text-sm text-gray-500">
                  {app.status === "draft" ? "Draft — in progress" : `Submitted ${new Date(app.submitted_at!).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  app.status === "draft" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                }`}>
                  {app.status}
                </span>
                {app.status === "draft" && (
                  <Link href={`/apply/${app.type}`} className="text-blue-600 text-sm hover:underline">
                    Continue
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
