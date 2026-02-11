import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Resolve Sanity env safely.
 * Vercel Preview builds may not have these configured yet.
 */
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  '';

const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  'production';

const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_API_VERSION ||
  '2024-01-01';

const baseConfig = projectId
  ? {
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === 'production',
    }
  : null;

/**
 * Typed stub client to prevent build-time crashes when Sanity isn't configured.
 * It preserves generics like client.fetch<Dog[]>() across the app.
 */
const stubClient = {
  fetch: async (query: unknown) => {
    // Heuristic:
    // - GROQ singletons typically use [0] to pick first doc
    // - list queries should return [] so pages don't crash on .length/.map
    if (typeof query === 'string' && query.includes('[0]')) return null;
    return [];
  },
} as unknown as SanityClient;


/**
 * Public client for fetching data.
 * If projectId is missing, this becomes a typed stub (no crash).
 */
export const sanityClient: SanityClient = baseConfig ? createClient(baseConfig) : stubClient;

/**
 * Alias for backward compatibility.
 */
export const client: SanityClient = sanityClient;

/**
 * Authenticated client for mutations (server-side only).
 * If projectId is missing or token absent, use stub (no crash).
 */
export const sanityWriteClient: SanityClient =
  baseConfig && process.env.SANITY_API_TOKEN
    ? createClient({
        ...baseConfig,
        token: process.env.SANITY_API_TOKEN,
        useCdn: false,
      })
    : stubClient;

/**
 * Image URL builder (only valid when Sanity is configured)
 */
const builder = baseConfig ? imageUrlBuilder(sanityClient) : null;

/**
 * Generate optimized image URLs (fail-soft when missing config)
 */
export function urlFor(source: SanityImageSource) {
  if (!builder) {
    return { url: () => '' } as any;
  }
  return builder.image(source);
}

/**
 * Helper to get image URL with default transformations (fail-soft)
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
  if (!builder) return '';

  const { width, height, quality = 80, format = 'webp' } = options;

  let url = builder.image(source).auto('format').quality(quality);

  if (width) url = url.width(width);
  if (height) url = url.height(height);
  if (format) url = url.format(format);

  return url.url();
}

/**
 * Fetch data with error handling.
 * NOTE: If Sanity isn't configured, returns null to keep Preview builds green.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: { revalidate?: number } = {}
): Promise<T> {
  const { revalidate = 60 } = options;

  if (!baseConfig) {
    return null as unknown as T;
  }

  try {
    return await sanityClient.fetch<T>(query, params, {
      next: { revalidate },
    });
  } catch (error) {
    console.error('Sanity fetch error:', error);
    throw error;
  }
}
