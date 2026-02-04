import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Rocky Mountain Great Dane Rescue
        </h1>

        <p className="text-lg text-gray-700 mb-8">
          Saving gentle giants since 2000. Adopt, foster, or donate to help Great Danes in Colorado
          and surrounding states.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dogs"
            className="inline-flex items-center rounded-lg bg-gray-900 px-5 py-3 text-white font-semibold hover:opacity-90"
          >
            Adopt a Dog →
          </Link>

          <Link
            href="/donate"
            className="inline-flex items-center rounded-lg border border-gray-300 px-5 py-3 text-gray-900 font-semibold hover:bg-gray-50"
          >
            Donate
          </Link>
        </div>
      </div>
    </main>
  );
}
