import type { Request, Response, NextFunction } from 'express';
import { APP_NAME } from '../config/environment/index.js';
import logger from '../utils/logger.js';

export default function responseLogger() {
  return (req: Request, res: Response, next: NextFunction): void => {
    res.on('finish', () => {
      logger.info(`RESPONSE INFO: ${res.get('X-Request-Id')}`, {
        startTime: new Date(),
        requestId: res.get('X-Request-Id'),
        url: req.originalUrl,
        method: req.method,
        requestHeader: req.headers,
        responseHeader: res.getHeaders(),
        responseBody: (res as any).body,
        requestParams: req.params,
        requestBody: req.body,
        requestQuery: req.query,
        appName: APP_NAME,
      });
    });

    next();
  };
}
