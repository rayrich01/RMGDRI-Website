import { client } from '@/lib/sanity/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'

type Props = {
  params: Promise<{ slug: string }>
}

type SuccessStory = {
  title: string
  slug: string
  publishedAt?: string
  excerpt?: string
  body?: string
  dogs?: { name: string; slug: string }[]
  images?: { asset: { url: string }; alt?: string; caption?: string }[]
}

async function getStory(slug: string) {
  return client.fetch<SuccessStory>(
    `*[_type == "successStory" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      publishedAt,
      excerpt,
      "body": pt::text(body),
      dogs[]-> { name, "slug": slug.current },
      images[] { asset-> { url }, alt, caption }
    }`,
    { slug }
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const story = await getStory(slug)
  if (!story) return {}
  return {
    title: `${story.title} | RMGDRI`,
    description: story.excerpt || `Read about ${story.title} from Rocky Mountain Great Dane Rescue.`,
  }
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params
  const story = await getStory(slug)

  if (!story) {
    notFound()
  }

  const formattedDate = story.publishedAt
    ? new Date(story.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <main className="pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <article>
          {/* Back Link */}
          <Link
            href="/successes"
            className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-2 mb-6"
          >
            ← Back to Success Stories
          </Link>

          {/* Title */}
          <h1 className="text-5xl font-bold mb-4 text-gray-900">{story.title}</h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-gray-600 text-sm mb-8">
            {formattedDate && (
              <span className="flex items-center gap-2">
                📅 {formattedDate}
              </span>
            )}
            <span className="flex items-center gap-2">
              👤 RMGDRI Team
            </span>
          </div>

          {/* Hero Image */}
          {story.images && story.images.length > 0 && (
            <div className="mb-8">
              <img
                src={story.images[0].asset.url}
                alt={story.images[0].alt || story.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
              {story.images[0].caption && (
                <p className="text-sm text-gray-500 mt-2 text-center italic">
                  {story.images[0].caption}
                </p>
              )}
            </div>
          )}

          {/* Body */}
          {story.excerpt && (
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              {story.excerpt}
            </p>
          )}

          {story.body && (
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              {story.body.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}

          {/* Additional Images */}
          {story.images && story.images.length > 1 && (
            <div className="grid grid-cols-2 gap-4 my-8">
              {story.images.slice(1).map((img, i) => (
                <img
                  key={i}
                  src={img.asset.url}
                  alt={img.alt || `${story.title} photo ${i + 2}`}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              ))}
            </div>
          )}

          {/* Congratulations */}
          {story.dogs && story.dogs.length > 0 && (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8">
              <p className="text-gray-800 font-semibold mb-2">
                Congratulations {story.dogs.map(d => d.name).join(' & ')}! 🎉
              </p>
              <p className="text-gray-700">
                We wish you a lifetime of happiness, belly rubs, and adventures with your amazing new family!
              </p>
            </div>
          )}

          {/* Related Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Learn More</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/available-danes"
                className="p-4 border border-gray-200 rounded-lg hover:border-teal-500 hover:shadow-md transition-all"
              >
                <h4 className="font-semibold text-gray-900 mb-2">Available Danes</h4>
                <p className="text-sm text-gray-600">Meet our current Great Danes looking for homes</p>
              </Link>
              <Link
                href="/successes"
                className="p-4 border border-gray-200 rounded-lg hover:border-teal-500 hover:shadow-md transition-all"
              >
                <h4 className="font-semibold text-gray-900 mb-2">More Success Stories</h4>
                <p className="text-sm text-gray-600">Read about more happy endings</p>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}
