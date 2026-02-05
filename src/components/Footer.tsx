import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Column 1: Adopt */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-teal-400">Adopt</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/available-danes" className="hover:text-white transition-colors">Available Danes</Link></li>
              <li><Link href="/adoption-information" className="hover:text-white transition-colors">Adoption Information</Link></li>
              <li><Link href="/adoption-application" className="hover:text-white transition-colors">Apply to Adopt</Link></li>
              <li><Link href="/adopt-a-senior" className="hover:text-white transition-colors">Adopt a Senior</Link></li>
              <li><Link href="/foster-a-great-dane" className="hover:text-white transition-colors">Foster a Dane</Link></li>
              <li><Link href="/foster-application" className="hover:text-white transition-colors">Apply to Foster</Link></li>
              <li><Link href="/successes" className="hover:text-white transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          {/* Column 2: Get Involved */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-teal-400">Get Involved</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/donate-to-rmgdri" className="hover:text-white transition-colors">Donate</Link></li>
              <li><Link href="/sponsor-a-dane" className="hover:text-white transition-colors">Sponsor a Dane</Link></li>
              <li><Link href="/rehome-a-dane" className="hover:text-white transition-colors">Rehome a Dane</Link></li>
              <li><Link href="/shelter-transfers" className="hover:text-white transition-colors">Shelter Transfers</Link></li>
              <li><Link href="/utah-events" className="hover:text-white transition-colors">Utah Events</Link></li>
            </ul>
          </div>

          {/* Column 3: Learn */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-teal-400">Learn</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about-great-danes" className="hover:text-white transition-colors">About Great Danes</Link></li>
              <li><Link href="/great-dane-health-care" className="hover:text-white transition-colors">Health Care</Link></li>
              <li><Link href="/about-rmgdri" className="hover:text-white transition-colors">About RMGDRI</Link></li>
              <li><Link href="/our-mission" className="hover:text-white transition-colors">Our Mission</Link></li>
              <li><Link href="/our-organization" className="hover:text-white transition-colors">Our Organization</Link></li>
              <li><Link href="/our-board" className="hover:text-white transition-colors">Our Board</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-teal-400">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="mailto:info@rmgreatdane.org" className="hover:text-white transition-colors">
                  info@rmgreatdane.org
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/rmgdri" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Facebook
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-sm text-gray-500">501(c)3 Non-Profit</p>
              <p className="text-sm text-gray-500">EIN: 84-1565402</p>
              <p className="text-sm text-gray-500 mt-1">PACFA Licensed</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Rocky Mountain Great Dane Rescue, Inc. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Serving Colorado, Utah, Wyoming, Idaho, Montana &amp; New Mexico
          </p>
        </div>
      </div>
    </footer>
  )
}
