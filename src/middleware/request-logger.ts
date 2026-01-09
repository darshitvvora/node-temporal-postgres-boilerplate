import type { Request, Response, NextFunction } from 'express';
import { APP_NAME } from '../config/environment/index.js';
import logger from '../utils/logger.js';

interface RequestWithId extends Request {
  id?: string;
}

function requestLogger(req: RequestWithId, _res: Response, next: NextFunction): void {
  logger.info(`REQUEST INFO: ${req.id}`, {
    startTime: new Date(),
    requestId: req.id,
    url: req.originalUrl,
    method: req.method,
    requestHeader: req.headers,
    requestParams: req.params,
    requestBody: req.body,
    requestQuery: req.query,
    appName: APP_NAME,
  });
  next();
}

export { requestLogger };
