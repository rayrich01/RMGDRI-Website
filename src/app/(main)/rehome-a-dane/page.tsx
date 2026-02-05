import Link from 'next/link'

export const metadata = {
  title: 'Rehome a Great Dane | RMGDRI',
  description: 'Need to rehome your Great Dane? RMGDRI can help guide you through the process with compassion and support.',
}

export default function RehomeADanePage() {
  return (
    <main className="pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Rehome a Great Dane</h1>
          <p className="text-xl text-gray-600">
            Compassionate support during a difficult time
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-8 rounded-xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              We understand that sometimes, despite your best efforts and intentions, circumstances change and you can no longer keep your Great Dane. This is an incredibly difficult decision, and we&apos;re here to help without judgment.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Rocky Mountain Great Dane Rescue exists to ensure Great Danes never end up in shelters where they may be at risk. We&apos;re here to guide you through the rehoming process and help find your Dane a new loving home.
            </p>
          </div>
        </section>

        {/* Before You Decide */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Before You Decide to Rehome</h2>
          <p className="text-gray-700 mb-4">
            Many challenges have solutions. Consider whether these options might help you keep your Great Dane:
          </p>
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">Behavioral Issues</h3>
              <p className="text-gray-700">
                Many behavior problems can be resolved with training. We can recommend trainers experienced with Great Danes. Issues like separation anxiety, house training, or reactivity often improve with professional help.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">Financial Hardship</h3>
              <p className="text-gray-700">
                If veterinary costs are overwhelming, ask about payment plans, CareCredit, or look into pet assistance programs. Some organizations help with spay/neuter, vaccinations, or emergency care costs.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">Moving/Housing Issues</h3>
              <p className="text-gray-700">
                Many landlords will accept large dogs with additional deposits or pet rent. Provide references from previous landlords about your Dane&apos;s good behavior. Consider expanding your housing search to pet-friendly properties.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">Time Constraints</h3>
              <p className="text-gray-700">
                Dog walkers, daycare, or asking friends/family to help exercise your Dane might solve the problem. Great Danes need less exercise than many breeds and can adapt to busy schedules.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">New Baby/Young Children</h3>
              <p className="text-gray-700">
                With proper management, Great Danes and children can coexist beautifully. Many resources exist for introducing dogs to babies and teaching children how to safely interact with dogs.
              </p>
            </div>
          </div>
        </section>

        {/* If You Must Rehome */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">If You Must Rehome Your Great Dane</h2>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl mb-6">
            <p className="font-bold text-gray-900 mb-2">⚠️ Important: Do NOT take your Great Dane to a shelter</p>
            <p className="text-gray-700">
              Great Danes do poorly in shelter environments and may be euthanized quickly due to their size and special needs. RMGDRI exists specifically to prevent this. Contact us first.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">How RMGDRI Can Help</h3>
          <p className="text-gray-700 mb-4">
            We offer guidance and support in several ways:
          </p>

          <div className="space-y-6">
            <div className="bg-white border-2 border-teal-300 p-6 rounded-xl">
              <h4 className="text-xl font-bold text-teal-600 mb-3">Option 1: Owner-Facilitated Rehoming (Preferred)</h4>
              <p className="text-gray-700 mb-3">
                We guide you through safely rehoming your Dane directly to a new family:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• We help you write an honest, appealing description</li>
                <li>• We share your dog on our social media and website</li>
                <li>• We screen potential adopters for you</li>
                <li>• We provide adoption contracts and advice</li>
                <li>• Your Dane stays in your home during the process (less stress)</li>
                <li>• You can meet potential adopters and approve the placement</li>
              </ul>
              <p className="text-gray-700 mt-3 italic">
                This is the fastest and least stressful option for your dog.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-300 p-6 rounded-xl">
              <h4 className="text-xl font-bold text-gray-900 mb-3">Option 2: Surrender to RMGDRI</h4>
              <p className="text-gray-700 mb-3">
                If owner-facilitated rehoming isn&apos;t possible, we may be able to take your Dane into our program:
              </p>
              <ul className="space-y-2 text-gray-700 mb-3">
                <li>• We evaluate your Dane&apos;s temperament and medical needs</li>
                <li>• Your Dane goes into a foster home (not a kennel)</li>
                <li>• We provide all necessary veterinary care</li>
                <li>• We find the best possible match for adoption</li>
                <li>• You sign a surrender agreement releasing ownership</li>
              </ul>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Important:</strong> RMGDRI operates entirely on donations and foster homes. We may have a waiting list and cannot always accept surrenders immediately. We prioritize Great Danes in the most urgent situations.
                </p>
              </div>
              <p className="text-gray-700 mt-3">
                <strong>Surrender Fee:</strong> We ask for a surrender fee (typically $200-500) to help offset medical and care costs. We understand finances may be part of your situation and can discuss options.
              </p>
            </div>
          </div>
        </section>

        {/* What We Need to Know */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Information We&apos;ll Need</h2>
          <p className="text-gray-700 mb-4">
            To help your Great Dane find the right home, please be prepared to provide:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">Basic Information</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Age, sex, spayed/neutered status</li>
                <li>• Color, weight, size</li>
                <li>• Medical history and records</li>
                <li>• Current vaccinations</li>
                <li>• Microchip number</li>
              </ul>
            </div>

            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">Behavior & Temperament</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Good with kids? Other dogs? Cats?</li>
                <li>• House trained? Crate trained?</li>
                <li>• Energy level and exercise needs</li>
                <li>• Any behavioral issues</li>
                <li>• Training received</li>
              </ul>
            </div>

            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">Health Issues</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Current medications</li>
                <li>• Ongoing health conditions</li>
                <li>• Previous surgeries or injuries</li>
                <li>• Special care requirements</li>
                <li>• Food allergies or sensitivities</li>
              </ul>
            </div>

            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">History</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• How long you&apos;ve owned them</li>
                <li>• Where they came from originally</li>
                <li>• Reason for rehoming</li>
                <li>• Living situation/environment</li>
                <li>• Daily routine</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Be Honest */}
        <section className="mb-12">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Please Be Completely Honest</h3>
            <p className="text-gray-700 mb-3">
              Honesty about your Dane&apos;s behavior, health, and needs is crucial for a successful placement. Undisclosed aggression, serious health issues, or behavior problems can result in a failed adoption and more trauma for the dog.
            </p>
            <p className="text-gray-700">
              We will not judge you for your Dane&apos;s issues. Every dog has strengths and challenges. Transparency helps us find the RIGHT home, not just any home.
            </p>
          </div>
        </section>

        {/* What Happens Next */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What Happens Next</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Contact Us</h3>
                <p className="text-gray-700">
                  Email us at info@rmgreatdane.org with your situation and your dog&apos;s information. Include photos if possible.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Initial Conversation</h3>
                <p className="text-gray-700">
                  A volunteer will contact you to discuss your options and what support we can provide.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Develop a Plan</h3>
                <p className="text-gray-700">
                  We&apos;ll work with you on either owner-facilitated rehoming or surrender to RMGDRI, depending on your situation and our capacity.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Find the Right Home</h3>
                <p className="text-gray-700">
                  Whether you rehome directly with our guidance or your Dane enters our program, we&apos;ll ensure they find a loving, appropriate forever home.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 text-white p-8 rounded-xl text-center">
          <h3 className="text-2xl font-bold mb-4">Need to Rehome Your Great Dane?</h3>
          <p className="text-lg mb-6 text-gray-300">
            Contact us for compassionate guidance and support
          </p>
          <a
            href="mailto:info@rmgreatdane.org?subject=Rehoming%20a%20Great%20Dane"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Email Us About Rehoming
          </a>
        </div>
      </div>
    </main>
  )
}
