---
sidebar_position: 3
---

# Features

This boilerplate comes packed with production-ready features that help you build reliable, scalable APIs faster. Here's a comprehensive overview of what's included.

## Core Features

### Temporal Workflows

Durable, reliable task execution with automatic retries and state persistence.

- **Automatic Retries**: Failed operations retry with exponential backoff
- **Durable State**: Workflow state survives crashes and deployments
- **Long-Running Processes**: Handle tasks that take hours or days
- **Activity Isolation**: Separate business logic from workflow orchestration
- **Built-in Monitoring**: Track workflow execution in Temporal UI

**Example Use Cases:**
- User onboarding workflows
- Payment processing with external APIs
- Data processing pipelines
- Scheduled tasks and cron jobs

### TypeScript Integration

Full type safety across your entire application.

- **Type-Safe APIs**: Request/response types with validation
- **IDE Support**: IntelliSense, auto-complete, and inline documentation
- **Compile-Time Errors**: Catch bugs before runtime
- **Easy Refactoring**: Rename with confidence across the codebase
- **Modern ES Features**: Latest JavaScript features with TypeScript

### Express.js 5

Modern web framework with the latest features.

- **Fast Performance**: Lightweight and efficient request handling
- **Middleware Support**: Extensive ecosystem of plugins
- **Routing**: Clean, organized route definitions
- **Error Handling**: Centralized error management
- **OpenAPI Documentation**: Auto-generated API docs with Swagger

### PostgreSQL + Sequelize

Robust database with a powerful ORM.

- **Migrations**: Version control for your database schema
- **Models**: Type-safe database models with TypeScript
- **Associations**: Easy relationships between tables
- **Transactions**: ACID-compliant operations
- **Connection Pooling**: Optimized database connections

## Security Features

### Built-in Security

Security best practices implemented out of the box.

- **Helmet**: Security headers (XSS, clickjacking, MIME sniffing protection)
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Nginx-level protection (100 req/s default)
- **Input Validation**: Schema validation for all API inputs
- **SQL Injection Prevention**: Parameterized queries with Sequelize
- **Environment Variables**: Secrets never committed to git

### Container Security

Docker images follow security best practices.

- **Non-Root User**: Containers run as user `nodejs (1001)`
- **Multi-Stage Builds**: Minimal production images
- **Vulnerability Scanning**: Regular dependency updates
- **Least Privilege**: Only necessary permissions

## Developer Experience

### Hot Reload Development

Instant feedback during development.

- **API Hot Reload**: Changes apply immediately without restart
- **Worker Hot Reload**: Workflow changes update automatically
- **TypeScript Watch**: Real-time compilation
- **Fast Feedback Loop**: See changes in seconds

### Testing Suite

Comprehensive testing setup with coverage.

- **Mocha + Chai**: Expressive test assertions
- **Sinon**: Powerful mocking and stubbing
- **Coverage Reports**: NYC (Istanbul) coverage tracking
- **Integration Tests**: Real HTTP request testing
- **Mocked Workflows**: Test without Temporal server

### Code Quality Tools

Maintain code quality automatically.

- **ESLint v9**: Modern flat config with strict rules
- **Prettier**: Automatic code formatting
- **Husky**: Git hooks for pre-commit checks
- **TypeScript**: Strict mode enabled for maximum safety
- **Git Commit Template**: Conventional commits support

## Production Features

### Docker Support

Complete containerization with best practices.

- **Multi-Stage Builds**: Separate dev and production images
- **API Container**: Optimized Express.js container
- **Worker Container**: Dedicated Temporal worker container
- **Docker Compose**: Local development environment
- **Layer Caching**: Fast rebuilds during development

### Kubernetes Ready

Production-grade Kubernetes manifests included.

- **Deployments**: Separate API and Worker deployments
- **Horizontal Pod Autoscaling**: Auto-scale 3-10 replicas based on CPU
- **Health Checks**: Readiness and liveness probes
- **ConfigMaps**: Environment-specific configuration
- **Secrets Management**: Secure credential handling
- **Service & Ingress**: Load balancing and external access
- **Resource Limits**: CPU and memory constraints
- **Network Policies**: Secure pod communication
- **Pod Disruption Budgets**: High availability guarantees

