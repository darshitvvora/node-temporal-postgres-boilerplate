/**
 * Temporal worker for `user` task queue.
 * Requires @temporalio/worker installed to run.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from '@temporalio/worker';
import { USER_QUEUE } from '../../config/environment/shared.js';
import * as activities from '../activities/user/activities.js';
import { createTemporalLogger } from '../../utils/temporal-logger.js';
import logger from '../../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runUserWorker(): Promise<void> {
  // Create Winston-backed logger for Temporal worker
  const temporalLogger = createTemporalLogger({
    component: 'temporal-worker',
    taskQueue: USER_QUEUE,
  });

  const worker = await Worker.create({
    workflowsPath: join(__dirname, '../workflows/user'),
    activities,
    taskQueue: USER_QUEUE,
    sinks: {
      // Custom sinks can be used to forward workflow logs to external systems
      logger: temporalLogger,
    },
  });

  logger.info(`Temporal worker starting on task queue: ${USER_QUEUE}`);
  await worker.run();
}

runUserWorker().catch((err) => {
  logger.error('User worker failed:', err);
  process.exit(1);
});
