import Link from 'next/link'

export const metadata = {
  title: 'Donate and Save a Life | RMGDRI',
  description: 'Your donation helps rescue, rehabilitate, and rehome Great Danes in need.',
}

export default function DonatePage() {
  return (
    <main className="pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        <h1 className="text-5xl font-bold text-center mb-8 text-gray-900">Donate and Save a Life</h1>

        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-xl text-gray-700 leading-relaxed">
            Your generous donation helps us rescue, rehabilitate, and rehome Great Danes in need.
            Every dollar makes a difference in saving lives.
          </p>
        </div>

        {/* Donate CTA Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-10 rounded-lg text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Make a Donation Today</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Your support helps us provide medical care, food, shelter, and love to Great Danes who need it most.
          </p>
          <a
            href="https://greatd.mybigcommerce.com/donate/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-orange-600 px-10 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors"
          >
            Donate Now
          </a>
        </div>

        <div className="space-y-10">
          {/* Where Your Donation Goes */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Where Your Donation Goes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-teal-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">🩺</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Medical Care</h3>
                <p className="text-gray-700">Veterinary exams, surgeries, medications, and emergency treatments</p>
              </div>
              <div className="bg-teal-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">✂️</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Spay/Neuter</h3>
                <p className="text-gray-700">All dogs are spayed or neutered before adoption</p>
              </div>
              <div className="bg-teal-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">💉</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Vaccinations</h3>
                <p className="text-gray-700">Complete vaccination series and preventative care</p>
              </div>
              <div className="bg-teal-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">🥣</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Food &amp; Supplies</h3>
                <p className="text-gray-700">Quality food, crates, beds, toys, and other necessities</p>
              </div>
            </div>
          </section>

          {/* Cost of Rescue */}
          <section className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">The Cost of Rescue</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Rescuing a Great Dane is expensive. Many of our dogs come to us with serious medical
              issues, injuries, or illnesses that require extensive treatment.
            </p>
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex justify-between items-center bg-white p-4 rounded-lg">
                <span className="font-semibold text-gray-900">Veterinary Exam &amp; Tests</span>
                <span className="text-teal-600 font-bold">$200 - $500</span>
              </div>
              <div className="flex justify-between items-center bg-white p-4 rounded-lg">
                <span className="font-semibold text-gray-900">Spay/Neuter Surgery</span>
                <span className="text-teal-600 font-bold">$300 - $600</span>
              </div>
              <div className="flex justify-between items-center bg-white p-4 rounded-lg">
                <span className="font-semibold text-gray-900">Vaccinations &amp; Microchip</span>
                <span className="text-teal-600 font-bold">$150 - $300</span>
              </div>
              <div className="flex justify-between items-center bg-white p-4 rounded-lg">
                <span className="font-semibold text-gray-900">Food &amp; Supplies (per month)</span>
                <span className="text-teal-600 font-bold">$150 - $250</span>
              </div>
              <div className="flex justify-between items-center bg-white p-4 rounded-lg">
                <span className="font-semibold text-gray-900">Emergency Medical Care</span>
                <span className="text-teal-600 font-bold">$500 - $5,000+</span>
              </div>
              <div className="flex justify-between items-center bg-teal-600 text-white p-4 rounded-lg font-bold text-lg">
                <span>Average Cost Per Dog</span>
                <span>$1,500 - $3,000+</span>
              </div>
            </div>
          </section>

          {/* Other Ways to Give */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Other Ways to Give</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-teal-500 transition-colors">
                <div className="text-3xl mb-4">❤️</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Sponsor a Dane</h3>
                <p className="text-gray-700 mb-4">Sponsor a specific dog&apos;s medical care and follow their journey to their forever home.</p>
                <Link href="/sponsor-a-dane" className="text-teal-600 font-semibold hover:text-teal-700">
                  Learn More →
                </Link>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-teal-500 transition-colors">
                <div className="text-3xl mb-4">🛍️</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Amazon Wishlist</h3>
                <p className="text-gray-700 mb-4">Purchase items from our Amazon wishlist to directly help our foster dogs.</p>
                <a href="#" className="text-teal-600 font-semibold hover:text-teal-700">
                  View Wishlist →
                </a>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-teal-500 transition-colors">
                <div className="text-3xl mb-4">🎁</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Memorial Gifts</h3>
                <p className="text-gray-700 mb-4">Honor a loved one or beloved pet with a memorial donation.</p>
                <a href="https://greatd.mybigcommerce.com/donate/" target="_blank" rel="noopener noreferrer" className="text-teal-600 font-semibold hover:text-teal-700">
                  Make a Gift →
                </a>
              </div>
            </div>
          </section>

          {/* Tax Deductible */}
          <section className="bg-teal-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Tax Deductible</h2>
            <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
              Rocky Mountain Great Dane Rescue, Inc. is a 501(c)3 non-profit organization.
              Your donation is tax-deductible to the fullest extent allowed by law.
              <strong className="block mt-4">Tax ID: 84-1565402</strong>
            </p>
          </section>

          {/* Final CTA */}
          <div className="bg-gray-900 text-white p-10 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Every Dollar Counts</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Whether you donate $10 or $1,000, your contribution makes a real difference
              in the life of a Great Dane. Thank you for your support!
            </p>
            <a
              href="https://greatd.mybigcommerce.com/donate/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-orange-600 text-white px-10 py-4 rounded-lg text-xl font-bold hover:bg-orange-700 transition-colors"
            >
              Donate Now
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
