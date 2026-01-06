import http from 'node:http';
import express from 'express';
import config from './config/environment/index.js';
import expressConfig from './config/express.js';
import db from './db/index.js';
import routes from './routes.js';
import logger from './utils/logger.js';

// Setup app
const app = express();
const server = http.createServer(app);

expressConfig(app);
routes(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, () => {
    console.log(
      'Server listening on %d, in %s mode',
      config.port,
      app.get('env'),
    );
  });
}

process.on('unhandledRejection', (reason, p) => {
  logger.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  logger.error('uncaughtException', err);
});

db.sequelizeDB
  .authenticate()
  .then(startServer)
  .catch((err) => {
    console.log('Server failed to start due to error: %s', err);
  });

// Expose app
export default app;
