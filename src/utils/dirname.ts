import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Get __dirname equivalent in ES modules
 * @param importMetaUrl - import.meta.url from the calling module
 * @returns Directory name
 */
export function getDirname(importMetaUrl: string): string {
  return dirname(fileURLToPath(importMetaUrl));
}

/**
 * Get __filename equivalent in ES modules
 * @param importMetaUrl - import.meta.url from the calling module
 * @returns File name
 */
export function getFilename(importMetaUrl: string): string {
  return fileURLToPath(importMetaUrl);
}
