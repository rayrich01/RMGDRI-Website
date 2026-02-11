import { client } from '@/lib/sanity/client'
import { hasSanityConfig } from '@/lib/sanity/env'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'

type Props = {
  params: Promise<{ slug: string }>
}

async function getPage(slug: string) {
  // Fail-soft for Preview/Builds that don't have Sanity env configured.
  // Prevents `next build` from crashing on Vercel when projectId is missing.
  if (!hasSanityConfig()) return null

  return client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      title,
      content,
      seoDescription
    }`,
    { slug }
  )
}

const components = {
  block: {
    normal: ({ children }: any) => <p className="mb-4">{children}</p>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">{children}</h3>,
    blockquote: ({ children }: any) => <blockquote className="border-l-4 border-teal-500 pl-4 italic text-gray-600 my-4">{children}</blockquote>,
  },
}

export default async function Page({ params }: Props) {
  const { slug } = await params

  // If Sanity isn't configured in this deployment, show a safe placeholder.
  // This keeps Preview builds green while you wire Vercel env vars.
  if (!hasSanityConfig()) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-2xl font-bold text-gray-900">Preview missing Sanity configuration</h1>
          <p className="mt-4 text-gray-700">
            This deployment does not have SANITY_PROJECT_ID configured, so dynamic CMS pages like <code>/[slug]</code> can’t load yet.
          </p>
          <p className="mt-6">
            <Link href="/available-danes" className="font-semibold underline underline-offset-4 hover:opacity-80">
              View Available Danes →
            </Link>
          </p>
        </div>
      </main>
    )
  }

  const page = await getPage(slug)

  if (!page) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <p className="mt-0 mb-6">
          <Link
            href="/dogs"
            className="font-semibold underline underline-offset-4 hover:opacity-80"
          >
            Adopt a Dog →
          </Link>
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">{page.title}</h1>
        {page.content && (
          <div className="text-gray-700 leading-relaxed text-lg">
            <PortableText value={page.content} components={components} />
          </div>
        )}
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params

  // Avoid hard failing build-time metadata when Sanity isn't configured.
  if (!hasSanityConfig()) {
    return {
      title: `Rocky Mountain Great Dane Rescue`,
    }
  }

  const page = await getPage(slug)

  if (!page) return {}

  return {
    title: `${page.title} | Rocky Mountain Great Dane Rescue`,
    description: page.seoDescription,
  }
}
