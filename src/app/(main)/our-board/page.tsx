import Link from 'next/link'

export const metadata = {
  title: 'Our Board | RMGDRI',
  description: 'Meet the board of directors leading Rocky Mountain Great Dane Rescue.',
}

export default function OurBoardPage() {
  return (
    <main className="pb-20 bg-white">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Board of Directors</h1>
          <p className="text-xl text-gray-600">
            Dedicated volunteers leading RMGDRI&apos;s mission
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-8 rounded-xl">
            <p className="text-lg text-gray-700 leading-relaxed">
              Rocky Mountain Great Dane Rescue is governed by a volunteer Board of Directors who are passionate about Great Danes and committed to our mission. Each board member brings unique skills and expertise to help guide the organization, ensure sound financial management, and support our rescue operations across six states.
            </p>
          </div>
        </section>

        {/* Board Members */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Meet Our Board</h2>
          <div className="space-y-8">
            {/* Board member placeholders - these would be populated with real data */}
            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Board Member Name</h3>
                  <p className="text-teal-600 font-semibold mb-3">President</p>
                  <p className="text-gray-700 leading-relaxed">
                    Bio and information about this board member, their background, experience with Great Danes, and their role in the organization would be included here.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Board Member Name</h3>
                  <p className="text-teal-600 font-semibold mb-3">Vice President</p>
                  <p className="text-gray-700 leading-relaxed">
                    Bio and information about this board member, their background, experience with Great Danes, and their role in the organization would be included here.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Board Member Name</h3>
                  <p className="text-teal-600 font-semibold mb-3">Treasurer</p>
                  <p className="text-gray-700 leading-relaxed">
                    Bio and information about this board member, their background, experience with Great Danes, and their role in the organization would be included here.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Board Member Name</h3>
                  <p className="text-teal-600 font-semibold mb-3">Secretary</p>
                  <p className="text-gray-700 leading-relaxed">
                    Bio and information about this board member, their background, experience with Great Danes, and their role in the organization would be included here.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Board Member Name</h3>
                  <p className="text-teal-600 font-semibold mb-3">Board Member</p>
                  <p className="text-gray-700 leading-relaxed">
                    Bio and information about this board member, their background, experience with Great Danes, and their role in the organization would be included here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Board Responsibilities */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Board Responsibilities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-teal-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Governance & Leadership</h3>
              <p className="text-gray-700">
                Setting organizational policies, strategic direction, and ensuring RMGDRI operates in accordance with our mission and legal requirements.
              </p>
            </div>

            <div className="bg-teal-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Financial Oversight</h3>
              <p className="text-gray-700">
                Managing the organization&apos;s finances, approving budgets, and ensuring responsible stewardship of donated funds.
              </p>
            </div>

            <div className="bg-teal-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fundraising & Development</h3>
              <p className="text-gray-700">
                Supporting fundraising efforts, donor relations, and developing strategies to ensure long-term financial sustainability.
              </p>
            </div>

            <div className="bg-teal-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Relations</h3>
              <p className="text-gray-700">
                Representing RMGDRI in the community, building partnerships, and serving as ambassadors for our mission.
              </p>
            </div>
          </div>
        </section>

        {/* Join Info */}
        <section className="mb-12">
          <div className="bg-gray-50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in Joining Our Board?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              RMGDRI occasionally seeks new board members who bring skills in areas such as finance, legal matters, fundraising, marketing, or veterinary medicine. Board service requires a commitment to attend regular meetings and actively support the organization&apos;s work.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you&apos;re interested in learning more about board service opportunities, please contact us at{' '}
              <a href="mailto:info@rmgreatdane.org" className="text-teal-600 hover:text-teal-700 font-semibold">
                info@rmgreatdane.org
              </a>
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 text-white p-8 rounded-xl text-center">
          <h3 className="text-2xl font-bold mb-4">Support Our Mission</h3>
          <p className="text-lg mb-6 text-gray-300">
            Learn more about RMGDRI and how you can help save Great Danes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/our-organization"
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              About Our Organization
            </Link>
            <Link
              href="/donate-to-rmgdri"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Make a Donation
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
