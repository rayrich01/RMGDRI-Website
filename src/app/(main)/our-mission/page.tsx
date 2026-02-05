import Link from 'next/link'

export const metadata = {
  title: 'Our Mission | RMGDRI',
  description: 'Learn about the mission and values of Rocky Mountain Great Dane Rescue.',
}

export default function OurMissionPage() {
  return (
    <main className="pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Mission</h1>
          <p className="text-xl text-gray-600">
            Saving gentle giants, one Dane at a time
          </p>
        </div>

        {/* Mission Statement */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Rocky Mountain Great Dane Rescue, Inc. is dedicated to rescuing, rehabilitating, and rehoming Great Danes and Dane mixes throughout the Rocky Mountain region. We help those that have been abused, abandoned, neglected, or through no fault of their current family, just need to find a new forever home.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Since 2000, we&apos;ve successfully placed over 2,500 Great Danes into loving homes, providing each one with medical care, behavioral support, and the second chance they deserve.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Compassion</h3>
              <p className="text-gray-700">
                Every Great Dane deserves love, care, and dignity. We approach each rescue with empathy and commitment to their wellbeing.
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Excellence</h3>
              <p className="text-gray-700">
                We provide the highest quality medical care, behavioral assessment, and placement services to ensure successful adoptions.
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Transparency</h3>
              <p className="text-gray-700">
                We operate openly with adopters, fosters, and donors, maintaining clear communication and honest assessments of each dog.
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Community</h3>
              <p className="text-gray-700">
                We build lasting relationships with adopters, volunteers, and supporters who share our passion for Great Danes.
              </p>
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Commitment</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              As a 501(c)(3) nonprofit organization licensed by PACFA and the Colorado Department of Agriculture, we are committed to ethical rescue practices and responsible stewardship of donated funds.
            </p>
            <p className="mb-4">
              We serve Colorado, Utah, Wyoming, Idaho, Montana, and New Mexico, operating entirely through a network of dedicated volunteers and foster homes. Every dollar donated goes directly to veterinary care, food, supplies, and the support services that help us save more lives.
            </p>
            <p>
              Our mission extends beyond rescue and adoption. We educate the public about responsible Great Dane ownership, provide support to families in crisis who need to rehome their Danes, and work with shelters to prevent Great Danes from entering the shelter system in the first place.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 text-white p-8 rounded-xl text-center">
          <h3 className="text-2xl font-bold mb-4">Join Our Mission</h3>
          <p className="text-lg mb-6 text-gray-300">
            Whether you adopt, foster, volunteer, or donate, you&apos;re helping us save lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/available-danes"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Meet Our Danes
            </Link>
            <Link
              href="/donate-to-rmgdri"
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Support Our Work
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
