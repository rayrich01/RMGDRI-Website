import Link from 'next/link'

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-600 to-emerald-600 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Rocky Mountain Great Dane Rescue
          </h1>
          <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
            Saving gentle giants since 2000. Over 2,500 Great Danes have found
            their forever homes across Colorado and surrounding states.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dogs"
              className="bg-white text-teal-700 hover:bg-teal-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              Adopt a Dog
            </Link>
            <Link
              href="/foster-a-great-dane"
              className="border-2 border-white text-white hover:bg-white hover:text-teal-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Become a Foster
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-emerald-400">2,500+</p>
              <p className="text-gray-400 text-sm mt-1">Dogs Adopted</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-400">25+</p>
              <p className="text-gray-400 text-sm mt-1">Years of Service</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-400">6</p>
              <p className="text-gray-400 text-sm mt-1">States Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* How You Can Help */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How You Can Help
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🐾</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Adopt</h3>
              <p className="text-gray-600 mb-6">
                Give a gentle giant their forever home. Every adoption saves a life.
              </p>
              <Link href="/dogs" className="text-teal-600 hover:text-teal-700 font-semibold">
                View Available Dogs →
              </Link>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Foster</h3>
              <p className="text-gray-600 mb-6">
                Open your home temporarily. Fostering is the bridge to a second chance.
              </p>
              <Link href="/foster-a-great-dane" className="text-teal-600 hover:text-teal-700 font-semibold">
                Learn About Fostering →
              </Link>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">💚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Donate</h3>
              <p className="text-gray-600 mb-6">
                Your tax-deductible gift covers vet care, food, and shelter for dogs in need.
              </p>
              <Link href="/donate-to-rmgdri" className="text-teal-600 hover:text-teal-700 font-semibold">
                Make a Donation →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-teal-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Rocky Mountain Great Dane Rescue is a 501(c)(3) nonprofit dedicated to rescuing,
            rehabilitating, and rehoming Great Danes across Colorado, Utah, Wyoming, Idaho,
            Montana, and New Mexico. Every dog deserves a chance at a loving home.
          </p>
          <Link
            href="/about-rmgdri"
            className="inline-block mt-8 text-teal-600 hover:text-teal-700 font-semibold"
          >
            Learn More About Us →
          </Link>
        </div>
      </section>
    </main>
  )
}
