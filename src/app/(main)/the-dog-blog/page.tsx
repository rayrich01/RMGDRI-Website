import Link from 'next/link'

export const metadata = {
  title: 'The Dog Blog | RMGDRI',
  description: 'Read success stories and updates from Rocky Mountain Great Dane Rescue.',
}

export default function DogBlogPage() {
  return (
    <main className="pb-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">The Dog Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stories of hope, love, and second chances. Read about our Great Danes who found their forever homes.
          </p>
        </div>

        {/* Redirect Info */}
        <div className="text-center py-16 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl">
          <span className="text-6xl mb-4 block">🐾</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Success Stories Have Moved!
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8 text-lg">
            Check out our Adoption Successes page to read heartwarming stories of Great Danes who found their forever homes, organized by year.
          </p>
          <Link
            href="/adoption-successes"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg"
          >
            View Adoption Successes →
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-xl text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Want to Add Your Story?
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            If you&apos;ve adopted a Great Dane from RMGDRI, we&apos;d love to hear about your journey together!
          </p>
          <Link
            href="/available-danes"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Adopt a Great Dane
          </Link>
        </div>
      </div>
    </main>
  )
}
