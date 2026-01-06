# Node.js API Boilerplate with Temporal Workflows

> A production-ready Node.js REST API boilerplate with built-in reliability using Temporal workflows, modern best practices, and complete deployment solutions for Docker and Kubernetes.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D24.12.0-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## ✨ Features

### Core Features
- 🔄 **Temporal Workflows** - Durable, reliable task execution with automatic retries
- 🚀 **Express.js 5** - Latest version with modern middleware
- 🗄️ **PostgreSQL + Sequelize** - Robust database with ORM and migrations
- 📚 **OpenAPI 3.0 (Swagger)** - Interactive API documentation
- 🔒 **Security First** - Helmet, CORS, rate limiting, and best practices
- 📝 **Winston Logging** - Structured logging with daily rotation

### Developer Experience
- ⚡ **Hot Reload** - Nodemon for fast development
- 🧪 **Testing** - Mocha + Chai + Sinon with comprehensive coverage
- 🎨 **Code Quality** - ESLint v9 + Prettier + Husky hooks
- 📦 **Modern JavaScript** - ES Modules, async/await, latest Node features
- 🔍 **Type Safety Ready** - Structured for easy TypeScript migration

### Production Ready
- 🐳 **Docker** - Multi-stage builds for API and Workers
- ☸️ **Kubernetes** - Complete manifests with HPA, health checks
- 🌐 **Nginx** - Production-grade reverse proxy configuration
- 📊 **Monitoring** - Health checks, readiness/liveness probes
- 🔄 **CI/CD Ready** - GitHub Actions examples included

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
┌──────▼──────┐
│    Nginx    │  (Rate limiting, SSL, caching)
└──────┬──────┘
       │
┌──────▼──────┐
│  API Server │  (Express.js - Handles HTTP requests)
└──────┬──────┘
       │
       ├─────► PostgreSQL  (Data persistence)
       │
       └─────► Temporal Server
                     ▲
                     │
              ┌──────┴───────┐
              │   Workers    │  (Execute workflows/activities)
              └──────────────┘
```

**Why Temporal?**

Traditional APIs lose work when services crash or restart. Temporal ensures your critical operations complete, even through failures:

- ✅ Automatic retries with exponential backoff
- ✅ Workflow state survives crashes and deployments
- ✅ Built-in monitoring and observability
- ✅ Easy to write complex, long-running processes
- ✅ Horizontal scaling of workers independent from API

## 🚀 Quick Start

Get up and running in under 5 minutes:

### Prerequisites

- Node.js >= 24.12.0 ([install](https://nodejs.org/))
- PostgreSQL >= 14 ([install](https://www.postgresql.org/download/))
- Docker (optional, for Temporal) ([install](https://www.docker.com/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/darshitvvora/node-temporal-postgres-boilerplate.git
cd node-temporal-postgres-boilerplate

# 2. Install dependencies
npm install

# 3. Set up environment
cp sample.env .env
# Edit .env with your database credentials

# 4. Create database and run migrations
createdb node_api_db
npm run migrate

# 5. Start Temporal Server (local development)
docker run -d -p 7233:7233 -p 8233:8233 temporalio/auto-setup:latest

# 6. Start the application (3 terminals)

# Terminal 1: API Server
npm start

# Terminal 2: Temporal Worker
npm run start:worker:user

# Terminal 3: Test the API
curl http://localhost:3015/health
```

**🎉 Done!** Your API is running at http://localhost:3015

- **Swagger UI**: http://localhost:3015/api-docs
- **Temporal UI**: http://localhost:8233

### Create Your First User

```bash
curl -X POST http://localhost:3015/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "1234567890"
  }'
```

Watch the workflow execute in Temporal UI at http://localhost:8233 🎯

## 📖 Documentation

Comprehensive guides are available in the [`documentation/`](./documentation) folder:

| Guide | Description |
|-------|-------------|
| **[Getting Started](./documentation/GETTING_STARTED.md)** | Step-by-step setup and development guide |
| **[Temporal Workflows](./documentation/TEMPORAL_GUIDE.md)** | Creating and managing Temporal workflows |
| **[API Documentation](./documentation/API_DOCUMENTATION.md)** | OpenAPI/Swagger documentation standards |
| **[Deployment Guide](./documentation/DEPLOYMENT.md)** | Docker, Kubernetes, and production deployment |

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Runtime** | Node.js | >= 24.12.0 |
| **Framework** | Express.js | 5.x |
| **Database** | PostgreSQL | >= 14 |
| **ORM** | Sequelize | 6.x |
| **Workflows** | Temporal.io | 1.11+ |
| **Logging** | Winston | 3.x |
| **Testing** | Mocha + Chai + Sinon | Latest |
| **Linting** | ESLint (Flat Config) | 9.x |
| **Formatting** | Prettier | 3.x |
| **Documentation** | Swagger/OpenAPI | 3.0 |
| **Security** | Helmet | 8.x |

