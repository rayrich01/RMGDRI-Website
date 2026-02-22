import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Surrender a Great Dane | Rocky Mountain Great Dane Rescue',
  description:
    'If you need to surrender your Great Dane, RMGDRI is here to help. Learn about the owner surrender process for Colorado, Idaho, New Mexico, Montana, Utah, and Wyoming.',
  openGraph: {
    title: 'Surrender a Great Dane | Rocky Mountain Great Dane Rescue',
    description:
      'If you need to surrender your Great Dane, RMGDRI is here to help. Learn about the owner surrender process.',
  },
}

export default function SurrenderPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Page Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Owner Surrender</h1>
      <p className="text-xl text-teal-700 font-medium mb-8">
        We Are Here as a Resource
      </p>

      {/* Hero Image */}
      <div className="mb-10 rounded-xl overflow-hidden">
        <img
          src="/images/surrender/Duke3.jpg"
          alt="Great Dane"
          className="w-full h-auto"
        />
      </div>

      {/* CTA — Begin Process */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Ready to Surrender?
        </h2>
        <p className="text-gray-700 mb-4">
          To begin the surrender process, please fill out our intake form. Once
          we receive it, we will get in touch with you.
        </p>
        <a
          href="/apply/surrender"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          Begin Owner Surrender Form
        </a>
      </div>

      {/* Main Content */}
      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <p>
            Ideally, all dogs live in one loving home from puppyhood until death.
            Realistically, however, this isn&apos;t always possible. People become ill,
            die, divorce, move overseas, develop allergies, lose their jobs, lose
            their homes, etc. Any of these situations, among others, can be a reason
            for a dog coming into rescue.
          </p>
          <p>
            If you feel you are in a situation where you need to surrender your
            Great Dane, the information on this page will help you with the process
            of owner surrender. RMGDRI currently supports{' '}
            <strong>
              Colorado, Idaho, New Mexico, Montana, Utah, and Wyoming
            </strong>
            . If you are outside of our area you will need to contact your local
            rescue or shelter.
          </p>
        </section>

        {/* Important Notes */}
        <section className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mt-0 mb-4">
            Important Information
          </h2>
          <ul className="space-y-3 list-none pl-0">
            <li className="flex gap-3">
              <span className="text-amber-600 font-bold text-lg leading-6">•</span>
              <span>
                RMGDRI does not guarantee the acceptance of every owner surrender
                into rescue. During the initial interview, our Incoming Director
                will evaluate your situation to determine whether to proceed.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-600 font-bold text-lg leading-6">•</span>
              <span>
                There will be a wait to find a foster home. Depending on our
                waiting list, it may be{' '}
                <strong>2–4 weeks or longer</strong> before we can bring a dog
                into foster care.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-600 font-bold text-lg leading-6">•</span>
              <span>
                If you are surrendering more than one dog, please fill out a
                separate form for each one.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-600 font-bold text-lg leading-6">•</span>
              <span>
                Older dogs and dogs with medical problems may take longer to
                place.
              </span>
            </li>
          </ul>
        </section>

        {/* Urgent / Alternative Resources */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            Need Help Sooner?
          </h2>
          <p>
            We are happy to offer information on other rescues that may be able to
            help sooner. Please reach out to{' '}
            <a
              href="mailto:adoptadane@rmgreatdane.org"
              className="text-teal-600 hover:text-teal-800 underline"
            >
              adoptadane@rmgreatdane.org
            </a>{' '}
            for recommendations.
          </p>
          <p>
            If the situation is urgent, please reach out to your nearest shelter.
          </p>
          <p>
            If you are not ready to surrender your Dane but are looking for help
            with behavior issues, please email{' '}
            <a
              href="mailto:Training@rmgreatdane.org"
              className="text-teal-600 hover:text-teal-800 underline"
            >
              Training@rmgreatdane.org
            </a>{' '}
            with your location and issue description.
          </p>
        </section>

        {/* Intake Process */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            What Happens After You Apply
          </h2>

          <div className="grid gap-6 md:grid-cols-2 mt-4 not-prose">
            {/* Step 1 */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-teal-100 text-teal-800 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                  1
                </span>
                <h3 className="font-semibold text-gray-900">Introduction</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Fill out the surrender form. Once received, our team will contact
                you and conduct an initial interview.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-teal-100 text-teal-800 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                  2
                </span>
                <h3 className="font-semibold text-gray-900">Medical History</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Contact your vet and obtain a copy of your dog&apos;s medical records
                including rabies tag and microchip registration.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-teal-100 text-teal-800 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                  3
                </span>
                <h3 className="font-semibold text-gray-900">
                  Surrender Donation
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Suggested minimum surrender donation:{' '}
                <strong>$50.00</strong>
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-teal-100 text-teal-800 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                  4
                </span>
                <h3 className="font-semibold text-gray-900">Intake</h3>
              </div>
              <p className="text-gray-600 text-sm">
                When possible, you&apos;ll transport your dog to a designated intake
                location with familiar items (crate, bed, toys, food,
                medications). Your dog is placed in a pre-approved foster home.
              </p>
            </div>
          </div>
        </section>

        {/* Vetting Note */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700 m-0">
            All RMGDRI dogs are vetted, micro-chipped, spayed/neutered,
            vaccinated, and placed on heartworm prevention prior to adoption.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900">Contact</h2>
          <p>
            <strong>Email:</strong>{' '}
            <a
              href="mailto:adoptadane@rmgreatdane.org"
              className="text-teal-600 hover:text-teal-800 underline"
            >
              adoptadane@rmgreatdane.org
            </a>
          </p>
          <p>
            <strong>Mailing Address:</strong>
            <br />
            RMGDRI
            <br />
            P.O. Box 280368
            <br />
            Lakewood, CO 80228
          </p>
        </section>

        {/* Bottom CTA */}
        <div className="text-center pt-4 pb-2 not-prose">
          <a
            href="https://form.jotform.com/RMGDRI/owner-surrender"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Begin Owner Surrender Form
          </a>
        </div>
      </div>
    </main>
  )
}
