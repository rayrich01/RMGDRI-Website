import Link from 'next/link'
import { client } from '../../sanity/lib/client'
import HeroCarousel from '../../components/HeroCarousel'

type Dog = {
  name: string
  slug: string
  heroImage?: { asset: { url: string } }
}

async function getFeaturedDogs() {
  return client.fetch<Dog[]>(
    `*[_type == "dog" && status == "available"] | order(_createdAt desc) [0...3] {
      name,
      "slug": slug.current,
      heroImage { asset-> { url } }
    }`
  )
}

export default async function Home() {
  const featured = await getFeaturedDogs()

  return (
    <main>
      <HeroCarousel />

      {/* Mission */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Rocky Mountain Great Dane Rescue, Inc
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed">
            We rescue, rehabilitate and rehome Great Danes and Dane mixes. We help those
            that have been abused, abandoned, neglected or through no fault of their current
            family, just need to find a new forever home.
          </p>
          <p className="text-lg text-gray-600 mb-4">
            Serving Colorado, Utah, Wyoming, Idaho, Montana and New Mexico
          </p>
          <p className="text-sm text-gray-500 italic">
            We are a 501(c)3 Non-Profit Organization and PACFA Licensed with the CO Dept. of Agriculture
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-emerald-600 mb-3">59</div>
              <div className="text-lg text-gray-700 font-medium">Successful Adoptions in 2025</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-emerald-600 mb-3">77</div>
              <div className="text-lg text-gray-700 font-medium">Successful Adoptions in 2024</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-emerald-600 mb-3">2,532</div>
              <div className="text-lg text-gray-700 font-medium">Successful Adoptions Since 2000</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dogs */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Available Danes</h2>
          {featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featured.map((dog) => (
                <div key={dog.slug} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="relative h-96 w-full overflow-hidden">
                      {dog.heroImage?.asset?.url ? (
                        <img
                          src={dog.heroImage.asset.url}
                          alt={dog.name}
                          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
                          <span className="text-8xl">🐾</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{dog.name}</h3>
                      <Link
                        href={`/available-danes/${dog.slug}`}
                        className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                      >
                        More on {dog.name}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-xl text-gray-600 mb-4">Check back soon for available danes!</p>
              <Link href="/available-danes" className="text-teal-600 hover:text-teal-700 font-semibold">
                View All Dogs →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
          <p className="text-lg text-gray-300 mb-8">
            Follow us on social media to see our latest rescues, adoption successes, and events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.facebook.com/rmgdri"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Follow on Facebook
            </a>
            <Link
              href="/donate-to-rmgdri"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Support Our Mission
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
