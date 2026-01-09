import swaggerJsdoc from 'swagger-jsdoc';
import packageJson from '../../package.json' with { type: 'json' };
import config from './environment/index.js';

const { name, version, description } = packageJson;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: name,
      version,
      description,
      contact: {
        name: 'API Support',
        email: 'support@api.test',
      },
    },
    servers: [
      {
        url: `${config.PREFIX}${config.DOMAIN}`,
        description: `${config.NODE_ENV} server`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com',
            },
            mobile: {
              type: 'string',
              description: 'User mobile number',
              example: '1234567890',
            },
          },
        },
        UserInput: {
          type: 'object',
          required: ['email', 'name', 'mobile'],
          properties: {
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com',
            },
            mobile: {
              type: 'string',
              description: 'User mobile number',
              example: '1234567890',
            },
          },
        },
        UserUpdate: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com',
            },
            mobile: {
              type: 'string',
              description: 'User mobile number',
              example: '1234567890',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
              example: 'An error occurred',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Operation completed successfully',
            },
            id: {
              type: 'integer',
              description: 'Resource ID',
              example: 1,
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to the API routes with JSDoc comments
  apis: [
    './src/api/**/*.controller.ts',
    './src/api/**/*.routes.ts',
    './src/api/**/*.controller.js',
    './src/api/**/*.routes.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