## 📁 Project Structure

```
node-temporal-postgres-boilerplate/
├── src/
│   ├── api/                         # API resources
│   │   └── user/
│   │       ├── user.routes.js       # Route definitions
│   │       ├── user.controller.js   # Request handlers
│   │       ├── user.property.js     # Model schema
│   │       └── user.hookshot.js     # Event handlers
│   ├── config/                      # Configuration
│   │   ├── environment/             # Environment configs
│   │   ├── express.js               # Express setup
│   │   ├── swagger.js               # API documentation config
│   │   ├── temporal.js              # Temporal client config
│   │   └── sequelize.cjs            # Sequelize configuration (CommonJS)
│   ├── db/                          # Database
│   │   ├── models/                  # Sequelize models
│   │   └── migrations/              # Database migrations
│   ├── temporal/                    # Temporal workflows
│   │   ├── activities/              # Business logic (DB, API calls)
│   │   ├── workflows/               # Workflow definitions
│   │   ├── clients/                 # Workflow client functions
│   │   └── workers/                 # Worker processes
│   ├── middleware/                  # Express middleware
│   ├── utils/                       # Utility functions
│   ├── app.js                       # Express app configuration
│   ├── routes.js                    # Main router
│   └── server.js                    # Application entry point
├── tests/                           # Test files
│   ├── integration/                 # Integration tests
│   ├── setup.js                     # Test setup and configuration
│   └── global.js                    # Global test helpers
├── documentation/                   # Detailed guides
├── logs/                            # Application logs
├── docker-compose.yml               # Docker Compose config
├── Dockerfile.api                   # API service Docker image
├── Dockerfile.worker                # Worker service Docker image
├── k8s-deployment.yaml              # Kubernetes manifests
├── nginx.sample.conf                # Nginx configuration
├── .sequelizerc                     # Sequelize CLI configuration
├── eslint.config.mjs                # ESLint v9 flat configuration
└── package.json                     # Dependencies and scripts
```

## 🔧 Available Scripts

```bash
# Development
npm start              # Start API with hot reload
npm run debug          # Start API in debug mode

# Testing
npm test               # Run all tests with coverage

# Code Quality
npm run lint           # Lint code (max 0 warnings)
npm run lint:fix       # Fix linting issues automatically
npm run pretty         # Format code with Prettier

# Database
npm run migrate        # Run database migrations
npm run clear-db       # Drop and recreate database (⚠️ destructive)

# Temporal Workers
npm run start:worker:user      # Start user worker
npm run start:worker:all       # Start all workers
```

## 🐳 Docker Deployment

### Local Development with Docker Compose

```bash
# Start all services (API, Worker, Nginx)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services:
- API: http://localhost:3015 (direct) or http://localhost (via nginx)
- Swagger: http://localhost:3015/api-docs
- Nginx: http://localhost

### Production Docker Images

```bash
# Build API image
docker build -f Dockerfile.api -t your-registry/node-api:v1.0.0 --target production .

# Build Worker image
docker build -f Dockerfile.worker -t your-registry/node-api-worker:v1.0.0 --target production .

# Push to registry
docker push your-registry/node-api:v1.0.0
docker push your-registry/node-api-worker:v1.0.0
```

## ☸️ Kubernetes Deployment

Complete Kubernetes manifests are included with:

- API Deployment with HPA (auto-scaling 3-10 replicas)
- Worker Deployment (2 replicas by default)
- Service, Ingress, ConfigMap, Secrets
- Health checks, resource limits, security policies
- NetworkPolicy, PodDisruptionBudget

```bash
# Create secrets
kubectl create secret generic node-api-secrets \
  --from-literal=DB_PASSWORD=your-password \
  --from-literal=DB_HOST=your-db-host \
  --from-literal=TEMPORAL_ADDRESS=temporal.tmprl.cloud:7233

# Deploy
kubectl apply -f k8s-deployment.yaml

# Check status
kubectl get pods -l app=node-api
kubectl get ingress
```

📘 **See [Deployment Guide](./documentation/DEPLOYMENT.md) for complete instructions**

## 🧪 Testing

```bash
# Run all tests with coverage
npm test

