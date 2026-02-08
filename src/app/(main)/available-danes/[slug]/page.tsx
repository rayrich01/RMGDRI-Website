import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/lib/sanity/client";

type Dog = {
  _id: string;
  name?: string;
  slug: string;
  status?: string;
  sex?: string;
  age?: string;
  breed?: string;
  color?: string;
  weight?: number;
  ears?: string;
  featured?: boolean;
  location?: string;
  shortDescription?: string;
  description?: string;
  goodWith?: string[];
  spayedNeutered?: boolean;
  vaccinated?: boolean;
  microchipped?: boolean;
  medicalNotes?: string;
  specialNeeds?: string;
  mainImage?: {
    asset?: {
      url?: string;
    };
  };
};

const DOG_QUERY = /* groq */ `*[_type == "dog" && slug.current == $slug][0]{
  _id,
  name,
  "slug": slug.current,
  status,
  sex,
  age,
  breed,
  color,
  weight,
  ears,
  featured,
  location,
  shortDescription,
  description,
  goodWith,
  spayedNeutered,
  vaccinated,
  microchipped,
  medicalNotes,
  specialNeeds,
  mainImage {
    asset-> {
      url
    }
  }
}`;

export default async function DogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const dog = await sanityFetch<Dog | null>(DOG_QUERY, { slug }, { revalidate: 60 });

  if (!dog) notFound();

  const statusLabels: Record<string, string> = {
    'available': 'Available',
    'pending': 'Pending Adoption',
    'foster-needed': 'Foster Needed',
    'waiting-transport': 'Waiting Transport',
    'under-evaluation': 'Under Evaluation',
    'medical-hold': 'Medical Hold',
    'behavior-hold': 'Behavior Hold',
    'adopted': 'Adopted',
    'rainbow-bridge': 'Rainbow Bridge',
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/available-danes"
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Back to Available Danes
          </Link>
        </div>

        {/* Header with Image */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Hero Image */}
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
            {dog.mainImage?.asset?.url ? (
              <Image
                src={dog.mainImage.asset.url}
                alt={dog.name || "Dog photo"}
                fill
                className="object-contain"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-9xl text-gray-300">
                🐕
              </div>
            )}
          </div>

          {/* Basic Info Card */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet {dog.name ?? "This Dog"}
            </h1>

            {/* Status Badge */}
            <div className="mb-6">
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                  dog.status === "available"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                Status: {statusLabels[dog.status || ''] || dog.status || 'Unknown'}
              </span>
              {dog.featured && (
                <span className="ml-2 inline-block px-4 py-2 rounded-full text-sm font-bold bg-yellow-400 text-gray-900">
                  NEW!
                </span>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              {dog.sex && (
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Sex:</span>
                  <span className="text-gray-900 capitalize">{dog.sex}</span>
                </div>
              )}
              {dog.age && (
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Age:</span>
                  <span className="text-gray-900">{dog.age}</span>
                </div>
              )}
              {dog.ears && (
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Ears:</span>
                  <span className="text-gray-900 capitalize">{dog.ears}</span>
                </div>
              )}
              {dog.color && (
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Color:</span>
                  <span className="text-gray-900">{dog.color}</span>
                </div>
              )}
              {dog.weight && (
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Weight:</span>
                  <span className="text-gray-900">{dog.weight} lbs</span>
                </div>
              )}
              {dog.location && (
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Location:</span>
                  <span className="text-gray-900">📍 {dog.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Short Description */}
        {dog.shortDescription && (
          <div className="mb-8 p-6 bg-teal-50 rounded-xl border-l-4 border-teal-500">
            <p className="text-xl text-gray-800 leading-relaxed italic">
              {dog.shortDescription}
            </p>
          </div>
        )}

        {/* Full Description */}
        {dog.description && (
          <div className="mb-8">
            <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line">
              {dog.description}
            </div>
          </div>
        )}

        {/* Good With */}
        {dog.goodWith && dog.goodWith.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ Good With</h2>
            <div className="flex flex-wrap gap-3">
              {dog.goodWith.includes('kids') && (
                <span className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium">
                  👶 Kids
                </span>
              )}
              {dog.goodWith.includes('dogs') && (
                <span className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium">
                  🐕 Dogs
                </span>
              )}
              {dog.goodWith.includes('cats') && (
                <span className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium">
                  🐱 Cats
                </span>
              )}
            </div>
          </div>
        )}

        {/* Health Info */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🏥 Health Information</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {dog.spayedNeutered && (
              <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                ✓ Spayed/Neutered
              </span>
            )}
            {dog.vaccinated && (
              <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                ✓ Vaccinated
              </span>
            )}
            {dog.microchipped && (
              <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                ✓ Microchipped
              </span>
            )}
          </div>

          {dog.medicalNotes && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="font-semibold text-blue-900 mb-1">Medical Notes:</p>
              <p className="text-blue-800">{dog.medicalNotes}</p>
            </div>
          )}

          {dog.specialNeeds && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mt-4">
              <p className="font-semibold text-yellow-900 mb-1">Special Needs:</p>
              <p className="text-yellow-800">{dog.specialNeeds}</p>
            </div>
          )}
        </div>

        {/* CTA */}
        {dog.status === "available" && (
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-3">
              💚 Interested in {dog.name}?
            </h3>
            <p className="text-white/90 mb-6 text-lg">
              Apply to foster or foster-to-adopt {dog.name} today—and help this sweet pup start their next chapter!
            </p>
            <p className="text-white/90 mb-6">
              If you would like to adopt or foster-to-adopt {dog.name}, submit your application on our website.
              If you are already an approved family, reach out to us at{' '}
              <a href="mailto:placements@rmgreatdane.org" className="underline font-semibold">
                placements@rmgreatdane.org
              </a>
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/adoption-application"
                className="inline-block bg-white text-teal-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Start an Application
              </Link>
              <Link
                href="/foster-application"
                className="inline-block bg-teal-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-800 transition-colors"
              >
                Foster Application
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
