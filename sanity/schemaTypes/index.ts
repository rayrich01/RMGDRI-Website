/**
 * Sanity Schema Index
 *
 * Export all schemas for registration with Sanity
 */

// Document types
import { dog } from './dog';
import { successStory } from './successStory';
import event from './event';
import page from './page';
import volunteerOpportunity from './volunteerOpportunity';
import { rescueIntakeControl } from './rescueIntakeControl';

// Object types
import { blockContent } from './objects/blockContent';
import { dogImage } from './objects/dogImage';

export const schemaTypes = [
  // Documents
  dog,
  successStory,
  event,
  page,
  volunteerOpportunity,
  rescueIntakeControl,

  // Objects
  blockContent,
  dogImage,
];
