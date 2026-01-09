import path from 'node:path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import addRequestId from 'express-request-id';
import helmet from 'helmet';
import responseTime from 'response-time';
import config from './environment/index.js';

const requestId = addRequestId();

export default (app: Express): void => {
  const env = app.get('env');

  if (env === 'development' || env === 'test') {
    app.use(express.static(path.join(config.root, '.tmp')));
  }
  app.use(requestId);
  app.use(helmet());
  app.use(responseTime());
  app.use(cors());
  app.use(compression());
  app.use(cookieParser());
  // Express 5 has built-in body parsing
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json({ limit: '50mb' }));

  Object.assign(app, { express });
};
