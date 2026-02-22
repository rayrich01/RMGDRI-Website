import AdoptionFosterForm from '@/components/forms/AdoptionFosterForm'

export const metadata = {
  title: 'Adoption Application | RMGDRI',
  description: 'Apply to adopt a Great Dane from Rocky Mountain Great Dane Rescue.',
}

export default function AdoptionApplicationPage() {
  return (
    <main className="pb-20 bg-white">
      <AdoptionFosterForm defaultType="adopt" title="Adoption Application" />
    </main>
  )
}
