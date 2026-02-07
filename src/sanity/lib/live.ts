// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export const { sanityFetch, SanityLive } = defineLive({
  client,
});
