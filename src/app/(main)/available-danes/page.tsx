import { client } from '../../../sanity/lib/client'
import Link from 'next/link'

type Dog = {
  name: string
  slug: string
  status: string
  sex?: string
  age?: string
  coatColor?: string
  sizeCategory?: string
  shortDescription?: string
}

async function getDogs() {
  return client.fetch<Dog[]>(
    `*[_type == "dog"] | order(name asc) {
      name,
      "slug": slug.current,
      status,
      sex,
      age,
      coatColor,
      sizeCategory,
      shortDescription
    }`
  )
}

export const metadata = {
  title: 'Available Dogs | RMGDRI',
  description: 'Meet our Great Danes available for adoption through Rocky Mountain Great Dane Rescue.',
}

export default async function DogsPage() {
  const dogs = await getDogs()
  const available = dogs.filter(d => d.status === 'available')
  const other = dogs.filter(d => d.status !== 'available')

  return (
    <main>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Adopt a Great Dane</h1>
          <p className="text-lg text-teal-100 max-w-2xl mx-auto">
            Every one of these gentle giants is looking for their forever home.
            Could you be the one?
          </p>
        </div>
      </section>

      {/* Available Dogs */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Dogs
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({available.length} {available.length === 1 ? 'dog' : 'dogs'})
              </span>
            </h2>
          </div>

          {available.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-600 text-lg">
                No dogs currently available. Check back soon or consider fostering!
              </p>
              <Link
                href="/foster-a-great-dane"
                className="inline-block mt-4 text-teal-600 hover:text-teal-700 font-semibold"
              >
                Learn About Fostering →
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {available.map((dog) => (
                <DogCard key={dog.slug} dog={dog} />
              ))}
            </div>
          )}

          {/* Other Dogs */}
          {other.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Previously Adopted
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({other.length})
                </span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {other.map((dog) => (
                  <DogCard key={dog.slug} dog={dog} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-teal-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Don&apos;t See Your Perfect Match?
          </h2>
          <p className="text-gray-700 mb-6">
            New dogs become available regularly. You can also foster to help a dog
            in need while waiting for the right fit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/foster-a-great-dane"
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Become a Foster
            </Link>
            <Link
              href="/about-rmgdri"
              className="border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function DogCard({ dog }: { dog: Dog }) {
  return (
    <Link
      href={`/available-danes/${dog.slug}`}
      className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
    >
      {/* Placeholder for future image */}
      <div className="bg-gradient-to-br from-teal-100 to-emerald-100 h-48 flex items-center justify-center">
        <span className="text-6xl">🐾</span>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
            {dog.name}
          </h3>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            dog.status === 'available'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {dog.status}
          </span>
        </div>

        {/* Quick Details */}
        <div className="flex flex-wrap gap-2 mb-3">
          {dog.coatColor && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">
              {dog.coatColor}
            </span>
          )}
          {dog.sex && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">
              {dog.sex}
            </span>
          )}
          {dog.age && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {dog.age}
            </span>
          )}
          {dog.sizeCategory && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">
              {dog.sizeCategory}
            </span>
          )}
        </div>

        {dog.shortDescription && (
          <p className="text-gray-600 text-sm line-clamp-2">
            {dog.shortDescription}
          </p>
        )}
      </div>
    </Link>
  )
}
