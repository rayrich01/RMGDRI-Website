import Link from 'next/link'

export const metadata = {
  title: 'Our Organization | RMGDRI',
  description: 'Learn how Rocky Mountain Great Dane Rescue operates and how we serve the Rocky Mountain region.',
}

export default function OurOrganizationPage() {
  return (
    <main className="pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Organization</h1>
          <p className="text-xl text-gray-600">
            How we operate and serve the Great Dane community
          </p>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Rocky Mountain Great Dane Rescue, Inc. (RMGDRI) is a 501(c)(3) nonprofit organization founded in 2000 to rescue and rehome Great Danes throughout the Rocky Mountain region.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            We are licensed by PACFA (Pet Animal Care Facilities Act) through the Colorado Department of Agriculture, ensuring we meet the highest standards of animal care and welfare.
          </p>
          <div className="bg-teal-50 border-l-4 border-teal-500 p-6 rounded-r-xl">
            <p className="font-semibold text-gray-900">EIN: 84-1565402</p>
            <p className="text-gray-700 mt-2">All donations are tax-deductible to the fullest extent allowed by law.</p>
          </div>
        </section>

        {/* How We Operate */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Operate</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-teal-600 mb-3">100% Volunteer-Based</h3>
              <p className="text-gray-700 leading-relaxed">
                RMGDRI operates entirely through dedicated volunteers. We have no paid staff, which means every dollar donated goes directly to caring for our Great Danes. Our volunteers handle everything from rescue coordination and foster care to adoption processing and fundraising.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-teal-600 mb-3">Foster Home Network</h3>
              <p className="text-gray-700 leading-relaxed">
                We do not operate a physical shelter. Instead, all our Great Danes live in private foster homes throughout our service area. This home-based approach allows us to thoroughly evaluate each dog&apos;s personality, behavior, and needs in a real home environment, leading to better placement matches.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-teal-600 mb-3">Comprehensive Care</h3>
              <p className="text-gray-700 leading-relaxed">
                Every Great Dane in our program receives complete veterinary care, including spay/neuter, vaccinations, heartworm testing and treatment if needed, and any additional medical care required. We also provide behavioral assessment and training support to set each dog up for success.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-teal-600 mb-3">Thorough Adoption Process</h3>
              <p className="text-gray-700 leading-relaxed">
                We carefully screen potential adopters through a multi-step process including applications, reference checks, home visits, and meet-and-greets. Our goal is to ensure each placement is the right fit for both the dog and the family, resulting in lasting, successful adoptions.
              </p>
            </div>
          </div>
        </section>

        {/* Service Area */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Service Area</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            We serve six states across the Rocky Mountain region:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {['Colorado', 'Utah', 'Wyoming', 'Idaho', 'Montana', 'New Mexico'].map((state) => (
              <div key={state} className="bg-gradient-to-br from-teal-50 to-emerald-50 p-4 rounded-lg text-center">
                <span className="text-lg font-semibold text-gray-900">{state}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-700 leading-relaxed">
            Our volunteer network and foster homes span this entire region, allowing us to rescue Great Danes from shelters, owner surrenders, and emergency situations across all six states.
          </p>
        </section>

        {/* Impact */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl font-bold text-emerald-600 mb-2">2,532+</div>
              <div className="text-gray-700">Great Danes Rescued Since 2000</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl font-bold text-emerald-600 mb-2">77</div>
              <div className="text-gray-700">Adoptions in 2024</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl font-bold text-emerald-600 mb-2">6</div>
              <div className="text-gray-700">States Served</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-xl text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Involved</h3>
          <p className="text-gray-700 mb-6">
            Learn more about our board, volunteer opportunities, and how you can support our mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/our-board"
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Meet Our Board
            </Link>
            <Link
              href="/foster-a-great-dane"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Become a Foster
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
