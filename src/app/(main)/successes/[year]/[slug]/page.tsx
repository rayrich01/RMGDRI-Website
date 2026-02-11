import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getByYearAndSlug, getByYear, getYears } from '@/lib/adoption-successes'

function isValidUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

type Props = {
  params: Promise<{ year: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { year, slug } = await params
  const record = getByYearAndSlug(parseInt(year, 10), slug)
  if (!record) return { title: 'Not Found | RMGDRI' }
  return {
    title: `${record.name} - ${year} Adoption Success | RMGDRI`,
    description: record.blog_text
      ? record.blog_text.slice(0, 160)
      : `${record.name} found a forever home through Rocky Mountain Great Dane Rescue in ${year}.`,
  }
}

export async function generateStaticParams() {
  const years = getYears()
  const params: { year: string; slug: string }[] = []
  for (const { year } of years) {
    const records = getByYear(year)
    for (const r of records) {
      params.push({ year: String(year), slug: r.slug })
    }
  }
  return params
}

export default async function SuccessDetailPage({ params }: Props) {
  const { year: yearStr, slug } = await params
  const year = parseInt(yearStr, 10)
  const record = getByYearAndSlug(year, slug)

  if (!record) notFound()

  const hasImage = !!record.hero_image_ref && isValidUrl(record.hero_image_ref)
  const adoptionDate = record.adoption_date
    ? new Date(record.adoption_date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const paragraphs = record.blog_text
    ? record.blog_text
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
    : []

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Image */}
      <section className="relative bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[16/9] md:aspect-[2/1]">
            {hasImage ? (
              <Image
                src={record.hero_image_ref}
                alt={record.name}
                fill
                className="object-contain bg-gray-900"
                priority
                sizes="(max-width: 768px) 100vw, 896px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <span className="text-6xl text-gray-600">?</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link
            href="/successes"
            className="hover:text-teal-600 transition-colors"
          >
            Successes
          </Link>
          <span>/</span>
          <Link
            href={`/successes/${year}`}
            className="hover:text-teal-600 transition-colors"
          >
            {year}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{record.name}</span>
        </nav>

        {/* Name + Date */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          {record.name}
        </h1>
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {adoptionDate && (
            <p className="text-gray-600">
              <span className="font-medium">Adopted:</span> {adoptionDate}
            </p>
          )}
          {record.color && (
            <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {record.color}
            </span>
          )}
        </div>

        {/* Blog Text */}
        {paragraphs.length > 0 ? (
          <div className="prose prose-lg max-w-none text-gray-700">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <p className="text-amber-800 font-medium">Content pending</p>
            <p className="text-amber-700 text-sm mt-1">
              {record.name}&apos;s full adoption story is being prepared and will
              appear here soon.
            </p>
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href={`/successes/${year}`}
            className="inline-flex items-center text-teal-600 hover:text-teal-700 font-semibold"
          >
            &larr; Back to {year} Adoptions
          </Link>
        </div>
      </section>
    </main>
  )
}
