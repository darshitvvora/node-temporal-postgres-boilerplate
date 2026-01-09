/**
 *  @fileOverview Provides logger support FS and console
 *  @module       Logger
 *  @author       Darshit Vora
 *  @requires     NPM:winston
 *  @requires     NPM.winston-daily-rotate-file
 */
import { join } from 'node:path';
import { transports as _transports, createLogger, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { NODE_ENV } from '../config/environment/index.js';

const transports: (DailyRotateFile | _transports.ConsoleTransportInstance)[] = [];

// Custom format for better readability
const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json(),
);

// Error logs with rotation
transports.push(new DailyRotateFile({
  datePattern: 'YYYY-MM-DD',
  filename: join(process.cwd(), 'logs', 'error.%DATE%.log'),
  level: 'error',
  maxFiles: '10d',
  silent: NODE_ENV === 'test',
  format: customFormat,
}));

// Combined logs with rotation (all levels)
transports.push(new DailyRotateFile({
  datePattern: 'YYYY-MM-DD',
  filename: join(process.cwd(), 'logs', 'combined.%DATE%.log'),
  maxFiles: '10d',
  silent: NODE_ENV === 'test',
  format: customFormat,
}));

// Console output with pretty formatting for development
transports.push(new _transports.Console({
  level: 'debug',
  silent: NODE_ENV === 'production',
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'HH:mm:ss' }),
    format.printf(({ timestamp, level, message, ...meta }) => {
      const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
      return `${timestamp} ${level}: ${message} ${metaStr}`;
    }),
  ),
}));

const logger = createLogger({ transports });

export default logger;
