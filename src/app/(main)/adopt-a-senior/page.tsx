import Link from 'next/link'

export const metadata = {
  title: 'Adopt a Senior Great Dane | RMGDRI',
  description: 'Discover the joy of adopting a senior Great Dane. Learn about the special rewards and considerations.',
}

export default function AdoptASeniorPage() {
  return (
    <main className="pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Adopt a Senior Great Dane</h1>
          <p className="text-xl text-gray-600">
            Old souls with endless love to give
          </p>
        </div>

        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Beauty of Senior Danes</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Senior Great Danes (typically 6 years and older) are often overlooked in rescue, but they make some of the most wonderful companions. These gentle souls have so much love left to give and deserve a comfortable, peaceful place to spend their golden years.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              While Great Danes have a shorter lifespan than many breeds (typically 7-10 years), the years you spend with a senior can be some of the most rewarding of your life.
            </p>
          </div>
        </section>

        {/* Why Adopt a Senior */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Adopt a Senior Dane?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Calm & Gentle</h3>
              <p className="text-gray-700">
                Senior Danes have outgrown the rambunctious puppy phase. They&apos;re mellow, well-mannered, and content with leisurely walks and lots of couch time.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Already Trained</h3>
              <p className="text-gray-700">
                Most senior Danes know basic commands, are house-trained, and understand how to live in a home. There&apos;s no destructive puppy behavior or extensive training needed.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Grateful Companions</h3>
              <p className="text-gray-700">
                Senior dogs seem to understand they&apos;ve been given a second chance. Their loyalty and appreciation are profound and heartwarming.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Perfect for Retirees</h3>
              <p className="text-gray-700">
                Senior Danes match well with senior humans! Their calm energy level is ideal for people who want companionship without the demands of a young dog.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Lower Exercise Needs</h3>
              <p className="text-gray-700">
                While still needing daily walks, senior Danes require less exercise than younger dogs. They&apos;re happy with shorter, more relaxed outings.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Known Personality</h3>
              <p className="text-gray-700">
                With seniors, what you see is what you get. Their personality is fully developed, so there are no surprises about their adult temperament.
              </p>
            </div>
          </div>
        </section>

        {/* Special Considerations */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Special Considerations</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            While senior Danes make wonderful pets, there are some important factors to consider:
          </p>
          <div className="space-y-4">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
              <h3 className="font-bold text-gray-900 mb-2">Health Care Costs</h3>
              <p className="text-gray-700">
                Senior dogs may have age-related health issues like arthritis, heart conditions, or other ailments requiring medication or veterinary care. Budget for regular vet visits and potential ongoing medical expenses.
              </p>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
              <h3 className="font-bold text-gray-900 mb-2">Shorter Time Together</h3>
              <p className="text-gray-700">
                The reality is that you&apos;ll likely have less time with a senior dog than a younger one. Be prepared emotionally and financially for end-of-life care.
              </p>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
              <h3 className="font-bold text-gray-900 mb-2">Physical Accommodations</h3>
              <p className="text-gray-700">
                Senior Danes may need ramps, orthopedic beds, non-slip flooring, and other accommodations for mobility issues. Be ready to make your home senior-dog friendly.
              </p>
            </div>
          </div>
        </section>

        {/* Support from RMGDRI */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Commitment to Senior Adopters</h2>
          <div className="bg-teal-50 p-6 rounded-xl">
            <p className="text-gray-700 leading-relaxed mb-4">
              RMGDRI provides extra support for senior dog adoptions:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 text-xl">✓</span>
                <span>Reduced adoption fees for senior dogs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 text-xl">✓</span>
                <span>Complete medical records and history</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 text-xl">✓</span>
                <span>Honest disclosure of any known health issues</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 text-xl">✓</span>
                <span>Ongoing support and advice for senior dog care</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 text-xl">✓</span>
                <span>Assistance with finding affordable veterinary care</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Real Stories */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Testimonials from Senior Dane Adopters</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 italic mb-4">
                &quot;We adopted 8-year-old Duke and had three beautiful years with him. He was the gentlest, most loving soul. Those years were a gift, and we&apos;d do it again in a heartbeat.&quot;
              </p>
              <p className="text-gray-600 font-semibold">— Sarah & Tom, Colorado</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 italic mb-4">
                &quot;As retirees, we wanted a dog but worried about keeping up with a young, energetic Great Dane. Our 7-year-old girl Bella is perfect for us—calm, sweet, and just wants to be near us.&quot;
              </p>
              <p className="text-gray-600 font-semibold">— Margaret & John, Utah</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 text-white p-8 rounded-xl text-center">
          <h3 className="text-2xl font-bold mb-4">Give a Senior Dane a Second Chance</h3>
          <p className="text-lg mb-6 text-gray-300">
            Our senior Great Danes are waiting for their forever homes. Could one of them be perfect for you?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/available-danes"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              See Available Seniors
            </Link>
            <Link
              href="/adoption-information"
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Learn About Adoption
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
