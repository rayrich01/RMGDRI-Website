import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ year: string }>
}

export default async function SuccessesYearRedirect({ params }: Props) {
  const { year } = await params
  redirect(`/adoption-successes/${year}`)
}
