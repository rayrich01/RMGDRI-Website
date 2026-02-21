/**
 * Cloudflare R2 Client Configuration
 *
 * R2 is S3-compatible, so we use the AWS SDK
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * R2 configuration from environment variables
 */
const R2_CONFIG = {
  accountId: process.env.R2_ACCOUNT_ID!,
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  bucketName: process.env.R2_BUCKET_NAME || 'rmgdri',
  publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
};

/**
 * S3 client configured for R2
 */
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_CONFIG.accessKeyId,
    secretAccessKey: R2_CONFIG.secretAccessKey,
  },
});

/**
 * Upload a file to R2
 */
export async function uploadToR2(
  key: string,
  body: Buffer | Blob | ReadableStream,
  options: {
    contentType?: string;
    metadata?: Record<string, string>;
  } = {}
): Promise<{ key: string; url: string }> {
  const command = new PutObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: key,
    Body: body as any,
    ContentType: options.contentType,
    Metadata: options.metadata,
  });

  await r2Client.send(command);

  return {
    key,
    url: getPublicUrl(key),
  };
}

/**
 * Delete a file from R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: key,
  });

  await r2Client.send(command);
}

/**
 * Get a pre-signed URL for uploading (useful for client-side uploads)
 */
export async function getUploadUrl(
  key: string,
  options: {
    contentType?: string;
    expiresIn?: number; // seconds
  } = {}
): Promise<string> {
  const { contentType, expiresIn = 3600 } = options;

  const command = new PutObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Get a pre-signed URL for downloading (for private objects)
 */
export async function getDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Get the public URL for a file
 */
export function getPublicUrl(key: string): string {
  if (R2_CONFIG.publicUrl) {
    return `${R2_CONFIG.publicUrl}/${key}`;
  }
  // Fallback to R2 default URL (requires public access enabled)
  return `https://${R2_CONFIG.bucketName}.${R2_CONFIG.accountId}.r2.cloudflarestorage.com/${key}`;
}

/**
 * Generate a unique key for an upload
 */
export function generateKey(
  folder: string,
  filename: string,
  options: { prefix?: string } = {}
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = filename.split('.').pop();
  const baseName = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-');

  const prefix = options.prefix ? `${options.prefix}-` : '';

  return `${folder}/${prefix}${baseName}-${timestamp}-${random}.${ext}`;
}

/**
 * Organize files into folders by type
 */
export const R2_FOLDERS = {
  dogs: 'dogs',           // Dog photos
  pages: 'pages',         // Page images
  blog: 'blog',           // Blog post images
  documents: 'documents', // PDFs, forms, etc.
  backups: 'backups',     // Database backups
  temp: 'temp',           // Temporary uploads
} as const;
