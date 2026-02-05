import Link from "next/link";
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
  coatColor?: string;
  sizeCategory?: string;
  weight?: number;
  shortDescription?: string;
  description?: unknown;
  goodWith?: {
    kids?: boolean;
    dogs?: boolean;
    cats?: boolean;
    notes?: string;
  };
  health?: {
    spayedNeutered?: boolean;
    vaccinated?: boolean;
    microchipped?: boolean;
    heartwormTested?: boolean;
    specialNeeds?: string;
    medicalNotes?: string;
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
  coatColor,
  sizeCategory,
  weight,
  shortDescription,
  description,
  goodWith,
  health
}`;

export default async function DogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const dog = await sanityFetch<Dog | null>(DOG_QUERY, { slug }, { revalidate: 60 });

  if (!dog) notFound();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/dogs"
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Back to Dogs
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            {dog.name ?? "Unnamed Dog"}
          </h1>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              dog.status === "available"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {dog.status ?? "unknown"}
          </span>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {dog.sex && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Sex</p>
              <p className="font-semibold text-gray-900 capitalize">{dog.sex}</p>
            </div>
          )}
          {dog.age && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-semibold text-gray-900">{dog.age}</p>
            </div>
          )}
          {dog.coatColor && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Color</p>
              <p className="font-semibold text-gray-900 capitalize">{dog.coatColor}</p>
            </div>
          )}
          {dog.sizeCategory && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Size</p>
              <p className="font-semibold text-gray-900 capitalize">
                {dog.sizeCategory.replace("_", " ")}
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        {dog.shortDescription && (
          <div className="mb-6">
            <p className="text-xl text-gray-700">{dog.shortDescription}</p>
          </div>
        )}

        {/* Good With */}
        {dog.goodWith && (dog.goodWith.kids || dog.goodWith.dogs || dog.goodWith.cats) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Compatibility</h2>
            <div className="flex flex-wrap gap-3">
              {dog.goodWith.kids && (
                <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                  Good with kids
                </span>
              )}
              {dog.goodWith.dogs && (
                <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                  Good with dogs
                </span>
              )}
              {dog.goodWith.cats && (
                <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                  Good with cats
                </span>
              )}
            </div>
            {dog.goodWith.notes && (
              <p className="mt-4 text-gray-600">{dog.goodWith.notes}</p>
            )}
          </div>
        )}

        {/* Health */}
        {dog.health && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Health</h2>
            <div className="flex flex-wrap gap-3">
              {dog.health.spayedNeutered && (
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  Spayed/Neutered
                </span>
              )}
              {dog.health.vaccinated && (
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  Vaccinated
                </span>
              )}
              {dog.health.microchipped && (
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  Microchipped
                </span>
              )}
              {dog.health.heartwormTested && (
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  Heartworm Tested
                </span>
              )}
            </div>
            {dog.health.specialNeeds && (
              <div className="mt-4">
                <p className="font-medium text-gray-900">Special Needs:</p>
                <p className="text-gray-600">{dog.health.specialNeeds}</p>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        {dog.status === "available" && (
          <div className="bg-teal-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Interested in {dog.name}?
            </h3>
            <p className="text-gray-700 mb-4">
              Fill out an adoption application to start the process.
            </p>
            <Link
              href="/adopt-a-great-dane"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Apply to Adopt
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
