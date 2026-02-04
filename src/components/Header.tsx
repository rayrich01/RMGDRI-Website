import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-gray-900 hover:opacity-80">
          RMGDRI
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/dogs" className="font-semibold text-gray-900 hover:opacity-80">
            Dogs
          </Link>
        </nav>
      </div>
    </header>
  );
}
