import { notFound } from 'next/navigation'
import Link from 'next/link'

type Props = {
  params: Promise<{ year: string }>
}

const VALID_YEARS = ['2022', '2023', '2024', '2025']

export async function generateMetadata({ params }: Props) {
  const { year } = await params
  return {
    title: `${year} Adoption Successes | RMGDRI`,
    description: `Great Danes adopted through Rocky Mountain Great Dane Rescue in ${year}.`,
  }
}

export default async function AdoptionSuccessesYearPage({ params }: Props) {
  const { year } = await params

  if (!VALID_YEARS.includes(year)) {
    notFound()
  }

  // TODO: Fetch dogs from Sanity
  // const dogs = await client.fetch<Dog[]>(
  //   `*[_type == "dog" && adoptionYear == $year] | order(name asc)`,
  //   { year: parseInt(year) }
  // )
  const dogs: unknown[] = [] // Placeholder

  const yearIndex = VALID_YEARS.indexOf(year)
  const prevYear = yearIndex < VALID_YEARS.length - 1 ? VALID_YEARS[yearIndex + 1] : null
  const nextYear = yearIndex > 0 ? VALID_YEARS[yearIndex - 1] : null

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link
            href="/adoption-successes"
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
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          {dogs.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <span className="text-6xl mb-4 block">🐾</span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Stories Coming Soon
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                We&apos;re adding {year} adoption stories. Check back soon to see
                the Great Danes who found their forever homes this year.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* TODO: Render dog cards */}
            </div>
          )}
        </div>
      </section>

      {/* Year Navigation */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          {prevYear ? (
            <Link
              href={`/adoption-successes/${prevYear}`}
              className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-semibold"
            >
              ← {prevYear} Adoptions
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/adoption-successes"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
          >
            All Years
          </Link>
          {nextYear ? (
            <Link
              href={`/adoption-successes/${nextYear}`}
              className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-semibold"
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
}
