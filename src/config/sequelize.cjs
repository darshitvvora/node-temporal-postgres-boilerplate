const { existsSync } = require('node:fs');
const { join, resolve } = require('node:path');
const { config: _config } = require('dotenv');

const root = resolve(__dirname, '../..');
const envFile = join(root, '.env');

let config = {};
let env = {};

if (existsSync(envFile)) {
  env = _config({ path: envFile });
  config = env.parsed || {};
}

process.env.NODE_ENV = config.NODE_ENV || process.env.NODE_ENV || 'development';

const DEFAULT_PORT = 5432;
const dbUrl = config.PG_DB || 'postgres://postgres:postgres@localhost:5432/temporalapi';
const conn = new URL(dbUrl);
const username = conn.username || 'postgres';
const password = conn.password || 'postgres';

const host = conn.hostname || 'localhost';
const port = conn.port || DEFAULT_PORT;

const settings = {
  database: conn.pathname?.slice(1) || 'temporalapi',
  username,
  password,
  dialect: 'postgres',
  host: host || '127.0.0.1',
  port: port || DEFAULT_PORT,
  seederStorage: 'sequelize',
};

module.exports = {
  development: settings,
  test: settings,
  production: settings,
};
