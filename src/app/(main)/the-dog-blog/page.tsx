import Link from 'next/link'
import { client } from '@/lib/sanity/client'

export const revalidate = 60

export const metadata = {
  title: 'The Dog Blog | RMGDRI',
  description: 'Read success stories and updates from Rocky Mountain Great Dane Rescue.',
}

type BlogStory = {
  _id: string
  title: string
  slug: string
  publishedAt?: string
  excerpt?: string
  featuredImage?: { asset: { url: string }; alt?: string }
}

async function getStories() {
  return client.fetch<BlogStory[]>(
    `*[_type == "successStory" && defined(slug.current)] | order(publishedAt desc, _createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      excerpt,
      featuredImage { asset->{url}, alt }
    }`
  )
}

export default async function DogBlogPage() {
  const stories = await getStories()

  return (
    <main className="pb-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">The Dog Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stories, updates, and reflections from Rocky Mountain Great Dane Rescue.
          </p>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl">
            <span className="text-6xl mb-4 block">🐾</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h2>
            <p className="text-gray-700">Check back soon — new stories are on the way.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {stories.map((story) => {
              const formattedDate = story.publishedAt
                ? new Date(story.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : null

              return (
                <Link
                  key={story._id}
                  href={`/the-dog-blog/${story.slug}`}
                  className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-teal-300 transition-all"
                >
                  {story.featuredImage?.asset?.url && (
                    <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                      <img
                        src={story.featuredImage.asset.url}
                        alt={story.featuredImage.alt || story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {formattedDate && (
                      <p className="text-sm text-gray-500 mb-2">📅 {formattedDate}</p>
                    )}
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors">
                      {story.title}
                    </h2>
                    {story.excerpt && (
                      <p className="text-gray-700 leading-relaxed">{story.excerpt}</p>
                    )}
                    <span className="inline-block mt-4 text-teal-600 font-semibold group-hover:text-teal-700">
                      Read more →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
