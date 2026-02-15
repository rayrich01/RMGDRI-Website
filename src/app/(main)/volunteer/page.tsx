import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Volunteer | RMGDRI',
  description:
    'Want to help make a difference? Join our volunteer team and help save Great Danes in need. From fostering to home checks, events, and fundraising - we have many ways you can get involved.',
}

export default function VolunteerPage() {
  return (
    <main className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Volunteer
            </h1>
            <p className="text-2xl md:text-3xl text-teal-300 mb-6">
              Want to Help Make a Difference?
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Intro Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/volunteer-hero.jpg"
                alt="Great Dane volunteer work"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The success of any organization, such as ours, depends greatly on its volunteers.
                We have the best group of volunteers any rescue organization could ask for, but we
                would love to have your help.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Volunteering is a wonderful way to meet great friends, learn new skills and help
                make a difference for Danes in need. Sound like fun? We have so many ways you can
                get involved.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Following are a few volunteer opportunities that we have available and we would
                welcome your help. You can also check out a more comprehensive list of volunteer
                opportunities on our{' '}
                <Link
                  href="/volunteer-opportunities"
                  className="text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                >
                  Volunteer Opportunities page
                </Link>.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                Don&apos;t see an opportunity that strikes your fancy? Just reach out and we can
                tailor a special position just for you.
              </p>

              {/* CTA Button */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950 dark:to-blue-950 p-6 rounded-xl text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Complete a Volunteer Application
                </h3>
                <a
                  href="https://form.jotform.com/RMGDRI/volunteer_application"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors shadow-lg"
                >
                  Start Now →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Opportunities - Row 1 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Ways You Can Help
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Become a Foster */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/volunteer-foster.jpg"
                  alt="Foster Great Dane"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Become a Foster
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Foster homes are one of our greatest needs. When you decide to foster a Great Dane,
                  you have taken a major step in saving the life of a Great Dane. Ready to open your
                  heart and home? Complete a Foster Application to get started today.
                </p>
                <Link
                  href="/foster-application"
                  className="block w-full bg-teal-600 hover:bg-teal-700 text-white text-center px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  Start Now →
                </Link>
              </div>
            </div>

            {/* Help Transport */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/volunteer-transport.jpg"
                  alt="Transport volunteer with Great Dane"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Help Transport
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  We receive our Danes from homes, shelters and other Rescues all around our 13 state
                  region. Often we need to retrieve the dog and place them into a home situation or get
                  them medical care. Love a good road trip?
                </p>
                <a
                  href="https://form.jotform.com/RMGDRI/volunteer_application"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-teal-600 hover:bg-teal-700 text-white text-center px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  Start Now →
                </a>
              </div>
            </div>

            {/* Conduct Home Checks */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/volunteer-homecheck.jpg"
                  alt="Home check volunteer"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Conduct Home Checks
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Home checks are performed for every prospective adoptive and foster family. We like
                  to make sure that every new home has certain required elements. The process does not
                  take long and is very rewarding. Sound like fun?
                </p>
                <a
                  href="https://form.jotform.com/RMGDRI/volunteer_application"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-teal-600 hover:bg-teal-700 text-white text-center px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  Start Now →
                </a>
              </div>
            </div>
          </div>

          {/* Featured Opportunities - Row 2 */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Attend Events */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/volunteer-events.jpg"
                  alt="Event volunteer with Great Danes"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Attend Events
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  We host and attend many events throughout the year to help promote the Rescue and
                  our Danes. If you love to talk about Great Danes and meet new people this could be
                  the perfect opportunity for you.
                </p>
                <a
                  href="https://form.jotform.com/RMGDRI/volunteer_application"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-teal-600 hover:bg-teal-700 text-white text-center px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  Start Now →
                </a>
              </div>
            </div>

            {/* Raise Funds */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/volunteer-fundraising.jpg"
                  alt="Fundraising volunteer"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Raise Funds
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  This is an important aspect of our Rescue. We are a non-profit organization and
                  derive our operating funds from donations and fundraising functions. Brainstorm on
                  new fundraising ideas and dabble in a little marketing. Interested?
                </p>
                <a
                  href="https://form.jotform.com/RMGDRI/volunteer_application"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-teal-600 hover:bg-teal-700 text-white text-center px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  Start Now →
                </a>
              </div>
            </div>

            {/* More Opportunities */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950 dark:to-blue-950 border-2 border-teal-300 dark:border-teal-700 rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-lg">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Many More Opportunities!
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                From social media to grant writing, photography to administrative support - we have
                many more ways you can help.
              </p>
              <Link
                href="/volunteer-opportunities"
                className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                See All Opportunities →
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white py-12 px-8 rounded-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our amazing team of volunteers and help save Great Danes in need.
            Every hour you give makes a real impact.
          </p>
          <a
            href="https://form.jotform.com/RMGDRI/volunteer_application"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-10 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg"
          >
            Apply to Volunteer Today →
          </a>
          <p className="text-sm text-gray-400 mt-4">
            Questions? Contact us at{' '}
            <a href="mailto:volunteer@rmgreatdane.org" className="text-teal-400 hover:underline">
              volunteer@rmgreatdane.org
            </a>
          </p>
        </section>
      </div>
    </main>
  )
}
