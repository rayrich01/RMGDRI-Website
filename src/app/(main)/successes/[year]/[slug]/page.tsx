import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ year: string; slug: string }>
}

export default async function SuccessesYearSlugRedirect({ params }: Props) {
  const { year, slug } = await params
  redirect(`/adoption-successes/${year}/${slug}`)
}
