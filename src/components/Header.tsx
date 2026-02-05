import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-teal-600 hover:text-teal-700">
            RMGDRI
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            <Link href="/dogs" className="px-4 py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors">
              Adopt
            </Link>
            <Link href="/foster-a-great-dane" className="px-4 py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors">
              Foster
            </Link>
            <Link href="/donate-to-rmgdri" className="px-4 py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors">
              Donate
            </Link>
            <Link href="/about-rmgdri" className="px-4 py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors">
              About
            </Link>
            <Link href="/dogs" className="ml-3 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Adopt a Dog
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
