import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Adoption Information | RMGDRI',
  description: 'Everything you need to know about adopting a Great Dane from Rocky Mountain Great Dane Rescue.',
}

export default function AdoptionInformationPage() {
  return (
    <main className="pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Adoption Information</h1>
          <p className="text-xl text-gray-600">
            Your guide to adopting a Great Dane from RMGDRI
          </p>
        </div>

        {/* Featured Image */}
        <div className="mb-10 rounded-lg overflow-hidden">
          <Image
            src="/images/pages/adoption/zilly-be5c6a54c8bf4f34b9b05380bf12079c.png"
            alt="Adopt a Great Dane"
            width={1200}
            height={600}
            className="w-full h-auto"
          />
        </div>

        {/* Adoption Process */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Adoption Process</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Browse Available Danes</h3>
                <p className="text-gray-700">
                  Visit our Available Danes page to see all the Great Danes currently in our program. Each profile includes photos, personality descriptions, and important information about the dog&apos;s needs and temperament.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Submit an Application</h3>
                <p className="text-gray-700">
                  Complete our adoption application form. We ask detailed questions about your home, family, experience with dogs, and lifestyle to help us determine the best match. Be thorough and honest—this helps us find the perfect Dane for you.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Application Review</h3>
                <p className="text-gray-700">
                  Our volunteer team will review your application, check references (including your veterinarian), and may call you to discuss your application in more detail. This process typically takes 3-7 days.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Home Visit</h3>
                <p className="text-gray-700">
                  If your application is approved, we&apos;ll schedule a home visit. This allows us to ensure your home is safe and suitable for a Great Dane, check your fencing, and answer any questions you may have.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                5
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Meet and Greet</h3>
                <p className="text-gray-700">
                  We&apos;ll arrange for you to meet the Great Dane(s) you&apos;re interested in. If you have other pets, we&apos;ll include them in the meeting to ensure everyone gets along. Multiple visits may be arranged if needed.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                6
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Finalize Adoption</h3>
                <p className="text-gray-700">
                  Once everyone agrees it&apos;s a perfect match, you&apos;ll complete the adoption contract and pay the adoption fee. We&apos;ll provide you with all medical records, supplies, and ongoing support to ensure a successful transition.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Adoption Requirements */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Adoption Requirements</h2>
          <div className="bg-gray-50 p-6 rounded-xl">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 text-xl">✓</span>
                <span>Be at least 21 years old</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 text-xl">✓</span>
                <span>Have permission from your landlord if renting (we will verify)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 text-xl">✓</span>
                <span>Have a secure, fenced yard appropriate for a large dog (minimum 6 ft fence for most dogs)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 text-xl">✓</span>
                <span>Agree to keep the Great Dane as an indoor family member</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 text-xl">✓</span>
                <span>Have current pets spayed/neutered and up to date on vaccinations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 text-xl">✓</span>
                <span>Be financially prepared for the costs of owning a giant breed dog</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 text-xl">✓</span>
                <span>Agree to return the dog to RMGDRI if you can no longer care for them</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Adoption Fees */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Adoption Fees</h2>
          <p className="text-lg text-gray-700 mb-4">
            Our adoption fees vary based on the dog&apos;s age, special needs, and length of time in rescue. Fees typically range from $350 to $500.
          </p>
          <div className="bg-teal-50 border-l-4 border-teal-500 p-6 rounded-r-xl">
            <p className="font-semibold text-gray-900 mb-2">What&apos;s Included:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• Spay/neuter surgery</li>
              <li>• All current vaccinations</li>
              <li>• Heartworm test and treatment if needed</li>
              <li>• Microchip</li>
              <li>• Complete medical records</li>
              <li>• Behavioral assessment</li>
              <li>• Lifetime support from RMGDRI</li>
            </ul>
          </div>
          <p className="text-gray-600 mt-4 italic">
            Note: Adoption fees rarely cover the full cost of caring for each dog. Your adoption fee helps us continue rescuing more Great Danes in need.
          </p>
        </section>

        {/* What to Expect */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What to Expect</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Most Great Danes need an adjustment period in their new home. The &quot;Rule of 3s&quot; is a helpful guide:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-2">3 Days</h3>
              <p className="text-gray-700">
                Your dog may be overwhelmed and nervous. They&apos;re learning the new environment and may not show their true personality yet.
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-2">3 Weeks</h3>
              <p className="text-gray-700">
                Your dog is settling in and starting to feel comfortable. Their true personality begins to emerge and routines are forming.
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-2">3 Months</h3>
              <p className="text-gray-700">
                Your dog finally feels at home! They trust you, have adjusted to their routine, and their full personality shines through.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 text-white p-8 rounded-xl text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Adopt?</h3>
          <p className="text-lg mb-6 text-gray-300">
            Browse our available Great Danes or submit an adoption application today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/available-danes"
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Meet Our Available Danes
            </Link>
            <Link
              href="/adoption-application"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Apply to Adopt
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
