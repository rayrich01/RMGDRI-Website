import Link from 'next/link'
import { getYears } from '@/lib/adoption-successes'

export const metadata = {
  title: 'Adoption Successes | RMGDRI',
  description:
    'Celebrate the Great Danes who found their forever homes through Rocky Mountain Great Dane Rescue.',
}

export default function AdoptionSuccessesPage() {
  const yearCounts = getYears()
  const totalAdoptions = yearCounts.reduce((sum, y) => sum + y.count, 0)

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Adoption Successes
          </h1>
          <p className="text-lg text-teal-100 max-w-2xl mx-auto">
            Every dog here found their forever home thanks to our amazing
            adopters, fosters, and supporters. Browse by year to see their
            stories.
          </p>
        </div>
      </section>

      {/* Year Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {yearCounts.map(({ year, count }) => (
              <Link
                key={year}
                href={`/adoption-successes/${year}`}
                className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="bg-gradient-to-br from-teal-100 to-emerald-100 h-40 flex items-center justify-center">
                  <span className="text-6xl font-bold text-teal-600 group-hover:scale-110 transition-transform">
                    {year}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                    {year} Adoptions
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {count} Great Dane{count !== 1 ? 's' : ''} found forever
                    homes
                  </p>
                  <span className="inline-block mt-4 text-teal-600 font-semibold">
                    View Stories &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-teal-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {totalAdoptions} Happy Endings &mdash; And Counting
          </h2>
          <p className="text-gray-700 mb-6">
            Want to add to our success stories? Adopt, foster, or donate to help
            the next gentle giant find their home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/available-danes"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Adopt a Dog
            </Link>
            <Link
              href="/donate-to-rmgdri"
              className="border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Make a Donation
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
