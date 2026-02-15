import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Get Sanity project ID with production-strict enforcement
 * - Production/Vercel builds: REQUIRE env var (fail fast if missing)
 * - Local dev: Allow fallback for convenience
 */
function getProjectId(): string {
  const envProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const isProduction = process.env.NODE_ENV === 'production';
  const isVercel = process.env.VERCEL === '1';

  // Production/Vercel: require explicit configuration
  if (isProduction || isVercel) {
    if (!envProjectId) {
      throw new Error(
        'NEXT_PUBLIC_SANITY_PROJECT_ID is required in production. ' +
        'Configure it in Vercel environment variables.'
      );
    }
    return envProjectId;
  }

  // Local dev: allow fallback for convenience
  return envProjectId || '17o8qiin';
}

/**
 * Sanity configuration
 */
const config = {
  projectId: getProjectId(),
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', // Use current date
  useCdn: process.env.NODE_ENV === 'production',
};

/**
 * Public client for fetching data
 */
export const sanityClient = createClient(config);

/**
 * Alias for backward compatibility
 */
export const client = sanityClient;

/**
 * Authenticated client for mutations (server-side only)
 */
export const sanityWriteClient = createClient({
  ...config,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

/**
 * Image URL builder
 */
const builder = imageUrlBuilder(sanityClient);

/**
 * Generate optimized image URLs
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Helper to get image URL with default transformations
 */
export function getImageUrl(
  source: SanityImageSource,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  } = {}
): string {
  const { width, height, quality = 80, format = 'webp' } = options;

  let url = builder.image(source).auto('format').quality(quality);

  if (width) url = url.width(width);
  if (height) url = url.height(height);
  if (format) url = url.format(format);

  return url.url();
}

/**
 * Fetch data with error handling
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: { revalidate?: number } = {}
): Promise<T> {
  const { revalidate = 60 } = options;

  try {
    return await sanityClient.fetch<T>(query, params, {
      next: { revalidate },
    });
  } catch (error) {
    console.error('Sanity fetch error:', error);
    throw error;
  }
}
