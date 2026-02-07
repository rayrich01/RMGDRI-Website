import Link from 'next/link'

export const metadata = {
  title: 'Foster Application | RMGDRI',
  description: 'Apply to become a foster home for Great Danes with Rocky Mountain Great Dane Rescue.',
}

export default function FosterApplicationPage() {
  return (
    <main className="pb-20 bg-white">
      <div className="max-w-3xl mx-auto px-6 pt-12 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">Foster Application</h1>

        <p className="text-xl text-gray-700 leading-relaxed mb-8">
          Interested in fostering a Great Dane? Our foster families are the backbone of
          our rescue. Please complete the application below and we&apos;ll be in touch!
        </p>

        <div className="bg-teal-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Foster Requirements</h2>
          <div className="text-left space-y-2 text-gray-700 max-w-xl mx-auto">
            <p>✓ Must be 21 years or older</p>
            <p>✓ Securely fenced yard (minimum 5 feet high)</p>
            <p>✓ Landlord approval if renting</p>
            <p>✓ All household pets spayed/neutered and vaccinated</p>
            <p>✓ Willingness to transport to vet appointments</p>
            <p>✓ Communication with the RMGDRI team</p>
          </div>
          <Link href="/foster-a-great-dane" className="inline-block mt-4 text-teal-600 font-semibold hover:text-teal-700">
            Learn more about fostering →
          </Link>
        </div>

        <a
          href="https://form.jotform.com/RMGDRI/adoption-foster-application"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-teal-600 text-white px-10 py-5 rounded-lg text-xl font-semibold hover:bg-teal-700 transition-colors mb-6"
        >
          Start Your Foster Application →
        </a>

        <p className="text-gray-500 text-sm">
          You will be redirected to our secure application form.
          Questions? Contact us at{' '}
          <a href="mailto:info@rmgreatdane.org" className="text-teal-600 hover:text-teal-700">
            info@rmgreatdane.org
          </a>
        </p>
      </div>
    </main>
  )
}
