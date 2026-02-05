import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-white text-lg font-bold mb-3">
              Rocky Mountain Great Dane Rescue
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              A 501(c)(3) nonprofit saving gentle giants since 2000.
              Serving Colorado, Utah, Wyoming, Idaho, Montana, and New Mexico.
            </p>
            <p className="text-sm">
              EIN: [Tax ID]
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dogs" className="hover:text-teal-400 transition-colors">
                  Available Dogs
                </Link>
              </li>
              <li>
                <Link href="/foster-a-great-dane" className="hover:text-teal-400 transition-colors">
                  Foster
                </Link>
              </li>
              <li>
                <Link href="/donate-to-rmgdri" className="hover:text-teal-400 transition-colors">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/about-rmgdri" className="hover:text-teal-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:info@rmgreatdane.org" className="hover:text-teal-400 transition-colors">
                  info@rmgreatdane.org
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/rmgdri" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} Rocky Mountain Great Dane Rescue, Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Saving gentle giants, one Dane at a time.</p>
        </div>
      </div>
    </footer>
  )
}
