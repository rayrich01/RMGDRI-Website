import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <div className="bg-white">
      {/* Hero Image - Full Width */}
      <div className="relative w-full max-h-[600px] overflow-hidden bg-slate-100">
        <Image
          src="/images/hero/hero-dane-outdoor.jpg"
          alt="Rocky Mountain Great Dane Rescue"
          width={2000}
          height={800}
          className="w-full h-auto object-contain"
          priority
        />
      </div>

      {/* Content Below Image */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Rocky Mountain Great Dane Rescue
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Rescuing, Rehabilitating, and Rehoming Great Danes Since 2000
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/available-danes"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Meet Our Danes
            </Link>
            <Link
              href="/donate-to-rmgdri"
              className="inline-block bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Support Our Mission
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
