import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getByYear, getYears } from '@/lib/adoption-successes'
import { YearGrid } from './year-grid'

const VALID_YEARS = [2022, 2023, 2024, 2025]

type Props = {
  params: Promise<{ year: string }>
}

export async function generateMetadata({ params }: Props) {
  const { year } = await params
  return {
    title: `${year} Adoption Successes | RMGDRI`,
    description: `Great Danes adopted through Rocky Mountain Great Dane Rescue in ${year}.`,
  }
}

export async function generateStaticParams() {
  return getYears().map(({ year }) => ({ year: String(year) }))
}

export default async function YearPage({ params }: Props) {
  const { year: yearStr } = await params
  const year = parseInt(yearStr, 10)

  if (!VALID_YEARS.includes(year)) notFound()

  const successes = getByYear(year)
  const yearIndex = VALID_YEARS.indexOf(year)
  const prevYear = yearIndex > 0 ? VALID_YEARS[yearIndex - 1] : null
  const nextYear = yearIndex < VALID_YEARS.length - 1 ? VALID_YEARS[yearIndex + 1] : null

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link
            href="/adoption-successes"
            className="text-teal-200 hover:text-white font-medium mb-4 inline-block"
          >
            &larr; All Successes
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {year} Adoptions
          </h1>
          <p className="text-lg text-teal-100">
            {successes.length} Great Dane{successes.length !== 1 ? 's' : ''}{' '}
            found forever homes in {year}
          </p>
        </div>
      </section>

      {/* Interactive Grid (client component) */}
      <YearGrid successes={successes} year={year} />

      {/* Year Navigation */}
      <section className="py-8 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          {prevYear ? (
            <Link
              href={`/adoption-successes/${prevYear}`}
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              &larr; {prevYear} Adoptions
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/adoption-successes"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            All Years
          </Link>
          {nextYear ? (
            <Link
              href={`/adoption-successes/${nextYear}`}
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              {nextYear} Adoptions &rarr;
            </Link>
          ) : (
            <span />
          )}
        </div>
      </section>
    </main>
  )
}
