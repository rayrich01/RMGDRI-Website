/**
 * Sanity Schema Index
 *
 * Export all schemas for registration with Sanity
 *
 * Modified for TP-RMGDRI-META-INGEST-01:
 * - Enhanced dog schema with idNumber, heroImage, gallery (dogImage type)
 * - Added dogImage object (alt-safe image type with provenance)
 * - Added successStory document
 */

// Document types
import { dog } from './dog';
import { successStory } from './successStory';
// import { page } from './documents/page';
// import { blogPost } from './documents/blogPost';
// import { teamMember } from './documents/teamMember';
// import { siteSettings } from './documents/siteSettings';

// Object types
import { blockContent } from './objects/blockContent';
import { dogImage } from './objects/dogImage';
// import { seo } from './objects/seo';

export const schemaTypes = [
  // Documents
  dog,
  successStory,
  // page,
  // blogPost,
  // teamMember,
  // siteSettings,

  // Objects
  blockContent,
  dogImage,
  // seo,
];
