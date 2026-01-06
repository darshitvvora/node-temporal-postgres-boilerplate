# Getting Started

This guide will help you get up and running with the Node.js API boilerplate in minutes.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 24.12.0 ([Download](https://nodejs.org/) or use [nvm](https://github.com/nvm-sh/nvm))
- **npm** >= 10.0.0
- **PostgreSQL** >= 14 ([Download](https://www.postgresql.org/download/))
- **Docker** (optional, for Temporal Server) ([Download](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))

## Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/darshitvvora/node-temporal-postgres-boilerplate.git
cd node-temporal-postgres-boilerplate
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
# Copy sample environment file
cp sample.env .env

# Edit .env file with your configuration
nano .env  # or use your favorite editor
```

**Required environment variables:**

```bash
# Application
NODE_ENV=development
PORT=3015

# Database
DB_HOST=localhost
DB_NAME=node_api_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_PORT=5432

# Temporal
TEMPORAL_ADDRESS=localhost:7233

# Logging
LOG_LEVEL=debug
```

### 4. Set Up Database

```bash
# Create database
createdb node_api_db

# Run migrations
npm run migrate
```

### 5. Start Temporal Server (Local Development)

```bash
# Using Docker (recommended)
docker run -d \
  -p 7233:7233 \
  -p 8233:8233 \
  --name temporal-server \
  temporalio/auto-setup:latest

# Verify it's running
docker ps | grep temporal
```

Access Temporal Web UI at: http://localhost:8233

### 6. Start the Application

Open **3 terminal windows**:

**Terminal 1 - API Server:**
```bash
npm start
```

**Terminal 2 - Temporal Worker:**
```bash
npm run start:worker:user
```

**Terminal 3 - Test the API:**
```bash
# Health check
curl http://localhost:3015/health

# Create a user
curl -X POST http://localhost:3015/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "1234567890"
  }'
```

### 7. Access Documentation

- **API Docs (Swagger)**: http://localhost:3015/api-docs
- **Temporal UI**: http://localhost:8233

🎉 **Congratulations!** Your API is now running with Temporal workflows.

## Project Structure

```
node-api-boilerplate/
├── src/
│   ├── api/                    # API endpoints
│   │   └── user/
│   │       ├── user.routes.js       # Route definitions
│   │       ├── user.controller.js   # Request handlers
│   │       ├── user.property.js     # Model schema
│   │       └── user.hookshot.js     # Event handlers
│   ├── config/                 # Configuration files
│   │   ├── environment/        # Environment configs
│   │   ├── express.js          # Express setup
│   │   └── swagger.js          # API documentation
│   ├── db/                     # Database
│   │   ├── models/            # Sequelize models
│   │   └── migrations/        # Database migrations
│   ├── temporal/              # Temporal workflows
│   │   ├── activities/        # Business logic
│   │   ├── workflows/         # Workflow definitions
│   │   ├── clients/           # Workflow clients
│   │   └── workers/           # Worker processes
│   ├── middleware/            # Express middleware
│   ├── utils/                 # Utility functions
│   ├── routes.js              # Main router
│   └── server.js              # Application entry point
├── tests/                     # Test files
├── documentation/             # Detailed guides
├── docker-compose.yml         # Docker setup
├── k8s-deployment.yaml        # Kubernetes manifests
└── package.json               # Dependencies
```

## Development Workflow

### Adding a New API Endpoint

#### 1. Create Route

**File**: `src/api/resource/resource.routes.js`

```javascript
import { Router } from 'express';
import * as controller from './resource.controller.js';

const router = Router();

router.post('/', controller.create);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

export default router;
```

#### 2. Create Controller

**File**: `src/api/resource/resource.controller.js`

```javascript
import * as resourceClient from '../../temporal/clients/resource.client.js';

/**
 * @openapi
 * /api/resources:
 *   post:
 *     summary: Create a new resource
 *     tags:
 *       - Resources
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Resource created successfully
 */
export async function create(req, res, next) {
  try {
    const result = await resourceClient.startCreateResource(req.body);
    return res.status(result.code).json(result);
  } catch (error) {
    next(error);
  }
}

export async function index(req, res, next) {
  try {
    const result = await resourceClient.startGetAllResources(req.query);
    return res.status(result.code).json(result);
  } catch (error) {
    next(error);
  }
}
```

#### 3. Create Temporal Activity

**File**: `src/temporal/activities/resource/activities.js`

```javascript
import db from '../../../db/models/index.js';
const { Resource } = db;

export async function createResourceActivity(data) {
  const resource = await Resource.create(data);
  return { id: resource.id, success: true };
}

export async function getAllResourcesActivity({ limit = 100, offset = 0 }) {
  const resources = await Resource.findAll({ limit, offset });
  return resources;
}
```

#### 4. Create Temporal Workflow

**File**: `src/temporal/workflows/resource/createResource.workflow.js`

```javascript
import { proxyActivities } from '@temporalio/workflow';

const activities = proxyActivities({
  startToCloseTimeout: '1 minute',
});

async function createResourceWorkflow(data) {
  try {
    const result = await activities.createResourceActivity(data);
    return { code: 201, success: true, ...result };
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return { code: 409, message: 'Resource already exists' };
    }
    throw error;
  }
}

export { createResourceWorkflow };
```

#### 5. Create Workflow Client

**File**: `src/temporal/clients/resource.client.js`

```javascript
import { getClient } from '../config/temporal.js';

const RESOURCE_QUEUE = 'resource';

async function startCreateResource(data) {
  const client = await getClient();
  const workflowId = `create-resource-${Date.now()}`;

  const handle = await client.workflow.start('createResourceWorkflow', {
    args: [data],
    taskQueue: RESOURCE_QUEUE,
    workflowId,
  });

  return handle.result();
}

export { startCreateResource };
```

#### 6. Register Routes

**File**: `src/routes.js`

```javascript
import resourceRoutes from './api/resource/resource.routes.js';

export default function (app) {
  app.use('/api/users', userRoutes);
  app.use('/api/resources', resourceRoutes); // Add this
}
```

#### 7. Test Your Endpoint

```bash
# Create a resource
curl -X POST http://localhost:3015/api/resources \
  -H "Content-Type: application/json" \
  -d '{"name":"My Resource"}'

# Get all resources
curl http://localhost:3015/api/resources

# View in Swagger
open http://localhost:3015/api-docs
```

## Common Tasks

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/integration/user.test.js
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run pretty
```

### Database Operations

```bash
# Create new migration
npx sequelize-cli migration:generate --name create-resources

# Run migrations
npm run migrate

# Rollback last migration
npx sequelize-cli db:migrate:undo

# Reset database
npm run clear-db
npm run migrate
```

### View Logs

```bash
# Application logs are stored in logs/
tail -f logs/app.log

# Error logs
tail -f logs/error.log

# Temporal worker logs
npm run start:worker:user  # logs to console
```

## Debugging

### Debug API Server

```bash
# Start in debug mode
npm run debug

# Attach debugger at http://localhost:9229
```

### Debug Worker

```javascript
// Add breakpoints in worker code
// Run worker with:
node --inspect ./src/temporal/workers/user.worker.js

// Attach Chrome DevTools
// Open chrome://inspect in Chrome browser
```

### Common Issues

#### Issue 1: Database Connection Error

```bash
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**: Ensure PostgreSQL is running
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Check status
psql -U postgres -c "SELECT version();"
```

#### Issue 2: Temporal Connection Error

```bash
Error: Connection refused to Temporal Server
```

**Solution**: Start Temporal Server
```bash
docker run -d -p 7233:7233 -p 8233:8233 temporalio/auto-setup:latest
```

#### Issue 3: Port Already in Use

```bash
Error: listen EADDRINUSE: address already in use :::3015
```

**Solution**: Kill process or change port
```bash
# Find process
lsof -i :3015

# Kill process
kill -9 <PID>

# Or change PORT in .env file
```

#### Issue 4: Worker Not Processing Workflows

**Solution**: Ensure worker is running
```bash
# Check if worker is running
ps aux | grep worker

# Restart worker
npm run start:worker:user
```

## Next Steps

Now that you're up and running:

1. **Explore the Code**: Browse `src/api/user/` to see a complete example
2. **Read the Guides**:
   - [Temporal Workflows Guide](./TEMPORAL_GUIDE.md) - Learn about workflows
   - [API Documentation Guide](./API_DOCUMENTATION.md) - API docs standards
   - [Deployment Guide](./DEPLOYMENT.md) - Deploy to production
3. **Try Examples**: Test the user API endpoints in Swagger UI
4. **Watch Workflows**: Monitor executions in Temporal Web UI
5. **Add Your Features**: Use the examples to add your own endpoints

## Getting Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/darshitvvora/node-api-boilerplate/issues)
- **Documentation**: Check `documentation/` folder for detailed guides
- **Temporal Community**: [Temporal Forum](https://community.temporal.io/)
- **Stack Overflow**: Tag your questions with `temporalio` and `node.js`

## Pro Tips

1. **Use Nodemon**: The dev server auto-restarts on file changes
2. **Check Temporal UI**: Always monitor workflow executions at http://localhost:8233
3. **Read Logs**: Check `logs/` directory for detailed application logs
4. **Use Swagger**: Test APIs interactively at http://localhost:3015/api-docs
5. **Commit Often**: Use conventional commits with Commitizen (`git cz`)

Happy coding! 🚀
