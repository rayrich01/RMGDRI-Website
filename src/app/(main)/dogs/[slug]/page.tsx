import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/lib/sanity/client";

type Dog = {
  _id: string;
  name?: string;
  slug: string;
  status?: string;
};

const DOG_QUERY = /* groq */ `*[_type == "dog" && slug.current == $slug][0]{
  _id,
  name,
  "slug": slug.current,
  status
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
        <div className="mb-6">
          <Link
            href="/dogs"
            className="font-semibold underline underline-offset-4 hover:opacity-80"
          >
            ← Back to Dogs
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {dog.name ?? "Unnamed Dog"}
        </h1>

        <div className="text-gray-700 space-y-2">
          <p>
            <span className="font-semibold">Slug:</span> {dog.slug}
          </p>
          <p>
            <span className="font-semibold">Status:</span> {dog.status ?? "unknown"}
          </p>
        </div>
      </div>
    </main>
  );
}
