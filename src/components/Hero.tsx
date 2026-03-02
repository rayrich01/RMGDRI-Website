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
            Rocky Mountain Great Dane Rescue, Inc
          </h1>
          <p className="text-xl md:text-2xl text-gray-700">
            Rescuing, Rehabilitating, and Rehoming Great Danes Since 2000
          </p>
        </div>
      </div>
    </div>
  )
}
