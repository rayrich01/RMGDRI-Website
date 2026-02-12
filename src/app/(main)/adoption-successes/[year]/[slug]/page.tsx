import { notFound } from 'next/navigation'
import Link from 'next/link'

type Props = {
  params: Promise<{ year: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  // TODO: Fetch dog data from Sanity for proper title
  return {
    title: `${slug} - Adoption Success | RMGDRI`,
    description: 'A Great Dane success story from Rocky Mountain Great Dane Rescue.',
  }
}

export default async function AdoptionSuccessDetailPage({ params }: Props) {
  const { year, slug } = await params

  // TODO: Fetch dog from Sanity
  // const dog = await client.fetch<Dog>(
  //   `*[_type == "dog" && slug.current == $slug && adoptionYear == $year][0]`,
  //   { slug, year: parseInt(year) }
  // )
  // if (!dog) notFound()

  return (
    <main>
      {/* Breadcrumb */}
      <section className="bg-gray-50 dark:bg-gray-800 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm text-gray-600 dark:text-gray-400">
            <Link href="/adoption-successes" className="hover:text-teal-600 dark:hover:text-teal-400">
              Adoption Successes
            </Link>
            {' / '}
            <Link href={`/adoption-successes/${year}`} className="hover:text-teal-600 dark:hover:text-teal-400">
              {year}
            </Link>
            {' / '}
            <span className="text-gray-900 dark:text-white">{slug}</span>
          </nav>
        </div>
      </section>

      {/* Content Placeholder */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🐕</span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Success story coming soon for this {year} adoption.
            </p>
            <div className="mt-8">
              <Link
                href={`/adoption-successes/${year}`}
                className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-semibold"
              >
                ← Back to {year} Adoptions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
