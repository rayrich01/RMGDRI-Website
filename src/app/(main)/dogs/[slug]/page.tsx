import { notFound } from 'next/navigation'
import { sanityClient } from '../../../../lib/sanity/client'

export default async function DogPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const dog = await sanityClient.fetch(
    `*[_type == "dog" && slug.current == $slug][0]{
      _id,
      name,
      "slug": slug.current,
      status
    }`,
    { slug }
  )

  if (!dog) notFound()

  return (
    <main style={{ padding: 24 }}>
      <h1>{dog.name}</h1>
      <p><b>Slug:</b> {dog.slug}</p>
      <p><b>Status:</b> {dog.status ?? 'unknown'}</p>
    </main>
  )
}
