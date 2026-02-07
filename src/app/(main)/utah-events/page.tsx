import { client } from '@/lib/sanity/client'
import { PortableText } from '@portabletext/react'

export const metadata = {
  title: 'Events | RMGDRI',
  description: 'Great Dane rescue events, meetups, and adoption events.',
}

async function getEvents() {
  return client.fetch(`
    *[_type == "event" && isActive == true] | order(startDate asc) {
      _id,
      title,
      "slug": slug.current,
      eventType,
      region,
      startDate,
      endDate,
      location,
      address,
      description,
      image {
        asset-> {
          url
        }
      },
      registrationLink,
      facebookEventUrl,
      isFeatured
    }
  `)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

const eventTypeEmoji: Record<string, string> = {
  adoption: '🐾',
  meetup: '🎉',
  fundraiser: '💰',
  educational: '📚',
  other: '🎪',
}

export default async function EventsPage() {
  const events = await getEvents()

  const now = new Date()
  const upcomingEvents = events.filter((e: any) => new Date(e.startDate) >= now)
  const pastEvents = events.filter((e: any) => new Date(e.startDate) < now)

  return (
    <main className="pb-20 bg-white">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        <h1 className="text-5xl font-bold text-center mb-8 text-gray-900">Events</h1>

        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-xl text-gray-700 leading-relaxed">
            Join us at upcoming events! Meet adoptable Great Danes, connect with other
            Dane lovers, and support Rocky Mountain Great Dane Rescue.
          </p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Upcoming Events</h2>

          {upcomingEvents.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <span className="text-6xl block mb-4">📅</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Events Coming Soon</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We&apos;re planning exciting events. Check back soon or follow us
                on Facebook for the latest announcements!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {upcomingEvents.map((event: any) => (
                <div
                  key={event._id}
                  className={`bg-white border-2 rounded-xl p-6 hover:border-teal-500 transition-colors ${
                    event.isFeatured ? 'border-teal-500 ring-2 ring-teal-100' : 'border-gray-200'
                  }`}
                >
                  {event.isFeatured && (
                    <span className="inline-block bg-teal-100 text-teal-700 text-xs font-semibold px-2 py-1 rounded mb-3">
                      ⭐ Featured Event
                    </span>
                  )}

                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Date Badge */}
                    <div className="flex-shrink-0 bg-teal-50 rounded-lg p-4 text-center min-w-24">
                      <div className="text-3xl font-bold text-teal-600">
                        {new Date(event.startDate).getDate()}
                      </div>
                      <div className="text-sm text-teal-700 font-medium">
                        {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatTime(event.startDate)}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{eventTypeEmoji[event.eventType] || '📅'}</span>
                        <span className="text-sm text-gray-500 capitalize">{event.eventType}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500 capitalize">{event.region?.replace('-', ' ')}</span>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>

                      {event.location && (
                        <p className="text-gray-700 mb-1">
                          📍 {event.location}
                        </p>
                      )}
                      {event.address && (
                        <p className="text-gray-500 text-sm mb-3">{event.address}</p>
                      )}

                      {event.description && (
                        <div className="text-gray-600 prose prose-sm max-w-none mb-4">
                          <PortableText value={event.description} />
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3">
                        {event.registrationLink && (
                          <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-sm"
                          >
                            Register / RSVP
                          </a>
                        )}
                        {event.facebookEventUrl && (
                          <a
                            href={event.facebookEventUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                          >
                            Facebook Event
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-500">Past Events</h2>
            <div className="space-y-4 opacity-75">
              {pastEvents.slice(0, 5).map((event: any) => (
                <div key={event._id} className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                  <div className="text-2xl">{eventTypeEmoji[event.eventType] || '📅'}</div>
                  <div>
                    <h3 className="font-semibold text-gray-700">{event.title}</h3>
                    <p className="text-sm text-gray-500">{formatDate(event.startDate)} • {event.region}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Stay Connected */}
        <div className="bg-gray-900 text-white p-10 rounded-lg text-center mt-12">
          <h2 className="text-3xl font-bold mb-4">Stay Updated on Events</h2>
          <p className="text-lg mb-6 text-gray-300 max-w-2xl mx-auto">
            Follow us on Facebook for the latest event announcements, photos, and updates.
          </p>
          <a
            href="https://www.facebook.com/rmgdri"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Follow on Facebook
          </a>
        </div>
      </div>
    </main>
  )
}