# Run specific test file
NODE_ENV=test PORT=8000 npx mocha --exit --timeout 50000 --require ./tests/setup.js ./tests/integration/user.test.js
```

**Test Coverage:**
- Integration tests with real HTTP requests
- Mocked Temporal workflows using Sinon
- Database transaction rollback after tests
- Comprehensive assertions with Chai
- Coverage reporting via NYC (Istanbul)

## 📊 Adding a New API Resource

Follow these steps to add a new resource (e.g., `products`):

### 1. Create Database Model

```bash
# Create migration
npx sequelize-cli migration:generate --name create-products

# Define schema in migration file
# Run migration
npm run migrate
```

### 2. Create API Files

```bash
mkdir -p src/api/product
touch src/api/product/product.routes.js
touch src/api/product/product.controller.js
touch src/api/product/product.property.js
```

### 3. Create Temporal Workflow

```bash
mkdir -p src/temporal/activities/product
mkdir -p src/temporal/workflows/product
touch src/temporal/activities/product/activities.js
touch src/temporal/workflows/product/createProduct.workflow.js
touch src/temporal/clients/product.client.js
```

### 4. Register Routes

Add to `src/routes.js`:

```javascript
import productRoutes from './api/product/product.routes.js';

app.use('/api/products', productRoutes);
```

📘 **See [Getting Started Guide](./documentation/GETTING_STARTED.md) for detailed walkthrough**

## 🔒 Security Best Practices

This boilerplate implements security best practices out of the box:

- ✅ **Helmet** - Security headers (XSS, clickjacking, etc.)
- ✅ **CORS** - Configurable cross-origin policies
- ✅ **Rate Limiting** - Nginx-level rate limiting (100 req/s)
- ✅ **Input Validation** - Schema validation for all inputs
- ✅ **SQL Injection Prevention** - Sequelize parameterized queries
- ✅ **Non-root Docker User** - Containers run as user `nodejs (1001)`
- ✅ **Environment Variables** - Secrets never committed to git
- ✅ **HTTPS/TLS** - Ready for SSL certificates
- ✅ **Security Patches** - Regular dependency updates

## 📈 Performance Optimizations

- ⚡ **Connection Pooling** - Database connection pooling
- ⚡ **Compression** - Gzip compression for responses
- ⚡ **Keep-Alive** - HTTP keep-alive connections
- ⚡ **Caching Headers** - Proper cache control
- ⚡ **Worker Scaling** - Independent worker scaling
- ⚡ **Multi-stage Builds** - Optimized Docker images

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits (`git cz`)
4. Run tests (`npm test`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

**Development Guidelines:**
- Follow the existing code style (ESLint + Prettier)
- Write tests for new features
- Update documentation as needed
- Use conventional commits

## 🗺️ Roadmap

- [x] Express.js 5 integration
- [x] Temporal workflow engine integration
- [x] PostgreSQL + Sequelize ORM
- [x] OpenAPI 3.0 documentation
- [x] Docker multi-stage builds
- [x] Kubernetes manifests with HPA
- [x] Nginx reverse proxy configuration
- [x] Comprehensive testing setup
- [x] ESLint v9 flat config
- [x] Security best practices (Helmet, CORS)
- [ ] Cron Schedule support with temporal
- [ ] Deployment guide on AWS
- [ ] Observability (Prometheus + Grafana) + Temporal observability
- [ ] Example of circuit breaker, outbox, SAGA
- [ ] Example for scaling workers with K8s
- [ ] Example of fairness & priority within API


## 📚 Learn More

### Temporal Resources
- [Temporal Documentation](https://docs.temporal.io/)
- [Temporal Node.js SDK](https://docs.temporal.io/dev-guide/typescript)
- [Temporal Samples](https://github.com/temporalio/samples-typescript)
- [Why Temporal?](https://docs.temporal.io/temporal)

### Node.js Best Practices
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Sequelize Documentation](https://sequelize.org/)

### Deployment & DevOps
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [Temporal.io](https://temporal.io/) - Durable execution platform
- [Sequelize](https://sequelize.org/) - Promise-based ORM
- [@antfu/eslint-config](https://github.com/antfu/eslint-config) - Modern ESLint config
- [Angular Fullstack Generator](https://github.com/angular-fullstack/generator-angular-fullstack) - Inspiration for structure

## 💬 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/darshitvvora/node-temporal-postgres-boilerplate/issues)
- **Discussions**: [Ask questions and share ideas](https://github.com/darshitvvora/node-temporal-postgres-boilerplate/discussions)
- **Documentation**: Check the [`documentation/`](./documentation) folder

---

**Built with ❤️ by [Darshit Vora](https://github.com/darshitvvora)**

⭐ **Star this repo** if you find it helpful!
