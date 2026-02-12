import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Adoption Success Stories | RMGDRI',
  description: 'Celebrate the Great Danes who found their forever homes through Rocky Mountain Great Dane Rescue.',
}

export default function AdoptionSuccessesIndex() {
  // For now, redirect to current year or a default year
  // TODO: Create a proper index page with year selection
  redirect('/adoption-successes/2024')
}
