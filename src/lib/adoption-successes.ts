import successesData from '@/data/adoption-successes/successes.normalized.json'

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

const records: AdoptionSuccessRecord[] = successesData as AdoptionSuccessRecord[]

// Validate that each record has the minimal required fields
function validate(r: AdoptionSuccessRecord): boolean {
  return !!(r.name && r.slug && r.adoption_year)
}

const validRecords = records.filter(validate)

export function getYears(): { year: number; count: number }[] {
  const counts: Record<number, number> = {}
  for (const r of validRecords) {
    counts[r.adoption_year] = (counts[r.adoption_year] || 0) + 1
  }
  return Object.keys(counts)
    .map(Number)
    .sort((a, b) => b - a)
    .map((year) => ({ year, count: counts[year] }))
}

export function getByYear(year: number): AdoptionSuccessRecord[] {
  return validRecords
    .filter((r) => r.adoption_year === year)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getByYearAndSlug(
  year: number,
  slug: string
): AdoptionSuccessRecord | undefined {
  return validRecords.find(
    (r) => r.adoption_year === year && r.slug === slug
  )
}

export function getAllRecords(): AdoptionSuccessRecord[] {
  return validRecords
}
