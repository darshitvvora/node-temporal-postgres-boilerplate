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
  [key: string]: any; // Index signature for InjectedSink compatibility

  constructor(private defaultMeta: Record<string, unknown> = {}) {}

  trace(message: string, attrs: Record<string, unknown> = {}): void {
    logger.debug(message, { ...this.defaultMeta, ...attrs, temporalLevel: 'TRACE' });
  }

  debug(message: string, attrs: Record<string, unknown> = {}): void {
    logger.debug(message, { ...this.defaultMeta, ...attrs });
  }

  info(message: string, attrs: Record<string, unknown> = {}): void {
    logger.info(message, { ...this.defaultMeta, ...attrs });
  }

  warn(message: string, attrs: Record<string, unknown> = {}): void {
    logger.warn(message, { ...this.defaultMeta, ...attrs });
  }

  error(message: string, attrs: Record<string, unknown> = {}): void {
    logger.error(message, { ...this.defaultMeta, ...attrs });
  }

  /**
   * Create a child logger with additional default metadata
   */
  child(childMeta: Record<string, unknown> = {}): WinstonTemporalLogger {
    return new WinstonTemporalLogger({
      ...this.defaultMeta,
      ...childMeta,
    });
  }
}

/**
 * Factory function to create a Temporal-compatible logger
 */
export function createTemporalLogger(meta: Record<string, unknown> = {}): WinstonTemporalLogger {
  return new WinstonTemporalLogger(meta);
}

export default createTemporalLogger;
