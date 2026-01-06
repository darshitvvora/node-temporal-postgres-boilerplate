/**
 * Temporal connection configuration loaded from environment variables.
 * Supports `self-hosted` and `cloud` (Temporal Cloud) modes.
 */

// 'self-hosted' or 'cloud'
export const MODE = (process.env.TEMPORAL_MODE || 'self-hosted').toLowerCase();

// address for self-hosted (host:port) or cloud endpoint (host:port or URL)
export const ADDRESS = process.env.TEMPORAL_ADDRESS || '127.0.0.1:7233';

// namespace to use (default 'default')
export const NAMESPACE = process.env.TEMPORAL_NAMESPACE || 'default';

// If true, enable TLS (for self-hosted or cloud)
export const TLS = (process.env.TEMPORAL_TLS || 'false').toLowerCase() === 'true';

// Cloud-specific secrets (if using Temporal Cloud)
export const CLOUD_API_KEY = process.env.TEMPORAL_CLOUD_API_KEY || process.env.TEMPORAL_API_KEY || null;

// Path to root CA cert (optional)
export const TLS_ROOT_CA_PATH = process.env.TEMPORAL_TLS_ROOT_CA_PATH || null;

// Optional override for task queue used by default workers/clients
export const DEFAULT_TASK_QUEUE = process.env.TEMPORAL_DEFAULT_TASK_QUEUE || 'node-api-boilerplate';

export const defaultActivityTimeout = '5 minutes';
