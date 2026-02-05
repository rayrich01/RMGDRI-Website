import Link from 'next/link'

export const metadata = {
  title: 'Sponsor a Dane | RMGDRI',
  description: 'Sponsor a Great Dane and help cover their care costs while they wait for their forever home.',
}

export default function SponsorADanePage() {
  return (
    <main className="pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Sponsor a Dane</h1>
          <p className="text-xl text-gray-600">
            Make a direct impact on a Great Dane&apos;s journey to their forever home
          </p>
        </div>

        {/* What is Sponsorship */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What is Sponsorship?</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              When you sponsor a Great Dane, you&apos;re making a commitment to help cover their care costs while they&apos;re in our program. Your monthly or one-time sponsorship directly supports your chosen dog&apos;s food, medical care, and daily needs.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Sponsorship is perfect for those who want to help but can&apos;t adopt or foster. You&apos;ll receive updates on your sponsored Dane and know you&apos;re making a real difference in their life.
            </p>
          </div>
        </section>

        {/* Why Sponsor */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Sponsorship Matters</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Direct Impact</h3>
              <p className="text-gray-700">
                Your sponsorship goes directly to your chosen dog&apos;s care. You&apos;ll know exactly which Great Dane you&apos;re helping.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Special Needs Support</h3>
              <p className="text-gray-700">
                Many Great Danes need expensive medical treatments or long-term care. Sponsorship helps cover these critical costs.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Extended Care</h3>
              <p className="text-gray-700">
                Some dogs stay with us for months while waiting for the right home. Sponsorship ensures they receive quality care throughout their wait.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Regular Updates</h3>
              <p className="text-gray-700">
                Receive photos and updates about your sponsored Dane&apos;s progress, personality, and journey to their forever home.
              </p>
            </div>
          </div>
        </section>

        {/* Sponsorship Levels */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sponsorship Levels</h2>
          <div className="space-y-6">
            <div className="border-2 border-emerald-500 bg-emerald-50 p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Champion Sponsor</h3>
                  <p className="text-teal-600 font-semibold text-lg">$100/month or $1,200/year</p>
                </div>
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Most Impact
                </span>
              </div>
              <p className="text-gray-700 mb-3">
                Covers nearly all monthly costs for one Great Dane, including food, medications, and routine vet care.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Monthly photo updates and progress reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Recognition on website as Champion Sponsor</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Invitation to meet your sponsored Dane (if local)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Notification when your Dane finds their forever home</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-teal-300 bg-teal-50 p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Hero Sponsor</h3>
                  <p className="text-teal-600 font-semibold text-lg">$50/month or $600/year</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                Covers food and basic supplies for one Great Dane for a month.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>Bi-monthly photo updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>Recognition on website</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>Notification of adoption</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-gray-300 p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Friend Sponsor</h3>
                  <p className="text-teal-600 font-semibold text-lg">$25/month or $300/year</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                Helps with daily care costs and supplies.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-gray-600">✓</span>
                  <span>Quarterly updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600">✓</span>
                  <span>Recognition on website</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How Sponsorship Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Choose Your Dane</h3>
                <p className="text-gray-700">
                  Browse our available dogs and select one to sponsor. You can sponsor any dog in our program, whether available for adoption, in medical care, or a long-term resident.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Select Your Level</h3>
                <p className="text-gray-700">
                  Choose a sponsorship level that works for you. Set up monthly recurring sponsorship or make a one-time annual contribution.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Receive Updates</h3>
                <p className="text-gray-700">
                  Get regular updates about your sponsored Dane&apos;s health, personality, and progress toward finding their forever home.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Celebrate Adoption</h3>
                <p className="text-gray-700">
                  When your sponsored Dane finds their forever home, you&apos;ll be notified. You can then choose to sponsor another dog or continue your support through general donations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sponsorship Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">Can I sponsor more than one Dane?</h3>
              <p className="text-gray-700">
                Absolutely! You can sponsor as many Great Danes as you&apos;d like to support.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">What happens if my sponsored Dane gets adopted quickly?</h3>
              <p className="text-gray-700">
                We&apos;ll notify you of the adoption and help you choose another Great Dane to sponsor, or you can convert your sponsorship to a general donation.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">Can I visit my sponsored Dane?</h3>
              <p className="text-gray-700">
                Champion Sponsors in our service area may arrange visits with foster families. We coordinate these carefully to minimize stress on the dog.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">Is sponsorship tax-deductible?</h3>
              <p className="text-gray-700">
                Yes! RMGDRI is a 501(c)(3) nonprofit (EIN: 84-1565402). All sponsorship contributions are tax-deductible to the fullest extent allowed by law.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 text-white p-8 rounded-xl text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Sponsor a Great Dane?</h3>
          <p className="text-lg mb-6 text-gray-300">
            Choose a Great Dane to sponsor and start making a difference today
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
              Start Sponsoring
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
