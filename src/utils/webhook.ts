import WebHooks from 'node-webhooks';
import { root } from '../config/environment/index.js';
import logger from './logger.js';

const hookshot = new WebHooks({
  db: `${root}/subscriptions.json`,
  DEBUG: true,
});

const emitter = hookshot.getEmitter();
const SUCCESS = 200;
const TWO_ZERO_ONE = 201;

emitter.on('*.*', (shortname: string, statusCode: number, body: unknown) => {
  if (![SUCCESS, TWO_ZERO_ONE].includes(statusCode)) {
    logger.error(
      'trigger webHook',
      shortname,
      'with status code',
      statusCode,
      'and body',
      body,
    );
  }
});

export default hookshot;
