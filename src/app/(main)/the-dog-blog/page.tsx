import Link from 'next/link'
import { client } from '../../../sanity/lib/client'

type BlogPost = {
  title: string
  slug: string
  publishedAt?: string
  excerpt?: string
  images?: { asset: { url: string } }[]
}

async function getBlogPosts() {
  return client.fetch<BlogPost[]>(
    `*[_type == "successStory"] | order(publishedAt desc) [0...20] {
      title,
      "slug": slug.current,
      publishedAt,
      excerpt,
      images[] { asset-> { url } }
    }`
  )
}

export const metadata = {
  title: 'The Dog Blog | RMGDRI',
  description: 'Read success stories and updates from Rocky Mountain Great Dane Rescue.',
}

export default async function DogBlogPage() {
  const posts = await getBlogPosts()

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

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/the-dog-blog/${post.slug}`}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Image */}
                {post.images && post.images.length > 0 ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.images[0].asset.url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
                    <span className="text-6xl">🐾</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors mb-2">
                    {post.title}
                  </h2>

                  {post.publishedAt && (
                    <p className="text-sm text-gray-500 mb-3">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}

                  {post.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  )}

                  <span className="text-teal-600 font-semibold text-sm">
                    Read Story →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <span className="text-6xl mb-4 block">📝</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Stories Coming Soon
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              We&apos;re adding success stories and updates. Check back soon to read about our amazing Great Danes!
            </p>
            <Link
              href="/successes"
              className="inline-block mt-6 text-teal-600 hover:text-teal-700 font-semibold"
            >
              View Success Stories by Year →
            </Link>
          </div>
        )}

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
