import Link from 'next/link'

export const metadata = {
  title: 'About Great Danes | RMGDRI',
  description: 'Learn about the Great Dane breed, their temperament, care needs, and what makes them special.',
}

export default function AboutGreatDanesPage() {
  return (
    <main className="pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">About Great Danes</h1>
          <p className="text-xl text-gray-600">
            The gentle giants of the dog world
          </p>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Great Dane Breed</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Great Danes are one of the largest dog breeds, yet they&apos;re known for their gentle, friendly nature. Often called &quot;gentle giants,&quot; these magnificent dogs combine size and strength with grace and affection.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Despite their imposing size, Great Danes are typically calm, patient, and devoted companions who want nothing more than to be close to their families.
            </p>
          </div>
        </section>

        {/* Physical Characteristics */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Physical Characteristics</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Size</h3>
              <p className="text-gray-700 mb-2">
                <strong>Height:</strong> 28-34 inches at the shoulder
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Weight:</strong> 110-175+ pounds
              </p>
              <p className="text-gray-700">
                Males are typically larger than females. They are among the tallest dog breeds.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Lifespan</h3>
              <p className="text-gray-700 mb-2">
                <strong>Average:</strong> 7-10 years
              </p>
              <p className="text-gray-700">
                Giant breeds typically have shorter lifespans than smaller dogs. With excellent care, some Great Danes live beyond 10 years.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Coat Colors</h3>
              <p className="text-gray-700">
                Fawn, Brindle, Blue, Black, Harlequin (white with black patches), Mantle (black and white), and Merle. Each color has its own unique beauty.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">Physical Features</h3>
              <p className="text-gray-700">
                Short, smooth coat requiring minimal grooming. Long, elegant neck. Deep chest. Athletic, muscular build despite their gentle demeanor.
              </p>
            </div>
          </div>
        </section>

        {/* Temperament */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Temperament & Personality</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              Great Danes are known for being:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-teal-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Gentle & Patient</h4>
                <p className="text-sm">
                  Despite their size, Great Danes are typically very gentle, especially with children. They&apos;re often unaware of their own size!
                </p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Affectionate</h4>
                <p className="text-sm">
                  They love to be near their people and often think they&apos;re lap dogs. Don&apos;t be surprised if your Dane tries to sit on you!
                </p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Friendly</h4>
                <p className="text-sm">
                  Most Great Danes are social and friendly with people and other dogs when properly socialized.
                </p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Loyal & Devoted</h4>
                <p className="text-sm">
                  They form deep bonds with their families and are naturally protective, though not typically aggressive.
                </p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Intelligent</h4>
                <p className="text-sm">
                  Great Danes are smart and trainable, though they can have an independent streak. Positive reinforcement works best.
                </p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Moderate Energy</h4>
                <p className="text-sm">
                  They need daily exercise but are often content to lounge around the house. They&apos;re not hyperactive dogs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Care Requirements */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Care Requirements</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-teal-600 mb-3">Exercise Needs</h3>
              <p className="text-gray-700 leading-relaxed">
                Great Danes need moderate daily exercise—typically 30-60 minutes of walking or play. Avoid excessive running or jumping, especially during the first 18 months when their bones are still developing. They should not be jogging partners or do high-impact activities.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-teal-600 mb-3">Space Needs</h3>
              <p className="text-gray-700 leading-relaxed">
                Despite their size, Great Danes can adapt to various living situations if given enough exercise. A house with a yard is ideal, but they can live in larger apartments if walked regularly. They need space to stretch out comfortably indoors.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-teal-600 mb-3">Grooming</h3>
              <p className="text-gray-700 leading-relaxed">
                Great Danes have short coats that require minimal grooming—weekly brushing and occasional baths. They do shed moderately year-round. Nail trimming, ear cleaning, and dental care are important maintenance tasks.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-teal-600 mb-3">Training & Socialization</h3>
              <p className="text-gray-700 leading-relaxed">
                Early training and socialization are essential. Because of their size, even friendly Great Danes need good manners. Puppy classes and ongoing training help them become well-adjusted adults. They respond best to positive, reward-based training methods.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-teal-600 mb-3">Food & Nutrition</h3>
              <p className="text-gray-700 leading-relaxed">
                Great Danes require high-quality food formulated for large or giant breeds. They eat significant amounts—budget $60-100+ per month for food. Feeding from elevated bowls and avoiding exercise immediately after eating can help prevent bloat, a life-threatening condition.
              </p>
            </div>
          </div>
        </section>

        {/* Health Considerations */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Health Considerations</h2>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl mb-6">
            <p className="text-gray-700 font-semibold mb-2">
              Giant breeds like Great Danes are prone to certain health issues:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Bloat (GDV):</strong> A life-threatening emergency requiring immediate veterinary care</li>
              <li>• <strong>Hip Dysplasia:</strong> Common in large breeds, can cause arthritis and mobility issues</li>
              <li>• <strong>Heart Disease:</strong> Dilated cardiomyopathy is a concern in the breed</li>
              <li>• <strong>Bone Cancer:</strong> More common in giant breeds than smaller dogs</li>
              <li>• <strong>Wobbler Syndrome:</strong> Spinal cord compression affecting the neck</li>
            </ul>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            Regular veterinary care, appropriate nutrition, maintaining a healthy weight, and awareness of breed-specific issues can help Great Danes live their best lives.
          </p>
          <Link
            href="/great-dane-health-care"
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            Learn more about Great Dane health care →
          </Link>
        </section>

        {/* Is a Great Dane Right for You */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Is a Great Dane Right for You?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Great Danes are Perfect If You:</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Want a calm, affectionate companion</li>
                <li>✓ Have space for a large dog</li>
                <li>✓ Can afford giant breed expenses</li>
                <li>✓ Are home regularly or can provide companionship</li>
                <li>✓ Accept a shorter lifespan</li>
                <li>✓ Don&apos;t mind dog hair and drool</li>
                <li>✓ Are committed to training and socialization</li>
              </ul>
            </div>

            <div className="bg-red-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Great Danes May Not Be Right If You:</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✗ Live in a very small space</li>
                <li>✗ Can&apos;t afford large dog expenses</li>
                <li>✗ Want a long-lived dog (15+ years)</li>
                <li>✗ Are away from home most of the day</li>
                <li>✗ Want a highly active, athletic dog</li>
                <li>✗ Can&apos;t tolerate drool or shedding</li>
                <li>✗ Don&apos;t have time for daily exercise</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 text-white p-8 rounded-xl text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Meet a Great Dane?</h3>
          <p className="text-lg mb-6 text-gray-300">
            Browse our available Great Danes or learn more about the adoption process
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/available-danes"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Available Danes
            </Link>
            <Link
              href="/adoption-information"
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Adoption Information
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
