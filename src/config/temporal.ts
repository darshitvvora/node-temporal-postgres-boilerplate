/**
 * Temporal connection helper for Cloud and self-hosted setups.
 * This file provides `getConnection()` and `getClient()` helpers.
 *
 * Note: This is a lightweight scaffold — it will throw a clear error
 * if `@temporalio/client` is not installed. Install with:
 *   npm install @temporalio/client @temporalio/worker --save --legacy-peer-deps
 */

import { Connection, Client, type ConnectionOptions } from '@temporalio/client';
import { ADDRESS, CLOUD_API_KEY, MODE, NAMESPACE, TLS } from './temporal.config.js';

/**
 * Create and return a Temporal Connection.
 * Returns a Promise resolving to a Connection instance from @temporalio/client.
 */
async function getConnection(): Promise<Connection> {
  const connectionOptions: ConnectionOptions = {
    address: ADDRESS,
  };

  if (TLS) {
    // If a root CA path was provided, load it (sdk accepts tls: { rootCACert } in some installers)
    // Keep it simple: pass tls=true so the client performs TLS. For custom certs users
    // can extend this function later to read file contents.
    connectionOptions.tls = true;
  }

  // For Temporal Cloud, users may need to set headers (e.g., Authorization)
  if (MODE === 'cloud' && CLOUD_API_KEY) {
    connectionOptions.metadata = {
      Authorization: `Bearer ${CLOUD_API_KEY}`,
    };
  }

  // Create and return connection
  return Connection.connect(connectionOptions);
}

/**
 * Create and return a Temporal Client bound to the configured namespace.
 */
async function getClient(): Promise<Client> {
  const connection = await getConnection();
  return new Client({ connection, namespace: NAMESPACE });
}

export default {
  getClient,
  getConnection,
};
