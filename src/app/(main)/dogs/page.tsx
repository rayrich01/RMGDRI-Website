import Link from "next/link";
import { sanityFetch } from "@/lib/sanity/client";

type DogListItem = {
  _id: string;
  name: string;
  slug: string;
  status?: string;
};

const DOGS_LIST_QUERY = `*[_type == "dog" && defined(slug.current)]
| order(name asc) {
  _id,
  name,
  "slug": slug.current,
  status
}`;

export default async function DogsIndexPage() {
  const dogs = await sanityFetch<DogListItem[]>(
    DOGS_LIST_QUERY,
    {},
    { revalidate: 60 }
  );

  return (
    <main style={{ padding: 24 }}>
      <h1>Dogs</h1>

      {dogs?.length ? (
        <ul style={{ marginTop: 16 }}>
          {dogs.map((d) => (
            <li key={d._id} style={{ marginBottom: 8 }}>
              <Link href={`/dogs/${d.slug}`}>{d.name}</Link>
              {d.status ? <span> — {d.status}</span> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ marginTop: 16 }}>No dogs found.</p>
      )}
    </main>
  );
}
