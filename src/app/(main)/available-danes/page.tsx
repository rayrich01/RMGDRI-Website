import Link from 'next/link'
import { client } from '../../../sanity/lib/client'

export const metadata = {
  title: 'Available Danes | RMGDRI',
  description: 'Meet our Great Danes available for adoption. Find your new best friend today.',
}

async function getDogs() {
  return client.fetch(`
    *[_type == "dog" && status in ["available", "pending", "foster-needed", "waiting-transport", "under-evaluation", "medical-hold", "behavior-hold"]] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      breed,
      age,
      sex,
      color,
      status,
      location,
      description,
      mainImage {
        asset-> {
          url
        }
      }
    }
  `)
}

export default async function AvailableDanesPage() {
  const dogs = await getDogs()

  // Get current date for "Updated on" display
  const today = new Date().toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <main className="pb-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 pt-12">
        {/* Hero Section */}
        <h1 className="text-5xl font-bold text-center mb-4 text-gray-900">Adopt a Great Dane</h1>
        <p className="text-xl text-gray-700 text-center mb-2">
          Meet our Great Danes Available for Adoption
        </p>
        <p className="text-gray-600 text-center mb-2">
          For more information on a Dane, click on the photo or name.
        </p>
        <p className="text-sm text-gray-500 text-center mb-8">
          Updated on: {today}
        </p>

        {/* Status Legend */}
        <div className="bg-gray-50 rounded-xl p-6 mb-10">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Status Definitions</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start">
              <span className="font-bold text-teal-600 w-12 flex-shrink-0">FN</span>
              <p className="text-gray-700">
                <strong>Foster Needed</strong> – We are looking for a{' '}
                <Link href="/foster-a-great-dane" className="text-teal-600 hover:underline">foster</Link> or{' '}
                <Link href="/foster-application" className="text-teal-600 hover:underline">foster-to-adopt*</Link>{' '}
                home so that we can bring this Dane into rescue.
              </p>
            </div>
            <div className="flex items-start">
              <span className="font-bold text-teal-600 w-12 flex-shrink-0">WT</span>
              <p className="text-gray-700">
                <strong>Waiting Transport</strong> – Foster family located and coming into rescue. Transportation in progress.
              </p>
            </div>
            <div className="flex items-start">
              <span className="font-bold text-teal-600 w-12 flex-shrink-0">UE</span>
              <p className="text-gray-700">
                <strong>Under Evaluation</strong> – The Dane has just come into rescue and we are evaluating them.
                They remain in this state until we have the Rescue About Profile (RAP).
                Approved families can be added to their waiting list.
              </p>
            </div>
            <div className="flex items-start">
              <span className="font-bold text-teal-600 w-12 flex-shrink-0">BH</span>
              <p className="text-gray-700">
                <strong>Behavior Hold</strong> – Dane is in need of a behavioral evaluation.
                Will not be available for adoption until evaluation is complete.
              </p>
            </div>
            <div className="flex items-start">
              <span className="font-bold text-teal-600 w-12 flex-shrink-0">MH</span>
              <p className="text-gray-700">
                <strong>Medical Hold</strong> – Dane is in need of medical care, or recovering from surgery or other medical issues.
              </p>
            </div>
            <div className="flex items-start">
              <span className="font-bold text-teal-600 w-12 flex-shrink-0">A</span>
              <p className="text-gray-700">
                <strong>Available</strong> – We have the RAP and the Dane is available for adoption.
                The Dane is in need of a forever home.
              </p>
            </div>
            <div className="flex items-start md:col-span-2">
              <span className="font-bold text-teal-600 w-12 flex-shrink-0">PA</span>
              <p className="text-gray-700">
                <strong>Pending Adoption</strong> – There is a family adopting the Dane.
                We may still need a follow-up vet visit and/or are waiting on the adoption paperwork.
              </p>
            </div>
          </div>
        </div>

        {/* Application Encouragement */}
        <div className="bg-teal-50 border-l-4 border-teal-500 p-6 mb-10">
          <p className="text-gray-700">
            We encourage all families to complete the foster / adoption application process.
            The application is <strong>not dog specific</strong>. Approved homes can reach out at any time
            if a Dane may be a fit for the home.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link
              href="/adoption-application"
              className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Adoption Application
            </Link>
            <Link
              href="/foster-application"
              className="bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              Foster Application
            </Link>
          </div>
        </div>

        {/* Dog Grid */}
        {dogs.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <span className="text-6xl block mb-4">🐕</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Dogs Currently Listed</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Check back soon or follow us on Facebook for updates on new dogs coming into rescue.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6 text-center">
              Click on a photo or name to view the Dane&apos;s full profile.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dogs.map((dog: any) => (
                <DogCard key={dog._id} dog={dog} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

function DogCard({ dog }: { dog: any }) {
  const statusLabels: Record<string, { label: string; color: string }> = {
    'available': { label: 'A', color: 'bg-green-500' },
    'pending': { label: 'PA', color: 'bg-yellow-500' },
    'foster-needed': { label: 'FN', color: 'bg-purple-500' },
    'waiting-transport': { label: 'WT', color: 'bg-blue-500' },
    'under-evaluation': { label: 'UE', color: 'bg-orange-500' },
    'medical-hold': { label: 'MH', color: 'bg-red-500' },
    'behavior-hold': { label: 'BH', color: 'bg-red-600' },
  }

  const status = statusLabels[dog.status] || { label: '?', color: 'bg-gray-500' }

  return (
    <Link
      href={`/available-danes/${dog.slug || dog._id}`}
      className="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-teal-500 hover:shadow-lg transition-all"
    >
      {/* Image */}
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {dog.mainImage?.asset?.url ? (
          <img
            src={dog.mainImage.asset.url}
            alt={dog.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
            🐕
          </div>
        )}
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 ${status.color} text-white px-2 py-1 rounded font-bold text-sm`}>
          {status.label}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
          {dog.name}
        </h3>
        <p className="text-gray-600 text-sm">
          {[dog.age, dog.sex, dog.color].filter(Boolean).join(' • ')}
        </p>
        {dog.location && (
          <p className="text-gray-500 text-sm mt-1">📍 {dog.location}</p>
        )}
      </div>
    </Link>
  )
}
