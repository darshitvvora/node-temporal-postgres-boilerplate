import swaggerUi from 'swagger-ui-express';
import packageJson from '../package.json' with { type: 'json' };
import userRoute from './api/user/user.routes.js';
import swaggerSpec from './config/swagger.js';
import { requestLogger } from './middleware/request-logger.js';
import responseLogger from './middleware/response-logger.js';
import errors from './utils/errors.js';
import logger from './utils/logger.js';

const { name, version } = packageJson;

export default (app) => {
  const INTERNAL_SERVER_ERROR = 500;
  const NOT_FOUND = 404;

  // Insert routes below
  app.use(requestLogger);
  app.use(responseLogger());

  app.get('/api/health', (req, res) => res.json({ id: req.id, name, version }));

  // Swagger API Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/api/users', userRoute);

  // Error handler
  app.use((e, req, res, _next) => {
    logger.error(`ERROR: ${e.message}`, {
      processingTime: res.get('X-Response-Time'),
      url: req.originalUrl,
      stackTrace: e.stack,
      method: req.method,
      requestHeader: req.headers,
      params: req.params,
      body: req.body,
      query: req.query,
    });
    return res
      .status(e.statusCode || e.code || INTERNAL_SERVER_ERROR)
      .json({ message: e.message, stack: e.stack });
  });

  // All undefined routes should return a 404
  app.use(errors[NOT_FOUND]);
};
