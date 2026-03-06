/**
 * GROQ queries for Sanity
 */

// Dog queries
export const dogsQuery = `*[_type == "dog" && status == "available" && hideFromWebsite != true] | order(intakeDate desc) {
  _id,
  name,
  "slug": slug.current,
  status,
  breed,
  age,
  gender,
  shortDescription,
  photos[0],
  goodWith,
  featured
}`;

export const featuredDogsQuery = `*[_type == "dog" && featured == true && status == "available" && hideFromWebsite != true][0...3] {
  _id,
  name,
  "slug": slug.current,
  status,
  breed,
  age,
  gender,
  shortDescription,
  photos[0],
  goodWith
}`;

export const dogBySlugQuery = `*[_type == "dog" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  status,
  featured,
  breed,
  age,
  gender,
  size,
  weight,
  color,
  shortDescription,
  description,
  goodWith,
  health,
  adoptionFee,
  intakeDate,
  adoptedDate,
  photos[] {
    ...,
    "url": asset->url,
    "dimensions": asset->metadata.dimensions
  },
  seo
}`;

export const dogsWithFiltersQuery = `*[_type == "dog"
  && status in $statuses
  && ($breed == null || breed == $breed)
  && ($gender == null || gender == $gender)
  && hideFromWebsite != true
] | order(intakeDate desc) {
  _id,
  name,
  "slug": slug.current,
  status,
  breed,
  age,
  gender,
  shortDescription,
  photos[0],
  goodWith,
  featured
}`;

// Success stories queries
export const successesQuery = `*[_type == "success"] | order(adoptionDate desc) {
  _id,
  dogName,
  adopterName,
  adoptionDate,
  year,
  testimonial,
  photo,
  featured
}`;

export const successesByYearQuery = `*[_type == "success" && year == $year] | order(adoptionDate desc) {
  _id,
  dogName,
  adopterName,
  adoptionDate,
  testimonial,
  photo
}`;

export const successYearsQuery = `array::unique(*[_type == "success"].year) | order(@ desc)`;

// Page queries
export const pageBySlugQuery = `*[_type == "page" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  content,
  seo
}`;

// Site settings
export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  siteName,
  tagline,
  description,
  contact,
  social,
  heroTitle,
  heroSubtitle,
  heroImage,
  heroCTA,
  stats,
  footerText,
  defaultSEO
}`;

// Team members
export const teamMembersQuery = `*[_type == "teamMember"] | order(order asc) {
  _id,
  name,
  role,
  bio,
  photo,
  email
}`;

// Blog posts
export const blogPostsQuery = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  featuredImage,
  publishedAt,
  categories
}`;

export const blogPostBySlugQuery = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  content,
  featuredImage,
  publishedAt,
  author->,
  categories,
  seo
}`;

// Statistics
export const statsQuery = `{
  "adoptions2025": count(*[_type == "success" && year == 2025]),
  "adoptions2024": count(*[_type == "success" && year == 2024]),
  "adoptionsSince2000": count(*[_type == "success"]),
  "availableDogs": count(*[_type == "dog" && status == "available" && hideFromWebsite != true])
}`;
