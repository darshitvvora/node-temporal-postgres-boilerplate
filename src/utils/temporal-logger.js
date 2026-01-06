/**
 * Winston logger adapter for Temporal Worker.
 * This adapter bridges Temporal's logging interface with Winston.
 *
 * Note: This is for Worker/Activity logging only.
 * Workflows should use Temporal's native workflow.log from @temporalio/workflow
 */
import logger from './logger.js';

/**
 * Creates a Temporal-compatible logger sink that uses Winston
 * Implements the LoggerSinks interface expected by Temporal Worker
 */
export class WinstonTemporalLogger {
  constructor(defaultMeta = {}) {
    this.defaultMeta = defaultMeta;
  }

  trace(message, attrs = {}) {
    logger.debug(message, { ...this.defaultMeta, ...attrs, temporalLevel: 'TRACE' });
  }

  debug(message, attrs = {}) {
    logger.debug(message, { ...this.defaultMeta, ...attrs });
  }

  info(message, attrs = {}) {
    logger.info(message, { ...this.defaultMeta, ...attrs });
  }

  warn(message, attrs = {}) {
    logger.warn(message, { ...this.defaultMeta, ...attrs });
  }

  error(message, attrs = {}) {
    logger.error(message, { ...this.defaultMeta, ...attrs });
  }

  /**
   * Create a child logger with additional default metadata
   */
  child(childMeta = {}) {
    return new WinstonTemporalLogger({
      ...this.defaultMeta,
      ...childMeta,
    });
  }
}

/**
 * Factory function to create a Temporal-compatible logger
 */
export function createTemporalLogger(meta = {}) {
  return new WinstonTemporalLogger(meta);
}

export default createTemporalLogger;
