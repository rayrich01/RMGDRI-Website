import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Primary Nav */}
      <nav className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-teal-600 hover:text-teal-700">
            RMGDRI
          </Link>
          <div className="flex items-center gap-1">
            <Link href="/available-danes" className="px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors">
              Adopt
            </Link>
            <Link href="/foster-a-great-dane" className="px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors">
              Foster
            </Link>
            <Link href="/successes" className="px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors">
              Success Stories
            </Link>
            <Link href="/donate-to-rmgdri" className="px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors">
              Donate
            </Link>
            <Link href="/about-rmgdri" className="px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors">
              About
            </Link>
            <Link href="/available-danes" className="ml-3 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Adopt a Dog
            </Link>
          </div>
        </div>
      </nav>

      {/* Secondary Nav */}
      <div className="bg-gray-50 border-t border-gray-100">
        <nav className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-1 h-10 text-sm overflow-x-auto">
            <Link href="/adoption-information" className="px-3 py-1 text-gray-500 hover:text-teal-600 whitespace-nowrap transition-colors">
              Adoption Info
            </Link>
            <Link href="/adopt-a-senior" className="px-3 py-1 text-gray-500 hover:text-teal-600 whitespace-nowrap transition-colors">
              Senior Danes
            </Link>
            <Link href="/sponsor-a-dane" className="px-3 py-1 text-gray-500 hover:text-teal-600 whitespace-nowrap transition-colors">
              Sponsor
            </Link>
            <Link href="/rehome-a-dane" className="px-3 py-1 text-gray-500 hover:text-teal-600 whitespace-nowrap transition-colors">
              Rehome
            </Link>
            <Link href="/about-great-danes" className="px-3 py-1 text-gray-500 hover:text-teal-600 whitespace-nowrap transition-colors">
              About the Breed
            </Link>
            <Link href="/great-dane-health-care" className="px-3 py-1 text-gray-500 hover:text-teal-600 whitespace-nowrap transition-colors">
              Health Care
            </Link>
            <Link href="/shelter-transfers" className="px-3 py-1 text-gray-500 hover:text-teal-600 whitespace-nowrap transition-colors">
              Shelter Transfers
            </Link>
            <Link href="/utah-events" className="px-3 py-1 text-gray-500 hover:text-teal-600 whitespace-nowrap transition-colors">
              Utah Events
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
