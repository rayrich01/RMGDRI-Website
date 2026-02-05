import Link from 'next/link'

export const metadata = {
  title: 'Shelter Transfers | RMGDRI',
  description: 'Information for shelters and rescues about transferring Great Danes to RMGDRI.',
}

export default function ShelterTransfersPage() {
  return (
    <main className="pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Shelter Transfers</h1>
          <p className="text-xl text-gray-600">
            Working together to save Great Danes
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-8 rounded-xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Rocky Mountain Great Dane Rescue partners with shelters and animal control facilities throughout our six-state service area to pull Great Danes and Dane mixes from potentially life-threatening situations.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              If you&apos;re a shelter or rescue organization with a Great Dane or Dane mix in your facility, we may be able to help. Our breed-specific expertise and foster network allow us to provide specialized care these gentle giants need.
            </p>
          </div>
        </section>

        {/* Why Transfer to RMGDRI */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Transfer Great Danes to RMGDRI?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Breed-Specific Expertise</h3>
              <p className="text-gray-700">
                We understand Great Dane health issues, behavior, and temperament. We know how to assess and place these dogs successfully.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Foster-Based Care</h3>
              <p className="text-gray-700">
                Great Danes do poorly in kennels. Our foster homes provide a stress-free environment where dogs can decompress and show their true personalities.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Medical Resources</h3>
              <p className="text-gray-700">
                We have established relationships with veterinarians experienced in giant breed medicine and can handle expensive medical cases.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Dedicated Adopter Network</h3>
              <p className="text-gray-700">
                Our adopters specifically want Great Danes and understand the breed&apos;s needs. We carefully screen to ensure good matches.
              </p>
            </div>
          </div>
        </section>

        {/* Service Area */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Service Area</h2>
          <p className="text-gray-700 mb-4">
            We accept transfers from shelters in:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {['Colorado', 'Utah', 'Wyoming', 'Idaho', 'Montana', 'New Mexico'].map((state) => (
              <div key={state} className="bg-gradient-to-br from-teal-50 to-emerald-50 p-4 rounded-lg text-center">
                <span className="text-lg font-semibold text-gray-900">{state}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-700 italic">
            In rare cases, we may consider dogs from outside our service area if they have special circumstances or needs.
          </p>
        </section>

        {/* What We Need */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Transfer Requirements & Information</h2>
          <p className="text-gray-700 mb-4">
            To evaluate a transfer request, we need the following information:
          </p>

          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-3">Basic Information</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Photos of the dog (multiple angles, standing if possible)</li>
                <li>• Age, sex, weight</li>
                <li>• Spayed/neutered status</li>
                <li>• Microchip number if applicable</li>
                <li>• How the dog came into your shelter (stray, owner surrender, etc.)</li>
                <li>• Any known history</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-3">Medical Information</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Current vaccination status</li>
                <li>• Heartworm test results</li>
                <li>• Any medical issues or special needs</li>
                <li>• Medications currently on</li>
                <li>• Veterinary records if available</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-3">Behavioral Assessment</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Temperament evaluation results</li>
                <li>• Behavior with people (friendly, shy, fearful, aggressive?)</li>
                <li>• Behavior with other dogs</li>
                <li>• Behavior with cats if tested</li>
                <li>• Any behavioral concerns or issues</li>
                <li>• Energy level and play style</li>
                <li>• How they handle kennel/shelter environment</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-3">Urgency Information</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Deadline if dog is at risk of euthanasia</li>
                <li>• Current intake capacity of your facility</li>
                <li>• Reason transfer is needed</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Important Information for Shelters</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
              <h3 className="font-bold text-gray-900 mb-2">Foster Space is Limited</h3>
              <p className="text-gray-700">
                RMGDRI operates entirely through volunteer foster homes. We may not always have space available immediately. We prioritize based on urgency and the dog&apos;s situation.
              </p>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
              <h3 className="font-bold text-gray-900 mb-2">Complete Disclosure Required</h3>
              <p className="text-gray-700">
                Please be completely honest about any behavioral or medical issues. Undisclosed aggression or major health problems put our volunteers and other dogs at risk, and may result in failed placements. We can work with many issues if we know about them upfront.
              </p>
            </div>

            <div className="bg-teal-50 border-l-4 border-teal-500 p-6 rounded-r-xl">
              <h3 className="font-bold text-gray-900 mb-2">Dogs Must Be Vetted</h3>
              <p className="text-gray-700">
                We require that dogs be examined by a veterinarian, have current vaccinations, and be tested for heartworm before transfer. If your shelter cannot provide this, contact us to discuss options.
              </p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
              <h3 className="font-bold text-gray-900 mb-2">Transfer Agreements</h3>
              <p className="text-gray-700">
                We use standard rescue transfer agreements. The dog becomes the property of RMGDRI upon transfer. We handle all future medical care and adoption.
              </p>
            </div>
          </div>
        </section>

        {/* Dogs We Prioritize */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Transfer Priorities</h2>
          <p className="text-gray-700 mb-4">
            Due to limited foster space, we prioritize:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-3">High Priority</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Dogs on euthanasia lists</li>
                <li>✓ Purebred Great Danes</li>
                <li>✓ Dogs in rural shelters with limited resources</li>
                <li>✓ Dogs with medical needs we can address</li>
                <li>✓ Pregnant or nursing Great Danes</li>
                <li>✓ Dogs who aren&apos;t doing well in kennel environment</li>
              </ul>
            </div>

            <div className="bg-gray-100 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Case-by-Case Basis</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Dane mixes (depends on percentage and availability)</li>
                <li>• Dogs with behavioral concerns</li>
                <li>• Dogs in shelters with no immediate risk</li>
                <li>• Dogs requiring extensive medical care</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How to Contact */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Request a Transfer</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                <p className="text-gray-700">
                  Send an email to{' '}
                  <a href="mailto:info@rmgreatdane.org" className="text-teal-600 hover:text-teal-700 font-semibold">
                    info@rmgreatdane.org
                  </a>{' '}
                  with the subject line &quot;Shelter Transfer Request&quot;
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Include All Information</h3>
                <p className="text-gray-700">
                  Provide all the information listed above, including photos and any medical/behavioral records.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Response Time</h3>
                <p className="text-gray-700">
                  We aim to respond within 24-48 hours. If the dog is on an urgent timeline, please note that in your subject line.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Coordinate Transfer</h3>
                <p className="text-gray-700">
                  If we can accept the dog, we&apos;ll coordinate transport logistics and complete transfer paperwork.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Thank You */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Your Partnership</h2>
            <p className="text-gray-700 leading-relaxed">
              We deeply appreciate the work shelters and animal control facilities do every day. By working together, we can ensure that Great Danes in crisis find their way to safety and eventually, their forever homes. Thank you for thinking of RMGDRI when you have Great Danes in need.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 text-white p-10 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Have a Great Dane in Your Shelter?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto text-gray-300">
            Contact us as soon as possible. We prioritize urgent cases and dogs in danger of being euthanized.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://form.jotform.com/RMGDRI/rescue-or-shelter-transfer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Rescue / Shelter Transfer Form
            </a>
            <a
              href="mailto:info@rmgreatdane.org"
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Email: info@rmgreatdane.org
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
