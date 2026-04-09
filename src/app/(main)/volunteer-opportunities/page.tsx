import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import OpportunitiesAccordion from './OpportunitiesAccordion'

export const revalidate = 60

interface VolunteerOpportunity {
  _id: string
  title: string
  description: string
  responsibilities: string[]
  qualifications: string[]
  benefits: string[]
  sortOrder: number | null
}

const QUERY = `*[_type == "volunteerOpportunity" && hideFromWebsite != true] | order(sortOrder asc, title asc) {
  _id, title, description, responsibilities, qualifications, benefits, sortOrder
}`

export default async function VolunteerOpportunitiesPage() {
  let opportunities: VolunteerOpportunity[] = []
  try {
    opportunities = await client.fetch<VolunteerOpportunity[]>(QUERY)
  } catch {
    // Sanity fetch failed — page will show "no positions" message
  }

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Volunteer Opportunities
          </h1>
          <p className="text-lg text-teal-100 max-w-2xl mx-auto">
            We have a lot of Great Danes that need saving and we would love your help.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Intro Section */}
        <section className="mb-12">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Saving Great Danes takes a village and we hope you will join ours. We are always
            looking for new volunteers to lend a helping hand. Following are a few of the volunteer
            positions that we have available. It is easy to become a volunteer for RMGDRI, just
            complete a short online application. If one of the following job openings has caught
            your eye just mention it on your application and we will be in touch.
          </p>

          {/* CTA Box */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-xl text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Are you ready to help save Great Danes?
            </h2>
            <Link
              href="/apply/volunteer"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg"
            >
              Apply Now →
            </Link>
          </div>
        </section>

        {/* Opportunities List */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Available Positions
          </h2>

          {opportunities.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-500 text-lg">
                No volunteer positions are currently listed. Please check back soon!
              </p>
            </div>
          ) : (
            <OpportunitiesAccordion opportunities={opportunities} />
          )}
        </section>

        {/* Bottom CTA */}
        <section className="bg-teal-50 py-12 px-8 rounded-2xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Don&apos;t See the Perfect Fit?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            We can tailor a position to match your unique skills and interests. Reach out and
            let&apos;s create something special together!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply/volunteer"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-lg"
            >
              Submit Application →
            </Link>
            <Link
              href="/volunteer"
              className="inline-block border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-3 rounded-lg font-bold transition-colors"
            >
              ← Back to Volunteer Overview
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
