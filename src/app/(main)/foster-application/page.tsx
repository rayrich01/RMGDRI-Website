import AdoptionFosterForm from '@/components/forms/AdoptionFosterForm'

export const metadata = {
  title: 'Foster Application | RMGDRI',
  description: 'Apply to become a foster home for Great Danes with Rocky Mountain Great Dane Rescue.',
}

export default function FosterApplicationPage() {
  return (
    <main className="pb-20 bg-white">
      <AdoptionFosterForm defaultType="foster" title="Foster Application" />
    </main>
  )
}
