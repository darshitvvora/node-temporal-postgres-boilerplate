import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Get __dirname equivalent in ES modules
 * @param {string} importMetaUrl - import.meta.url from the calling module
 * @returns {string} Directory name
 */
export function getDirname(importMetaUrl) {
  return dirname(fileURLToPath(importMetaUrl));
}

/**
 * Get __filename equivalent in ES modules
 * @param {string} importMetaUrl - import.meta.url from the calling module
 * @returns {string} File name
 */
export function getFilename(importMetaUrl) {
  return fileURLToPath(importMetaUrl);
}
