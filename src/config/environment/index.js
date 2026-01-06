import { join, normalize } from 'node:path';
import { config as dotenvConfig } from 'dotenv';
import { getDirname } from '../../utils/dirname.js';
import shared from './shared.js';

const __dirname = getDirname(import.meta.url);
const root = normalize(`${__dirname}/../../..`);

const envResult = dotenvConfig({ path: join(root, '.env') });
const env = envResult.parsed || {};
const { DOMAIN, PREFIX } = env;

const all = {
  env: env.NODE_ENV,
  root,
  port: process.env.PORT || 3302,
  ip: process.env.IP || '0.0.0.0',
  URLS_API: `${PREFIX}api.${DOMAIN}`,
};

const config = { ...all, ...env, ...(shared || {}) };

export default config;

// Named exports for commonly used values
export const NODE_ENV = config.NODE_ENV || process.env.NODE_ENV || 'development';
export const PG_DB = config.PG_DB;
export const PORT = config.PORT || all.port;
export const IP = config.IP || all.ip;
export const APP_NAME = config.APP_NAME || 'Node_API';
