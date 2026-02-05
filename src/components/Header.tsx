'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleMouseEnter = (menu: string) => setOpenDropdown(menu)
  const handleMouseLeave = () => setOpenDropdown(null)

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-8 text-sm">
          <div className="flex items-center gap-4">
            <a href="mailto:adoptadane@rmgreatdane.org" className="text-gray-600 hover:text-teal-600 transition-colors">
              ✉ adoptadane@rmgreatdane.org
            </a>
            <div className="flex items-center gap-2">
              <a href="https://www.facebook.com/rmgdri" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                FB
              </a>
              <a href="https://www.instagram.com/rmgdri" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600 transition-colors">
                IG
              </a>
            </div>
          </div>

          <a
            href="https://greatd.mybigcommerce.com/donate/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded text-sm font-semibold transition-colors"
          >
            Donate
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 mr-8">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center text-white font-bold text-xs text-center leading-tight">
                RMGDRI
              </div>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {/* Home - no dropdown */}
              <Link href="/" className="px-4 py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors">
                Home
              </Link>

              {/* About Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('about')}
                onMouseLeave={handleMouseLeave}
              >
                <button className="px-4 py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors flex items-center gap-1">
                  About <span className="text-xs">▼</span>
                </button>
                {openDropdown === 'about' && (
                  <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48 z-50">
                    <Link href="/our-mission" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600">Our Mission</Link>
                    <Link href="/our-organization" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600">Our Organization</Link>
                    <Link href="/our-board" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600">Our Board</Link>
                  </div>
                )}
              </div>

              {/* Adopt Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('adopt')}
                onMouseLeave={handleMouseLeave}
              >
                <button className="px-4 py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors flex items-center gap-1">
                  Adopt <span className="text-xs">▼</span>
                </button>
                {openDropdown === 'adopt' && (
                  <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48 z-50">
                    <Link href="/available-danes" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600">Available Danes</Link>
                    <Link href="/adoption-information" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600">Adoption Information</Link>
                    <Link href="/adoption-application" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600">Adoption Application</Link>
                    <Link href="/adopt-a-senior" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600">Adopt a Senior</Link>
                    <Link href="/successes" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600">Success Stories</Link>
                  </div>
                )}
              </div>

              {/* Get Involved Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('involved')}
                onMouseLeave={handleMouseLeave}
              >
                <button className="px-4 py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors flex items-center gap-1">
                  Get Involved <span className="text-xs">▼</span>
                </button>
                {openDropdown === 'involved' && (
                  <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48 z-50">
                    <Link href="/foster-a-great-dane" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600">Foster a Great Dane</Link>
                    <Link href="/foster-application" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600">Foster Application</Link>
                    <Link href="/sponsor-a-dane" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600">Sponsor a Dane</Link>
                    <Link href="/donate-to-rmgdri" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600">Donate</Link>
                  </div>
                )}
              </div>

              {/* Events - no dropdown */}
              <Link href="/utah-events" className="px-4 py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors">
                Events
              </Link>

              {/* Rehome Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('rehome')}
                onMouseLeave={handleMouseLeave}
              >
                <button className="px-4 py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors flex items-center gap-1">
                  Rehome <span className="text-xs">▼</span>
                </button>
                {openDropdown === 'rehome' && (
                  <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48 z-50">
                    <Link href="/rehome-a-dane" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600">Rehome a Dane</Link>
                    <Link href="/shelter-transfers" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600">Shelter Transfers</Link>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/available-danes"
              className="ml-auto bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
            >
              Adopt a Dog
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
