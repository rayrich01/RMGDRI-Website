import Link from 'next/link'

export const metadata = {
  title: 'Adoption Application | RMGDRI',
  description: 'Apply to adopt a Great Dane from Rocky Mountain Great Dane Rescue.',
}

export default function AdoptionApplicationPage() {
  return (
    <main className="pb-20 bg-white">
      <div className="max-w-3xl mx-auto px-6 pt-12 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">Adoption Application</h1>

        <p className="text-xl text-gray-700 leading-relaxed mb-8">
          Thank you for your interest in adopting a Great Dane! Please complete our
          application form below. Our adoption team will review your application and
          contact you within a few business days.
        </p>

        <div className="bg-teal-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Before You Apply</h2>
          <div className="text-left space-y-2 text-gray-700 max-w-xl mx-auto">
            <p>✓ You must be 21 years or older</p>
            <p>✓ You need a securely fenced yard (minimum 5 feet)</p>
            <p>✓ If renting, you need landlord approval for large breeds</p>
            <p>✓ All current pets must be spayed/neutered and vaccinated</p>
          </div>
          <Link href="/adoption-information" className="inline-block mt-4 text-teal-600 font-semibold hover:text-teal-700">
            View full adoption requirements →
          </Link>
        </div>

        <a
          href="https://form.jotform.com/RMGDRI/adoption-foster-application"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-teal-600 text-white px-10 py-5 rounded-lg text-xl font-semibold hover:bg-teal-700 transition-colors mb-6"
        >
          Start Your Application →
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
