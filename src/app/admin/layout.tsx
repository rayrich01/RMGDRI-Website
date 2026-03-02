import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RMGDRI Admin",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <a href="/admin/submissions" className="font-semibold text-lg hover:text-gray-200 transition-colors">
          RMGDRI Admin
        </a>
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            Logout
          </button>
        </form>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
