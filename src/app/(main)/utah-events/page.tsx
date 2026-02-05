import Link from 'next/link'

export const metadata = {
  title: 'Utah Events | RMGDRI',
  description: 'Great Dane events, meetups, and activities in Utah. Join the RMGDRI community!',
}

export default function UtahEventsPage() {
  return (
    <main className="pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Utah Events</h1>
          <p className="text-xl text-gray-600">
            Great Dane gatherings, fundraisers, and community events in Utah
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-8 rounded-xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              RMGDRI hosts regular events in Utah for Great Dane lovers, adopters, fosters, and supporters to come together. These gatherings are a wonderful opportunity to socialize your Dane, meet other gentle giants, connect with the rescue community, and support our mission.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Whether you&apos;ve adopted from us, are considering adoption, or just love Great Danes, you&apos;re welcome at our events!
            </p>
          </div>
        </section>

        {/* Regular Events */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Regular Utah Events</h2>
          <div className="space-y-6">
            <div className="bg-white border-2 border-teal-300 p-6 rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Monthly Dane Romp</h3>
                  <p className="text-teal-600 font-semibold">Second Saturday of Each Month</p>
                </div>
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                  Most Popular
                </span>
              </div>
              <p className="text-gray-700 mb-3">
                Join us for our monthly off-leash playgroup at rotating dog parks around the Salt Lake Valley and Utah County. This is a fantastic opportunity for Great Danes to socialize, run, and play together in a safe environment.
              </p>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Time:</strong> 9:00 AM - 11:00 AM</p>
                <p className="text-gray-700 mb-2"><strong>Location:</strong> Varies (announced on Facebook)</p>
                <p className="text-gray-700 mb-2"><strong>What to Bring:</strong> Water for your dog, poop bags, friendly attitude</p>
                <p className="text-gray-700"><strong>Requirements:</strong> Dogs must be friendly with other dogs and current on vaccinations</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Adoption Events</h3>
              <p className="text-teal-600 font-semibold mb-3">Various Saturdays</p>
              <p className="text-gray-700 mb-3">
                We periodically hold adoption events at pet stores and community venues where you can meet available Great Danes looking for homes. These events also feature information about fostering, volunteering, and supporting RMGDRI.
              </p>
              <p className="text-gray-700">
                <strong>Stay Updated:</strong> Follow our Facebook page for announcements of upcoming adoption events.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Annual Fundraisers</h3>
              <p className="text-teal-600 font-semibold mb-3">Spring & Fall</p>
              <p className="text-gray-700 mb-3">
                We host fundraising events twice a year to support our rescue operations. Past events have included:
              </p>
              <ul className="space-y-2 text-gray-700 mb-3">
                <li>• Restaurant fundraiser nights (portion of sales donated to RMGDRI)</li>
                <li>• Great Dane photo contests</li>
                <li>• Online auctions and raffles</li>
                <li>• Merchandise sales (t-shirts, calendars, stickers)</li>
              </ul>
              <p className="text-gray-700">
                These events are crucial for funding the medical care, food, and supplies our rescued Great Danes need.
              </p>
            </div>
          </div>
        </section>

        {/* Special Events */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Special Annual Events</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">🎃 Halloween Costume Contest</h3>
              <p className="text-gray-700">
                October event where Great Danes show off their Halloween costumes! Categories include funniest, scariest, and most creative. Prizes awarded and professional photos available.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">🎄 Holiday Photo Shoot</h3>
              <p className="text-gray-700">
                December event offering professional holiday photos with your Great Dane. Photos make perfect holiday cards! Proceeds benefit RMGDRI.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">🌸 Spring Hike</h3>
              <p className="text-gray-700">
                Group hike at a dog-friendly Utah trail. Great Dane owners come together for exercise, fresh air, and community building. Typically 2-3 miles, easy to moderate difficulty.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 mb-3">☀️ Summer BBQ</h3>
              <p className="text-gray-700">
                Annual summer gathering with food, games, and Great Dane socialization. Meet other adopters, share stories, and celebrate our rescue community.
              </p>
            </div>
          </div>
        </section>

        {/* How to Stay Informed */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Stay Informed About Events</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
              <h3 className="font-bold text-gray-900 mb-2">Follow Us on Facebook</h3>
              <p className="text-gray-700 mb-3">
                Our Facebook page is the best place to get up-to-date information about upcoming events, location changes, and event photos.
              </p>
              <a
                href="https://www.facebook.com/rmgdri"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blue-600 hover:text-blue-700 font-semibold"
              >
                Visit RMGDRI on Facebook →
              </a>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">Join Our Email List</h3>
              <p className="text-gray-700">
                Email{' '}
                <a href="mailto:info@rmgreatdane.org" className="text-teal-600 hover:text-teal-700 font-semibold">
                  info@rmgreatdane.org
                </a>{' '}
                to be added to our Utah events email list. We send reminders a week before each event.
              </p>
            </div>
          </div>
        </section>

        {/* Event Guidelines */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Event Participation Guidelines</h2>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
            <p className="text-gray-700 mb-4">
              <strong>For everyone&apos;s safety and enjoyment, please follow these guidelines:</strong>
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-amber-600 text-xl flex-shrink-0">✓</span>
                <span><strong>Vaccinations:</strong> Dogs must be current on rabies, distemper, and bordetella</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 text-xl flex-shrink-0">✓</span>
                <span><strong>Dog-Friendly Only:</strong> Dogs must be friendly with other dogs and people</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 text-xl flex-shrink-0">✓</span>
                <span><strong>Supervision:</strong> Keep your dog under control at all times, even during off-leash play</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 text-xl flex-shrink-0">✓</span>
                <span><strong>Clean Up:</strong> Always pick up after your dog</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 text-xl flex-shrink-0">✓</span>
                <span><strong>Females in Heat:</strong> Please do not bring females in heat to group events</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 text-xl flex-shrink-0">✓</span>
                <span><strong>Aggressive Behavior:</strong> If your dog shows aggression, please remove them from the event</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 text-xl flex-shrink-0">✓</span>
                <span><strong>Liability:</strong> Owners are responsible for their dog&apos;s behavior and any incidents</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Volunteer Opportunities */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Volunteer at Events</h2>
          <p className="text-gray-700 mb-4">
            We always need volunteers to help with events! Volunteer opportunities include:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-teal-50 p-4 rounded-lg">
              <ul className="space-y-2 text-gray-700">
                <li>• Event setup and breakdown</li>
                <li>• Registration tables</li>
                <li>• Monitoring dog play</li>
                <li>• Taking photos</li>
              </ul>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg">
              <ul className="space-y-2 text-gray-700">
                <li>• Answering adoption questions</li>
                <li>• Merchandise sales</li>
                <li>• Sharing information about fostering</li>
                <li>• Social media posting</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-700 mt-4">
            Contact us at{' '}
            <a href="mailto:info@rmgreatdane.org" className="text-teal-600 hover:text-teal-700 font-semibold">
              info@rmgreatdane.org
            </a>{' '}
            if you&apos;d like to volunteer at an upcoming event.
          </p>
        </section>

        {/* Other States */}
        <section className="mb-12">
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Events in Other States?</h3>
            <p className="text-gray-700">
              While most of our organized events are in Utah, we occasionally host gatherings in Colorado and other states in our service area. If you&apos;re interested in organizing a Great Dane meetup in your area, or want to know if we have events planned in your state, please contact us!
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 text-white p-8 rounded-xl text-center">
          <h3 className="text-2xl font-bold mb-4">Join Us at the Next Event!</h3>
          <p className="text-lg mb-6 text-gray-300">
            Follow us on Facebook for event announcements and updates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.facebook.com/rmgdri"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Follow on Facebook
            </a>
            <a
              href="mailto:info@rmgreatdane.org?subject=Utah%20Events"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Email About Events
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
