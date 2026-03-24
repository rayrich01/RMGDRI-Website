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

/**
 * Sanity image field shape as returned by GROQ when projecting:
 *   mainImage { "assetRef": asset._ref, hotspot, crop }
 */
export type SanityImageField = {
  assetRef?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

/**
 * Generate a crop-aware image URL from a Sanity image field.
 *
 * Constructs a full image source object with hotspot+crop so that
 * @sanity/image-url calculates the correct `rect` parameter.
 * The Sanity CDN then serves a pre-cropped image matching the
 * requested dimensions — no additional CSS cropping needed.
 */
export function buildImageUrl(
  image: SanityImageField,
  opts: { width: number; height: number; quality?: number }
): string | null {
  if (!image?.assetRef) return null;

  const source: Record<string, unknown> = {
    asset: { _ref: image.assetRef },
  };
  if (image.hotspot) source.hotspot = image.hotspot;
  if (image.crop) source.crop = image.crop;

  return builder
    .image(source)
    .width(opts.width)
    .height(opts.height)
    .quality(opts.quality ?? 80)
    .fit('crop')
    .auto('format')
    .url();
}
