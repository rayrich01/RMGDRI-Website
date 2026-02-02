import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanityClient } from './client';

/**
 * Sanity Image URL Builder
 *
 * Helper to generate optimized image URLs from Sanity assets.
 * This is a simple wrapper for use in the SanityDogImage component.
 *
 * Usage:
 *   import { urlForImage } from '@/lib/sanity/image'
 *   const url = urlForImage(asset).width(800).height(600).url()
 *
 * Note: This exists alongside the urlFor function in client.ts.
 * Both work the same way - use whichever import is more convenient.
 */

const builder = imageUrlBuilder(sanityClient);

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}
