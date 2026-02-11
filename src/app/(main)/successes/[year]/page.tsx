<<<<<<< HEAD
import { client } from '@/lib/sanity/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'

type Dog = {
  name: string
  slug: string
  coatColor?: string
  sex?: string
  shortDescription?: string
  heroImage?: {
    asset: {
      url: string
    }
  }
  sourceWp?: {
    blogUrl?: string
  }
}
=======
import { redirect } from 'next/navigation'
>>>>>>> bcccbb5 (feat: Lori review fixes (volunteer/sponsor updates + assets))

type Props = {
  params: Promise<{ year: string }>
}

<<<<<<< HEAD
const VALID_YEARS = ['2022', '2023', '2024', '2025']

async function getDogsByYear(year: string) {
  return client.fetch<Dog[]>(
    `*[_type == "dog" && adoptionYear == $year] | order(name asc) {
      name,
      "slug": slug.current,
      coatColor,
      sex,
      shortDescription,
      heroImage {
        asset-> { url }
      },
      sourceWp
    }`,
    { year: parseInt(year) }
  )
}

export async function generateMetadata({ params }: Props) {
  const { year } = await params
  return {
    title: `${year} Adoption Successes | RMGDRI`,
    description: `Great Danes adopted through Rocky Mountain Great Dane Rescue in ${year}.`,
  }
}

export default async function YearPage({ params }: Props) {
  const { year } = await params

  if (!VALID_YEARS.includes(year)) {
    notFound()
  }

  const dogs = await getDogsByYear(year)

  const yearIndex = VALID_YEARS.indexOf(year)
  const prevYear = yearIndex < VALID_YEARS.length - 1 ? VALID_YEARS[yearIndex + 1] : null
  const nextYear = yearIndex > 0 ? VALID_YEARS[yearIndex - 1] : null

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link
            href="/successes"
            className="text-teal-200 hover:text-white font-medium mb-4 inline-block"
          >
            ← All Successes
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{year} Adoptions</h1>
          <p className="text-lg text-teal-100">
            {dogs.length > 0
              ? `${dogs.length} Great Dane${dogs.length !== 1 ? 's' : ''} found forever homes in ${year}`
              : `Stories from ${year} coming soon`
            }
          </p>
        </div>
      </section>

      {/* Dog Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          {dogs.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <span className="text-6xl mb-4 block">🐾</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Stories Coming Soon
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                We&apos;re adding {year} adoption stories. Check back soon to see
                the Great Danes who found their forever homes this year.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {dogs.map((dog) => (
                <DogSuccessCard key={dog.slug} dog={dog} year={year} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Year Navigation */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          {prevYear ? (
            <Link
              href={`/successes/${prevYear}`}
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              ← {prevYear} Adoptions
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/successes"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            All Years
          </Link>
          {nextYear ? (
            <Link
              href={`/successes/${nextYear}`}
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              {nextYear} Adoptions →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </section>
    </main>
  )
=======
export default async function SuccessesYearRedirect({ params }: Props) {
  const { year } = await params
  redirect(`/adoption-successes/${year}`)
>>>>>>> bcccbb5 (feat: Lori review fixes (volunteer/sponsor updates + assets))
}

function DogSuccessCard({ dog, year }: { dog: Dog; year: string }) {
  // Link to blog if available, otherwise to dog detail
  const href = dog.sourceWp?.blogUrl || `/dogs/${dog.slug}`

  return (
    <Link
      href={href}
      className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all"
    >
      {/* Image or Placeholder */}
      {dog.heroImage?.asset?.url ? (
        <div className="aspect-square overflow-hidden">
          <img
            src={dog.heroImage.asset.url}
            alt={dog.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-square bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
          <span className="text-4xl">🐾</span>
        </div>
      )}

      <div className="p-3">
        <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors truncate">
          {dog.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Adopted {year}
          {dog.coatColor && ` · ${dog.coatColor}`}
        </p>
      </div>
    </Link>
  )
}
