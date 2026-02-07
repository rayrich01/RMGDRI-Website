import Link from 'next/link'

export const metadata = {
  title: 'About RMGDRI | Rocky Mountain Great Dane Rescue',
  description: 'Learn about Rocky Mountain Great Dane Rescue, our mission, history, and how we operate.',
}

export default function AboutPage() {
  return (
    <main className="pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-900">About RMGDRI</h1>

        {/* Mission Banner */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-lg mb-10">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Mission</h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            We rescue, rehabilitate and rehome Great Danes and Dane mixes. We help those
            that have been abused, abandoned, neglected or through no fault of their current
            family, just need to find a new forever home.
          </p>
          <p className="text-lg text-gray-600 font-semibold">
            Serving Colorado, Utah, Wyoming, Idaho, Montana and New Mexico
          </p>
          <p className="text-sm text-gray-500 italic mt-4">
            We are a 501(c)3 Non-Profit Organization and PACFA Licensed with the CO Dept. of Agriculture
          </p>
        </div>

        <div className="space-y-8 text-gray-700">
          {/* History */}
          <section>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Our History</h3>
            <p className="text-lg leading-relaxed">
              Since our founding in 2000, RMGDRI has successfully placed over 2,500 Great Danes
              into loving forever homes. What started as a small group of dedicated Great Dane lovers
              has grown into a respected rescue organization serving six states across the Rocky Mountain region.
            </p>
          </section>

          {/* What We Do */}
          <section>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">What We Do</h3>
            <div className="space-y-3">
              {[
                'Rescue Great Danes from shelters, owner surrenders, and dangerous situations',
                'Provide comprehensive medical care, including vaccinations, spay/neuter, and treatment for injuries or illnesses',
                'Place dogs in loving foster homes where they receive socialization and training',
                'Match dogs with carefully screened adoptive families',
                'Provide ongoing support and resources to adopters',
                'Educate the public about responsible Great Dane ownership',
              ].map((item, i) => (
                <div key={i} className="flex items-start">
                  <span className="text-xl text-teal-600 mr-3 mt-1">✓</span>
                  <span className="text-lg">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Service Area */}
          <section>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Service Area</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Colorado', 'Utah', 'Wyoming', 'Idaho', 'Montana', 'New Mexico'].map((state) => (
                <div key={state} className="bg-white border-2 border-teal-200 rounded-lg p-4 text-center">
                  <span className="text-2xl block mb-2">📍</span>
                  <p className="font-semibold text-gray-900">{state}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How We Operate */}
          <section>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">How We Operate</h3>
            <div className="space-y-4">
              <div className="flex items-start bg-gray-50 p-5 rounded-lg">
                <span className="text-2xl mr-4 mt-1">❤️</span>
                <div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">All-Volunteer Organization</h4>
                  <p className="text-gray-700">
                    RMGDRI is run entirely by dedicated volunteers who donate their time, energy, and resources.
                    From foster families to adoption coordinators, every person involved is passionate about making a difference.
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-gray-50 p-5 rounded-lg">
                <span className="text-2xl mr-4 mt-1">🏠</span>
                <div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">Foster-Based Network</h4>
                  <p className="text-gray-700">
                    We do not operate a shelter facility. All of our dogs live in foster homes where they receive
                    individualized care, training, and socialization in a home environment.
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-gray-50 p-5 rounded-lg">
                <span className="text-2xl mr-4 mt-1">🛡️</span>
                <div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">Licensed &amp; Certified</h4>
                  <p className="text-gray-700">
                    RMGDRI is a 501(c)3 non-profit organization and is PACFA licensed with the Colorado
                    Department of Agriculture, ensuring we meet the highest standards of animal care.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Impact */}
          <section>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Impact</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center bg-teal-50 p-6 rounded-lg">
                <div className="text-5xl font-bold text-teal-600 mb-2">2,532</div>
                <p className="text-gray-700 font-semibold">Dogs Rescued Since 2000</p>
              </div>
              <div className="text-center bg-teal-50 p-6 rounded-lg">
                <div className="text-5xl font-bold text-teal-600 mb-2">77</div>
                <p className="text-gray-700 font-semibold">Adoptions in 2024</p>
              </div>
              <div className="text-center bg-teal-50 p-6 rounded-lg">
                <div className="text-5xl font-bold text-teal-600 mb-2">6</div>
                <p className="text-gray-700 font-semibold">States Served</p>
              </div>
            </div>
          </section>

          {/* Commitment */}
          <div className="bg-teal-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Commitment</h3>
            <p className="text-lg leading-relaxed">
              As a 501(c)3 non-profit organization and PACFA licensed rescue, we are committed to the
              highest standards of animal welfare. Every dog in our care receives the medical attention,
              love, and support they need to thrive. We believe that every Great Dane deserves a second chance.
            </p>
          </div>

          {/* Get Involved */}
          <section className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Get Involved</h3>
            <p className="text-lg leading-relaxed mb-6">
              RMGDRI relies on the generosity of volunteers, foster families, and donors.
              Whether you&apos;re interested in adopting, fostering, or donating, there are many ways to help.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/dogs" className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
                Adopt a Dane
              </Link>
              <Link href="/foster-a-great-dane" className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
                Become a Foster
              </Link>
              <a href="https://greatd.mybigcommerce.com/donate/" target="_blank" rel="noopener noreferrer" className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                Donate Now
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
