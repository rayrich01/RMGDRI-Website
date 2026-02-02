'use client';

import Image from 'next/image';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { urlForImage } from '@/lib/sanity/image';

/**
 * SanityDogImage Component
 *
 * Alt-text-safe image component for RMGDRI dog photos.
 *
 * SAFETY GUARANTEES:
 * - Alt text is REQUIRED at type level (TypeScript will error if missing)
 * - Runtime fallback to safe default if alt somehow missing
 * - Development warnings if alt text is missing at runtime
 * - Visual indicator in dev mode if image needs review
 *
 * USAGE:
 *   import SanityDogImage from '@/components/media/SanityDogImage'
 *
 *   <SanityDogImage
 *     image={{
 *       asset: dogData.heroImage.asset,
 *       alt: dogData.heroImage.alt,
 *       caption: dogData.heroImage.caption,
 *       needsReview: dogData.heroImage.needsReview
 *     }}
 *     width={800}
 *     height={600}
 *     priority={true}
 *   />
 *
 * GOVERNANCE COMPLIANCE:
 * - Gate C (Render Gate): Enforces alt text at type level
 * - WCAG 2.1 Level AA compliant
 * - Fail-closed: Never renders without alt text
 */

interface DogImageProps {
  image: {
    asset: SanityImageSource;
    alt: string; // ← REQUIRED at type level
    caption?: string;
    needsReview?: boolean;
    reviewReasons?: string[];
  };
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export default function SanityDogImage({
  image,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  sizes,
  quality = 85,
}: DogImageProps) {
  // Runtime safety check (should never happen with proper typing)
  // This is a fail-safe in case of type casting or API inconsistencies
  const altText = image.alt || 'Great Dane rescue dog';

  // Development-only warning
  if (!image.alt && process.env.NODE_ENV === 'development') {
    console.warn(
      'SanityDogImage: Missing alt text at runtime. This should not happen!',
      {
        imageAsset: image.asset,
        needsReview: image.needsReview,
        reviewReasons: image.reviewReasons,
      }
    );
  }

  // Generate optimized image URL
  const imageUrl = urlForImage(image.asset)
    .width(width)
    .height(height)
    .quality(quality)
    .fit('max')
    .auto('format')
    .url();

  return (
    <figure className={`relative ${className}`}>
      <Image
        src={imageUrl}
        alt={altText}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className="rounded-lg object-cover"
      />

      {/* Caption (optional) */}
      {image.caption && (
        <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {image.caption}
        </figcaption>
      )}

      {/* Development-only review indicator */}
      {image.needsReview && process.env.NODE_ENV === 'development' && (
        <div className="absolute left-0 top-0 bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800 shadow-md">
          ⚠️ Needs Review
          {image.reviewReasons && image.reviewReasons.length > 0 && (
            <div className="mt-1 text-xs font-normal">
              {image.reviewReasons.join(', ')}
            </div>
          )}
        </div>
      )}
    </figure>
  );
}

/**
 * Variant: SanityDogImageBackground
 *
 * Background image variant for hero sections.
 * Still enforces alt text for screen readers via aria-label.
 */

interface DogImageBackgroundProps {
  image: {
    asset: SanityImageSource;
    alt: string; // ← REQUIRED
    caption?: string;
  };
  className?: string;
  children?: React.ReactNode;
}

export function SanityDogImageBackground({
  image,
  className = '',
  children,
}: DogImageBackgroundProps) {
  const altText = image.alt || 'Great Dane rescue dog';

  const imageUrl = urlForImage(image.asset)
    .width(1920)
    .height(1080)
    .quality(85)
    .fit('max')
    .auto('format')
    .url();

  return (
    <div
      className={`relative bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${imageUrl})` }}
      role="img"
      aria-label={altText}
    >
      {children}
    </div>
  );
}
