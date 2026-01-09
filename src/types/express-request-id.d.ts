declare module 'express-request-id' {
  import type { RequestHandler } from 'express';
  function addRequestId(): RequestHandler;
  export = addRequestId;
}