### Nginx Configuration

Production-ready reverse proxy setup.

- **Load Balancing**: Distribute traffic across API instances
- **Rate Limiting**: Protect against abuse (100 req/s)
- **SSL/TLS Ready**: HTTPS configuration templates
- **Gzip Compression**: Reduce bandwidth usage
- **Caching Headers**: Optimized cache control
- **Keep-Alive**: Persistent connections

### Monitoring & Observability

Built-in monitoring capabilities.

- **Health Endpoints**: `/health` and `/readiness` endpoints
- **Structured Logging**: Winston with JSON format
- **Log Rotation**: Daily log files with compression
- **Temporal UI**: Visual workflow monitoring
- **Kubernetes Probes**: Liveness and readiness checks

## API Features

### OpenAPI 3.0 Documentation

Interactive API documentation with Swagger.

- **Auto-Generated Docs**: Based on route definitions
- **Try It Out**: Test endpoints directly in browser
- **Schema Validation**: Request/response models
- **Authentication**: API key and bearer token support
- **Export**: Download OpenAPI spec for client generation

### RESTful Design

Well-structured API endpoints.

- **Resource-Based**: Clear URL patterns
- **HTTP Methods**: Proper use of GET, POST, PUT, DELETE
- **Status Codes**: Semantic HTTP responses
- **Error Messages**: Consistent error format
- **Pagination**: Support for large datasets

### Request Validation

Robust input validation.

- **Schema Validation**: Express-validator integration
- **Type Checking**: TypeScript interfaces
- **Custom Rules**: Business logic validation
- **Error Messages**: Clear validation feedback

## Project Structure

### Organized Architecture

Clean, scalable project organization.

```
src/
├── api/              # API resources (routes, controllers)
├── config/           # Configuration files
├── db/               # Database (models, migrations)
├── temporal/         # Temporal workflows and activities
│   ├── activities/   # Business logic
│   ├── workflows/    # Workflow definitions
│   ├── clients/      # Workflow client functions
│   └── workers/      # Worker processes
├── middleware/       # Express middleware
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

### Scalable Patterns

Patterns that grow with your application.

- **Resource-Based**: Add new features by copying patterns
- **Separation of Concerns**: Clear boundaries between layers
- **Dependency Injection**: Easy testing and mocking
- **Configuration Management**: Environment-specific settings

## Performance Optimizations

### Built-in Optimizations

Performance features included by default.

- **Connection Pooling**: Efficient database connections
- **Gzip Compression**: Reduced payload sizes
- **Keep-Alive Connections**: HTTP connection reuse
- **Caching Headers**: Browser and CDN caching
- **Worker Scaling**: Independent worker scaling
- **Multi-Stage Builds**: Minimal production images

## Available Scripts

### Development Commands

```bash
npm run dev                    # Start API with hot reload
npm run start:worker:user:dev  # Start worker with hot reload
npm run debug                  # Start API in debug mode
npm run typecheck              # Type check without building
```

### Production Commands

```bash
npm run build                  # Compile TypeScript to JavaScript
npm start                      # Start production API
npm run start:worker:user      # Start production worker
npm run start:worker:all       # Start all workers
```

### Quality Commands

```bash
npm test                       # Run tests with coverage
npm run lint                   # Lint code (max 0 warnings)
npm run lint:fix               # Fix linting issues
npm run pretty                 # Format code with Prettier
```

### Database Commands

```bash
npm run migrate                # Run database migrations
npm run clear-db               # Drop and recreate database
```

## Next Steps

Explore these guides to learn more:

- **[Quick Start](./quick-start.md)** - Get started in 5 minutes
- **[Use Cases](./use-cases.md)** - Real-world examples
- **[Environment Variables](./environment-variables.md)** - Complete configuration guide
