import Link from "next/link";

export const metadata = {
  title: "Check Back — Intake Temporarily Paused | RMGDRI",
  description:
    "Owner Surrender and Shelter Intake requests are temporarily paused while we transition to updated operations.",
};

export default function IntakePausePage() {
  return (
    <main className="pb-20 bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Check Back
          </h1>
          <p className="text-xl text-gray-600">
            Owner Surrender and Shelter Intake requests are temporarily paused.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Explanation */}
        <div className="prose prose-lg max-w-none text-gray-700 mb-10">
          <p>
            Please remember that Rocky Mountain Great Dane Rescue is a wholly
            volunteer-run organization and depends entirely on our foster
            families and volunteer team to care for the Danes that come into
            rescue.
          </p>

          <p>
            As we continue transitioning to our updated adoption, foster, and
            Dane intake processes, we do not currently have the staffing
            capacity to support standard Owner Surrender and Shelter Intake
            requests through our legacy process.
          </p>

          <p>
            We are still reviewing a limited number of intake situations on a
            case-by-case basis when urgency, available foster capacity, and
            rescue resources allow.
          </p>

          <p className="text-gray-500 text-base italic">
            Submission of a request does not guarantee acceptance, immediate
            placement, or an immediate response.
          </p>
        </div>

        {/* Contact Section */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Limited Intake Review
          </h2>
          <p className="text-gray-700 mb-6">
            If you believe your situation requires limited intake review,
            please contact us at:
          </p>

          <a
            href="mailto:rehome@rmgreatdane.org"
            className="inline-block text-lg font-semibold text-teal-700 hover:text-teal-800 mb-6"
          >
            rehome@rmgreatdane.org
          </a>

          <div className="bg-white rounded-lg p-6 border border-teal-100">
            <p className="font-medium text-gray-800 mb-3">
              Please include:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-teal-500 mr-2 mt-1">•</span>
                Your name
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2 mt-1">•</span>
                Phone number
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2 mt-1">•</span>
                City and state
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2 mt-1">•</span>
                Whether this is an owner surrender or shelter case
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2 mt-1">•</span>
                The dog&apos;s age and sex
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2 mt-1">•</span>
                The reason the situation is urgent
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2 mt-1">•</span>
                Any immediate medical or behavioral concerns
              </li>
            </ul>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a
            href="mailto:rehome@rmgreatdane.org"
            className="inline-block bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors text-center"
          >
            Email Intake Review
          </a>
          <Link
            href="/"
            className="inline-block bg-gray-100 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors text-center"
          >
            Return Home
          </Link>
        </div>

        {/* Closing */}
        <p className="text-center text-gray-500 text-sm">
          Thank you for your understanding and patience as we work to
          stabilize and strengthen our rescue operations.
        </p>
      </div>
    </main>
  );
}
