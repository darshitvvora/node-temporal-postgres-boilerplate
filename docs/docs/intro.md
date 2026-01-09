---
sidebar_position: 1
---

# Introduction

Welcome to the **Node.js Temporal PostgreSQL Boilerplate** documentation! This is a production-ready REST API boilerplate that combines modern Node.js development with the power of Temporal workflows for building reliable, scalable applications.

## What is This Boilerplate?

This boilerplate provides a complete foundation for building enterprise-grade Node.js REST APIs with:

- **Temporal Workflows** - Durable, reliable task execution that survives crashes
- **TypeScript** - Full type safety and excellent developer experience
- **Express.js 5** - Modern web framework with latest features
- **PostgreSQL + Sequelize** - Robust database with ORM and migrations
- **Production Deployments** - Ready-to-use Docker and Kubernetes configurations

## Why Use This Boilerplate?

### Traditional APIs vs This Boilerplate

| Traditional API | With This Boilerplate |
|----------------|----------------------|
| Manual retry logic | Automatic retries with Temporal |
| Lost work on crashes | Durable workflow state |
| Complex error handling | Built-in fault tolerance |
| Manual deployment scripts | Docker & Kubernetes ready |
| JavaScript type errors | Full TypeScript type safety |

### Key Benefits

1. **Reliability** - Temporal ensures your critical operations complete, even through failures
2. **Speed** - Get started in 5 minutes with comprehensive examples
3. **Best Practices** - Security, testing, logging, and monitoring built in
4. **Production Ready** - Complete deployment solutions for Docker and Kubernetes
5. **Modern Stack** - Latest versions of Node.js, TypeScript, and Express.js

## What You'll Build

This boilerplate comes with a complete user management example that demonstrates:

- REST API endpoints with OpenAPI documentation
- Temporal workflows for reliable user creation
- Database operations with Sequelize
- Comprehensive testing setup
- Production deployment configurations

## Architecture Overview

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

## What is Temporal?

Temporal is a **durable execution platform** that makes your code fault-tolerant by default. Instead of manually handling retries, timeouts, and state management, Temporal:

- Automatically retries failed operations with exponential backoff
- Persists workflow state across crashes and deployments
- Provides built-in monitoring and observability
- Scales workers independently from your API
- Handles complex, long-running processes with ease

**Example:** When a user signs up, Temporal ensures their account is created even if:
- The database is temporarily unavailable
- Your API server crashes
- A third-party service times out

The workflow automatically retries until it succeeds, without any manual intervention.

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Language** | TypeScript | 5.x |
| **Runtime** | Node.js | >= 24.12.0 |
| **Framework** | Express.js | 5.x |
| **Database** | PostgreSQL | >= 14 |
| **ORM** | Sequelize | 6.x |
| **Workflows** | Temporal.io | 1.11+ |
| **Testing** | Mocha + Chai + Sinon | Latest |
| **Documentation** | Swagger/OpenAPI | 3.0 |

## Next Steps

Ready to get started? Head over to the [Quick Start](./quick-start.md) guide to get your API running in under 5 minutes!

Or explore:
- [Features](./features.md) - Detailed feature overview
- [Use Cases](./use-cases.md) - Real-world scenarios
- [Environment Variables](./environment-variables.md) - Configuration & Temporal Cloud setup
- [Adding New Resources](./adding-new-resource.md) - Step-by-step guide to add new API endpoints
