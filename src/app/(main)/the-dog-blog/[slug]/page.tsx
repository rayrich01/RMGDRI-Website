import { client } from '@/lib/sanity/client'
import { urlFor } from '@/lib/sanity/client'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

type SuccessStory = {
  title: string
  slug: string
  publishedAt?: string
  excerpt?: string
  content?: any[]
  featuredImage?: { asset: { url: string }; alt?: string }
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-teal-500 pl-6 py-2 my-6 italic text-gray-700">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="text-gray-700 mb-6 leading-relaxed text-lg">{children}</p>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      const src = urlFor(value).width(1200).url()
      return (
        <figure className="my-8">
          <img src={src} alt={value.alt || ''} className="w-full h-auto rounded-lg" />
          {value.caption && (
            <figcaption className="text-sm text-gray-500 mt-2 text-center italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-teal-600 hover:text-teal-800 underline"
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
  },
}

async function getStory(slug: string) {
  return client.fetch<SuccessStory | null>(
    `*[_type == "successStory" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      publishedAt,
      excerpt,
      content,
      featuredImage { asset->{url}, alt }
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
          <Link
            href="/the-dog-blog"
            className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-2 mb-6"
          >
            ← Back to The Dog Blog
          </Link>

          <h1 className="text-5xl font-bold mb-4 text-gray-900">{story.title}</h1>

          <div className="flex items-center gap-4 text-gray-600 text-sm mb-8">
            {formattedDate && (
              <span className="flex items-center gap-2">📅 {formattedDate}</span>
            )}
            <span className="flex items-center gap-2">👤 RMGDRI Team</span>
          </div>

          {story.featuredImage?.asset?.url && (
            <div className="mb-8">
              <img
                src={story.featuredImage.asset.url}
                alt={story.featuredImage.alt || story.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          {story.excerpt && (
            <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
              {story.excerpt}
            </p>
          )}

          {story.content && story.content.length > 0 && (
            <div className="prose prose-lg max-w-none">
              <PortableText value={story.content} components={portableTextComponents} />
            </div>
          )}
        </article>
      </div>
    </main>
  )
}
