import Link from 'next/link'

export const metadata = {
  title: 'Great Dane Health Care | RMGDRI',
  description: 'Essential health information for Great Dane owners, including common conditions and preventive care.',
}

export default function GreatDaneHealthCarePage() {
  return (
    <main className="pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Great Dane Health Care</h1>
          <p className="text-xl text-gray-600">
            Essential health information for keeping your gentle giant healthy
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-8 rounded-xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Great Danes, like all giant breeds, have specific health needs and are prone to certain conditions. Understanding these issues and providing preventive care can help your Dane live the longest, healthiest life possible.
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-gray-900 font-semibold">
                ⚠️ This information is educational only and does not replace veterinary advice. Always consult your veterinarian for health concerns.
              </p>
            </div>
          </div>
        </section>

        {/* Bloat - Most Critical */}
        <section className="mb-12">
          <div className="bg-red-100 border-2 border-red-500 p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-red-900 mb-4">⚠️ BLOAT (GDV) - Life-Threatening Emergency</h2>
            <p className="text-gray-900 font-bold mb-4">
              Bloat (Gastric Dilatation-Volvulus) is the #1 killer of Great Danes. Every Dane owner MUST know the signs.
            </p>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Emergency Signs - Go to Vet IMMEDIATELY:</h3>
              <ul className="space-y-2 text-gray-900">
                <li>• Distended, hard, bloated abdomen</li>
                <li>• Unproductive retching or vomiting (trying to vomit but nothing comes up)</li>
                <li>• Excessive drooling</li>
                <li>• Restlessness, pacing, inability to get comfortable</li>
                <li>• Rapid, shallow breathing</li>
                <li>• Pale gums</li>
                <li>• Weakness or collapse</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Prevention Strategies:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Feed 2-3 smaller meals daily instead of one large meal</li>
                <li>✓ Use elevated food bowls</li>
                <li>✓ Avoid exercise 1 hour before and 2 hours after eating</li>
                <li>✓ Slow down fast eaters with puzzle feeders or slow-feed bowls</li>
                <li>✓ Limit water intake immediately after eating</li>
                <li>✓ Avoid stressful situations around feeding time</li>
                <li>✓ Consider prophylactic gastropexy surgery (stomach tacking)</li>
              </ul>
            </div>

            <p className="text-gray-900 font-bold">
              Time is critical! Bloat can kill within hours. Have your emergency vet&apos;s number readily available and know where the nearest 24-hour emergency clinic is located.
            </p>
          </div>
        </section>

        {/* Common Health Issues */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Common Health Conditions</h2>
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-teal-600 mb-3">Hip Dysplasia</h3>
              <p className="text-gray-700 mb-3">
                <strong>What it is:</strong> Malformation of the hip joint causing arthritis and pain.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Signs:</strong> Difficulty rising, limping, reluctance to jump or climb stairs, decreased activity.
              </p>
              <p className="text-gray-700">
                <strong>Management:</strong> Weight management, joint supplements, pain medication, physical therapy. Severe cases may require surgery.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-teal-600 mb-3">Dilated Cardiomyopathy (DCM)</h3>
              <p className="text-gray-700 mb-3">
                <strong>What it is:</strong> Heart disease where the heart muscle weakens and enlarges.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Signs:</strong> Coughing, difficulty breathing, exercise intolerance, fainting, lethargy.
              </p>
              <p className="text-gray-700">
                <strong>Management:</strong> Regular cardiac screenings. If diagnosed, medications can help manage symptoms and extend quality of life. Grain-free diets may be linked to DCM—consult your vet about nutrition.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-teal-600 mb-3">Osteosarcoma (Bone Cancer)</h3>
              <p className="text-gray-700 mb-3">
                <strong>What it is:</strong> Aggressive bone cancer common in giant breeds, usually affecting the legs.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Signs:</strong> Lameness, swelling of a leg, pain, reluctance to bear weight.
              </p>
              <p className="text-gray-700">
                <strong>Management:</strong> Treatment typically involves amputation and chemotherapy. Early detection is crucial. Any persistent lameness should be evaluated promptly.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-teal-600 mb-3">Wobbler Syndrome (Cervical Spondylomyelopathy)</h3>
              <p className="text-gray-700 mb-3">
                <strong>What it is:</strong> Compression of the spinal cord in the neck causing neurological issues.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Signs:</strong> Wobbly gait (especially in rear legs), neck pain, difficulty walking, incoordination.
              </p>
              <p className="text-gray-700">
                <strong>Management:</strong> Mild cases may be managed with anti-inflammatories and restricted activity. Severe cases may require surgery.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-teal-600 mb-3">Hypothyroidism</h3>
              <p className="text-gray-700 mb-3">
                <strong>What it is:</strong> Underactive thyroid gland causing metabolic issues.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Signs:</strong> Weight gain, lethargy, hair loss, skin problems, cold intolerance.
              </p>
              <p className="text-gray-700">
                <strong>Management:</strong> Easily managed with daily thyroid medication. Regular blood tests monitor levels.
              </p>
            </div>
          </div>
        </section>

        {/* Preventive Care */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Preventive Health Care</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-teal-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Regular Veterinary Visits</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Annual wellness exams (twice yearly for seniors)</li>
                <li>• Keep vaccinations current</li>
                <li>• Annual heartworm test</li>
                <li>• Regular fecal exams</li>
                <li>• Cardiac screening starting at age 1-2</li>
              </ul>
            </div>

            <div className="bg-teal-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Weight Management</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Keep Danes lean—obesity worsens joint problems</li>
                <li>• Monitor body condition regularly</li>
                <li>• Adjust food as needed</li>
                <li>• Avoid overfeeding treats</li>
              </ul>
            </div>

            <div className="bg-teal-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Exercise & Activity</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Moderate daily exercise</li>
                <li>• Avoid high-impact activities</li>
                <li>• No forced running until 18 months old</li>
                <li>• Swimming is excellent low-impact exercise</li>
              </ul>
            </div>

            <div className="bg-teal-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dental Care</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Daily tooth brushing ideal</li>
                <li>• Dental chews and toys</li>
                <li>• Professional cleanings as recommended</li>
                <li>• Monitor for bad breath or mouth pain</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Nutrition */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Nutrition Guidelines</h2>
          <div className="bg-gray-50 p-6 rounded-xl space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Large/Giant Breed Formulas</h3>
              <p className="text-gray-700">
                Feed food specifically formulated for large or giant breeds. These have appropriate calcium/phosphorus ratios crucial for bone development.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">Puppies (Under 18 months)</h3>
              <p className="text-gray-700">
                Use LARGE BREED PUPPY food, not regular puppy food. Regular puppy food has too much calcium and can cause developmental orthopedic diseases. Keep puppies lean during growth.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">Adults</h3>
              <p className="text-gray-700">
                High-quality large breed adult food. Avoid grain-free diets unless medically necessary, as they&apos;ve been linked to DCM in some cases. Consult your vet about nutrition.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">Supplements</h3>
              <p className="text-gray-700">
                Joint supplements (glucosamine, chondroitin) may benefit joint health. Discuss with your vet before adding supplements.
              </p>
            </div>
          </div>
        </section>

        {/* Cost Considerations */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Cost Considerations</h2>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
            <p className="text-gray-700 mb-4">
              Be financially prepared for giant breed healthcare costs:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Medications dosed by weight cost more for 150 lb dogs</li>
              <li>• Anesthesia and surgery costs are higher</li>
              <li>• Emergency bloat surgery: $2,000-$5,000+</li>
              <li>• Preventive gastropexy: $400-$800 (often done during spay/neuter)</li>
              <li>• Consider pet insurance, especially when young</li>
              <li>• Build an emergency fund for unexpected health issues</li>
            </ul>
          </div>
        </section>

        {/* Senior Care */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Senior Great Dane Care (6+ years)</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              Great Danes are considered seniors around 6-7 years old. Senior care includes:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-teal-600 text-xl">✓</span>
                <span>Twice-yearly vet visits with senior blood panels</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 text-xl">✓</span>
                <span>Joint supplements and pain management as needed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 text-xl">✓</span>
                <span>Orthopedic beds and non-slip flooring</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 text-xl">✓</span>
                <span>Ramps to help with car and furniture access</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 text-xl">✓</span>
                <span>Adjusted exercise to match energy levels</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 text-xl">✓</span>
                <span>Monitor for cognitive changes</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 text-white p-8 rounded-xl text-center">
          <h3 className="text-2xl font-bold mb-4">Questions About Great Dane Health?</h3>
          <p className="text-lg mb-6 text-gray-300">
            Learn more about the breed or contact us for information about our available dogs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/about-great-danes"
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              About Great Danes
            </Link>
            <Link
              href="/available-danes"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Available Danes
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
