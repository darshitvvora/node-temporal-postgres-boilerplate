---
sidebar_position: 2
---

# Quick Start

Get your production-ready API up and running in under 5 minutes! This guide will walk you through the essential steps to start building with this boilerplate.

## Prerequisites

Before you begin, make sure you have these installed:

- **Node.js** >= 24.12.0 ([Download](https://nodejs.org/))
- **PostgreSQL** >= 14 ([Download](https://www.postgresql.org/download/))
- **Docker** (optional, for Temporal) ([Download](https://www.docker.com/))

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/darshitvvora/node-temporal-postgres-boilerplate.git
cd node-temporal-postgres-boilerplate
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages including Express, Temporal, Sequelize, and development tools.

### 3. Set Up Environment

```bash
cp sample.env .env
```

Edit the `.env` file with your database credentials:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=node_api_db
DB_USER=postgres
DB_PASSWORD=your_password

# Temporal Configuration
TEMPORAL_ADDRESS=localhost:7233

# Server Configuration
PORT=3015
NODE_ENV=development
```

💡 **Tip:** See the [Environment Variables](./environment-variables.md) guide for complete configuration options, including Temporal Cloud setup.

### 4. Create Database and Run Migrations

```bash
# Create the database
createdb node_api_db

# Run migrations to set up tables
npm run migrate
```

### 5. Start Temporal Server

You have two options to run Temporal:

**Option A: Using Docker (Recommended)**

```bash
docker run -d -p 7233:7233 -p 8233:8233 temporalio/auto-setup:latest
```

**Option B: Using Homebrew (macOS)**

```bash
brew install temporal
temporal server start-dev
```

### 6. Start the Application

You'll need **3 terminal windows** for development:

**Terminal 1: API Server (with hot reload)**

```bash
npm run dev
```

**Terminal 2: Temporal Worker (with hot reload)**

```bash
npm run start:worker:user:dev
```

**Terminal 3: Test the API**

```bash
# Check health endpoint
curl http://localhost:3015/health

# Expected response:
# {
#   "status": "success",
#   "message": "Server is running",
#   "timestamp": "2026-01-09T..."
# }
```

## Verify Installation

### 1. Access the Swagger UI

Open your browser and navigate to:

```
http://localhost:3015/api-docs
```

You should see the interactive API documentation with all available endpoints.

### 2. Access Temporal UI

Open your browser and navigate to:

```
http://localhost:8233
```

This shows the Temporal dashboard where you can monitor workflow executions.

### 3. Create Your First User

Use the API to create a user (this will trigger a Temporal workflow):

```bash
curl -X POST http://localhost:3015/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "1234567890"
  }'
```

Expected response:

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "1234567890",
    "workflowId": "user-creation-12345",
    "createdAt": "2026-01-09T...",
    "updatedAt": "2026-01-09T..."
  }
}
```

### 4. Watch the Workflow in Temporal UI

Go to http://localhost:8233 and you'll see your workflow execution. Click on it to see:

- Workflow execution history
- Input and output payloads
- Activity executions
- Retry attempts (if any failures occurred)

## Next Steps

Now that you have the boilerplate running, explore these topics:

- **[Features](./features.md)** - Discover all the built-in features
- **[Use Cases](./use-cases.md)** - Real-world examples and scenarios
- **[Adding New Resources](./adding-new-resource.md)** - Learn how to add your own API endpoints

## Troubleshooting

### Port Already in Use

If port 3015 is already in use, change it in your `.env` file:

```bash
PORT=3016
```

### Database Connection Failed

Verify your PostgreSQL is running:

```bash
psql -U postgres -c "SELECT version();"
```

Check your database credentials in `.env` match your PostgreSQL setup.

### Temporal Connection Failed

Ensure Temporal server is running:

```bash
# Check if Temporal is accessible
curl http://localhost:8233
```

If using Docker, verify the container is running:

```bash
docker ps | grep temporal
```
