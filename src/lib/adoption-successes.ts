import successesData from '@/data/adoption-successes/successes.normalized.json'
import { sanityClient } from '@/lib/sanity/client'

export type AdoptionSuccessRecord = {
  id_number: string
  name: string
  color: string
  adoption_date: string
  adoption_year: number
  slug: string
  title: string
  hero_image_ref: string
  blog_text: string
  blog_url: string
  original_slug: string
  row_number: number
}

const historicalRecords: AdoptionSuccessRecord[] = (successesData as AdoptionSuccessRecord[]).filter(
  (r) => !!(r.name && r.slug && r.adoption_year)
)

/**
 * Fetch adopted dogs from Sanity and convert to AdoptionSuccessRecord format.
 * These are merged with historical JSON records, deduplicating by slug.
 */
async function getSanityAdopted(): Promise<AdoptionSuccessRecord[]> {
  try {
    const dogs = await sanityClient.fetch(`
      *[_type == "dog" && status == "adopted" && defined(adoptionYear)] {
        _id,
        name,
        "slug": slug.current,
        color,
        shortDescription,
        adoptionDate,
        adoptionYear,
        adoptionStory,
        "mainImageUrl": mainImage.asset->url,
        "adoptionHeroUrl": adoptionHeroImage.asset->url
      }
    `)

    return dogs.map((dog: any) => {
      const year = parseInt(dog.adoptionYear, 10)
      const slug = `${dog.slug}-${year}`
      return {
        id_number: dog._id,
        name: dog.name,
        color: dog.color || '',
        adoption_date: dog.adoptionDate || '',
        adoption_year: year,
        slug,
        title: dog.name,
        hero_image_ref: dog.adoptionHeroUrl || dog.mainImageUrl || '',
        blog_text: dog.adoptionStory || dog.shortDescription || '',
        blog_url: `/blog/${slug}`,
        original_slug: slug,
        row_number: 0,
      }
    })
  } catch (error) {
    console.error('Failed to fetch Sanity adopted dogs:', error)
    return []
  }
}

/**
 * Merge historical JSON records with live Sanity adopted dogs.
 * Sanity records take precedence (by slug match).
 */
async function getAllValidRecords(): Promise<AdoptionSuccessRecord[]> {
  const sanityRecords = await getSanityAdopted()
  const sanitySlugs = new Set(sanityRecords.map((r) => r.slug))

  // Historical records that aren't overridden by Sanity
  const historical = historicalRecords.filter((r) => !sanitySlugs.has(r.slug))

  return [...historical, ...sanityRecords]
}

export async function getYears(): Promise<{ year: number; count: number }[]> {
  const records = await getAllValidRecords()
  const counts: Record<number, number> = {}
  for (const r of records) {
    counts[r.adoption_year] = (counts[r.adoption_year] || 0) + 1
  }
  return Object.keys(counts)
    .map(Number)
    .sort((a, b) => b - a)
    .map((year) => ({ year, count: counts[year] }))
}

export async function getByYear(year: number): Promise<AdoptionSuccessRecord[]> {
  const records = await getAllValidRecords()
  return records
    .filter((r) => r.adoption_year === year)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function getByYearAndSlug(
  year: number,
  slug: string
): Promise<AdoptionSuccessRecord | undefined> {
  const records = await getAllValidRecords()
  return records.find(
    (r) => r.adoption_year === year && r.slug === slug
  )
}

export async function getAllRecords(): Promise<AdoptionSuccessRecord[]> {
  return getAllValidRecords()
}
