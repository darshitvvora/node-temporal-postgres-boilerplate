---
sidebar_position: 6
---

# Environment Variables

This guide explains all environment variables used in the boilerplate and how to configure them for different environments, including **Temporal Cloud** setup.

## Configuration Files

The boilerplate uses environment variables for configuration:

- **`sample.env`** - Template with all available variables
- **`.env`** - Your local configuration (not committed to git)
- **`.env.production`** - Production overrides (optional)

## Quick Start

Copy the sample environment file:

```bash
cp sample.env .env
```

Edit `.env` with your configuration based on the sections below.

## Complete Environment Variable Reference

### Node Server Configuration

```bash
# Node environment: development | production | test
NODE_ENV=development

# Application name
APP_NAME='Node_API'

# Server port
PORT=3015

# Rate limiting (requests per minute)
THROTTLE_LIMIT=1500

# URL prefix
PREFIX=http://

# Domain
DOMAIN=api.test

# Timezone
TZ='Asia/Kolkata'
```

**Details:**

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | development | Environment mode (development, production, test) |
| `APP_NAME` | Yes | Node_API | Application identifier for logs and monitoring |
| `PORT` | Yes | 3015 | HTTP server listening port |
| `THROTTLE_LIMIT` | No | 1500 | Maximum requests per minute per IP |
| `PREFIX` | No | http:// | URL protocol prefix |
| `DOMAIN` | No | api.test | API domain name |
| `TZ` | No | UTC | Server timezone (IANA format) |

**Common Timezones:**
- US East: `America/New_York`
- US West: `America/Los_Angeles`
- UK: `Europe/London`
- India: `Asia/Kolkata`
- Japan: `Asia/Tokyo`
- UTC: `UTC`

### PostgreSQL Database Configuration

The boilerplate uses a **PostgreSQL connection string**:

```bash
# PostgreSQL connection string format
PG_DB="postgres://username:password@hostname:port/database"
```

**Examples:**

```bash
# Local development
PG_DB="postgres://postgres:postgres@localhost:5432/temporalapi"

# Production
PG_DB="postgres://dbuser:SecureP@ss@prod-db.example.com:5432/prod_db"

# With SSL
PG_DB="postgres://user:pass@host:5432/db?sslmode=require"

# With connection pooling params
PG_DB="postgres://user:pass@host:5432/db?pool_size=20&pool_timeout=30"
```

**Connection String Format:**
```
postgres://[user[:password]@][host][:port][/database][?options]
```

**URL Encoding Special Characters:**

If your password contains special characters, URL encode them:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `&` | `%26` |
| `=` | `%3D` |

**Example with special characters:**
```bash
# Password: P@ss#123
PG_DB="postgres://user:P%40ss%23123@localhost:5432/mydb"
```

**Database Setup:**

```bash
# Create database
createdb temporalapi

# With specific user
createdb -U postgres temporalapi

# Test connection
psql "postgres://postgres:postgres@localhost:5432/temporalapi" -c "SELECT version();"

# Run migrations
npm run migrate
```

**Common Connection Parameters:**

```bash
# SSL enabled
PG_DB="postgres://user:pass@host:5432/db?sslmode=require"

# SSL with certificate verification disabled (not recommended for production)
PG_DB="postgres://user:pass@host:5432/db?sslmode=require&sslverify=false"

# Connection pool settings
PG_DB="postgres://user:pass@host:5432/db?pool_size=20&pool_timeout=30"

# Connection timeout
PG_DB="postgres://user:pass@host:5432/db?connect_timeout=10"
```

### File Storage Configuration

```bash
# File storage path
FS_PATH=/Users/darshit/nfs/api
```

**Usage:**
- Directory for file uploads, temporary files, and logs
- Must have read/write permissions
- Use absolute paths

**Setup:**

```bash
# Create directory
mkdir -p /path/to/storage

# Set permissions
chmod 755 /path/to/storage

# Verify writable
touch /path/to/storage/test.txt && rm /path/to/storage/test.txt
```

**Production recommendations:**
- Use dedicated storage volume or NFS mount
- Regular backups
- Monitor disk space
- Set up log rotation

### Email/SMTP Configuration

```bash
# Mail server configuration
SMTP_HOST=localhost
SMTP_SECURE=false
SMTP_IGNORETLS=true
SMTP_PORT=1025
SMTP_USER=notifications@api.test
SMTP_AUTH_USER=api/api-dev
SMTP_AUTH_PASS='sfsff'
```

**Details:**

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP server port (25, 587, or 465) |
| `SMTP_SECURE` | Use TLS (true for port 465) |
| `SMTP_IGNORETLS` | Ignore TLS certificate errors (dev only) |
| `SMTP_USER` | Sender email address |
| `SMTP_AUTH_USER` | SMTP authentication username |
| `SMTP_AUTH_PASS` | SMTP authentication password |

#### Development Setup (MailHog)

For local development, use MailHog to test emails:

```bash
# Start MailHog with Docker
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

# Configuration
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_IGNORETLS=true
SMTP_USER=dev@localhost
SMTP_AUTH_USER=dev
SMTP_AUTH_PASS='dev'
```

View emails at: http://localhost:8025

#### Production SMTP Services

**Gmail:**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_IGNORETLS=false
SMTP_USER=your-email@gmail.com
SMTP_AUTH_USER=your-email@gmail.com
SMTP_AUTH_PASS='your-app-password'
```

**SendGrid:**
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_IGNORETLS=false
SMTP_USER=apikey
SMTP_AUTH_USER=apikey
SMTP_AUTH_PASS='your-sendgrid-api-key'
```

**AWS SES:**
```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_IGNORETLS=false
SMTP_USER=your-ses-smtp-username
SMTP_AUTH_USER=your-ses-smtp-username
SMTP_AUTH_PASS='your-ses-smtp-password'
```

**Mailgun:**
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_IGNORETLS=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_AUTH_USER=postmaster@your-domain.mailgun.org
SMTP_AUTH_PASS='your-mailgun-password'
```

## Temporal Configuration

### Local Temporal Server

For local development with Temporal running on your machine:

```bash
# Temporal server address
TEMPORAL_ADDRESS=localhost:7233

# Namespace
TEMPORAL_NAMESPACE=default

# Task queue name
TEMPORAL_TASK_QUEUE=loan-underwriter-queue

# Maximum concurrent workers
MAX_WORKERS=10
```

**Starting Local Temporal:**

```bash
# Option 1: Docker
docker run -d -p 7233:7233 -p 8233:8233 temporalio/auto-setup:latest

# Option 2: Temporal CLI
temporal server start-dev

# Option 3: Homebrew (macOS)
brew install temporal
temporal server start-dev
```

**Access Temporal UI:** http://localhost:8233

### Temporal Cloud Configuration

For production deployment with [Temporal Cloud](https://temporal.io/cloud):

```bash
# Temporal Cloud endpoint
TEMPORAL_ADDRESS=your-namespace.account-id.tmprl.cloud:7233

# Your Temporal Cloud namespace
TEMPORAL_NAMESPACE=your-namespace.account-id

# Task queue name
TEMPORAL_TASK_QUEUE=production-queue

# Maximum concurrent workers
MAX_WORKERS=20

# Optional: API Key for authentication
TEMPORAL_API_KEY=your-api-key-here

# Optional: TLS certificate paths
TEMPORAL_CLIENT_CERT_PATH=/path/to/client.pem
TEMPORAL_CLIENT_KEY_PATH=/path/to/client-key.pem
```

### Setting Up Temporal Cloud

#### Step 1: Get Temporal Cloud Credentials

1. Sign up at [Temporal Cloud](https://temporal.io/cloud)
2. Create a namespace (e.g., `myapp`)
3. Note your namespace format: `myapp.a2c3z` (namespace + account ID)
4. Download certificates:
   - Client certificate (`client.pem`)
   - Client private key (`client-key.pem`)

#### Step 2: Configure Environment

**Option A: Using Certificate Files (Recommended)**

```bash
# .env
TEMPORAL_ADDRESS=myapp.a2c3z.tmprl.cloud:7233
TEMPORAL_NAMESPACE=myapp.a2c3z
TEMPORAL_TASK_QUEUE=production-queue
MAX_WORKERS=20

# Store certificates in a secure location
TEMPORAL_CLIENT_CERT_PATH=/app/certs/client.pem
TEMPORAL_CLIENT_KEY_PATH=/app/certs/client-key.pem
```

**Option B: Using API Key (if supported)**

```bash
TEMPORAL_ADDRESS=myapp.a2c3z.tmprl.cloud:7233
TEMPORAL_NAMESPACE=myapp.a2c3z
TEMPORAL_TASK_QUEUE=production-queue
MAX_WORKERS=20
TEMPORAL_API_KEY=your-temporal-cloud-api-key
```

#### Step 3: Secure Certificate Storage

**Docker Secrets:**

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    image: your-api:latest
    secrets:
      - temporal_client_cert
      - temporal_client_key
    environment:
      TEMPORAL_CLIENT_CERT_PATH: /run/secrets/temporal_client_cert
      TEMPORAL_CLIENT_KEY_PATH: /run/secrets/temporal_client_key

secrets:
  temporal_client_cert:
    file: ./certs/client.pem
  temporal_client_key:
    file: ./certs/client-key.pem
```

**Kubernetes Secrets:**

```bash
# Create secret from files
kubectl create secret generic temporal-certs \
  --from-file=client.pem=./certs/client.pem \
  --from-file=client-key.pem=./certs/client-key.pem

# Reference in deployment
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: api
    env:
    - name: TEMPORAL_CLIENT_CERT_PATH
      value: /app/certs/client.pem
    - name: TEMPORAL_CLIENT_KEY_PATH
      value: /app/certs/client-key.pem
    volumeMounts:
    - name: temporal-certs
      mountPath: /app/certs
      readOnly: true
  volumes:
  - name: temporal-certs
    secret:
      secretName: temporal-certs
```

### Temporal Configuration Details

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TEMPORAL_ADDRESS` | Yes | localhost:7233 | Temporal server address |
| `TEMPORAL_NAMESPACE` | Yes | default | Temporal namespace |
| `TEMPORAL_TASK_QUEUE` | Yes | - | Task queue name for workers |
| `MAX_WORKERS` | No | 10 | Maximum concurrent workflow/activity executions |
| `TEMPORAL_API_KEY` | No | - | API key for cloud authentication |
| `TEMPORAL_CLIENT_CERT_PATH` | No* | - | Path to client certificate |
| `TEMPORAL_CLIENT_KEY_PATH` | No* | - | Path to client private key |

\* Required for Temporal Cloud with certificate-based auth

## Environment-Specific Configurations

### Development (.env)

```bash
NODE_ENV=development
APP_NAME='Node_API_Dev'
PORT=3015
THROTTLE_LIMIT=9999
TZ='Asia/Kolkata'

FS_PATH=/Users/darshit/dev/storage

SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_IGNORETLS=true

PG_DB="postgres://postgres:postgres@localhost:5432/temporalapi_dev"

TEMPORAL_ADDRESS=localhost:7233
TEMPORAL_NAMESPACE=default
TEMPORAL_TASK_QUEUE=dev-queue
MAX_WORKERS=5
```

### Staging (.env.staging)

```bash
NODE_ENV=production
APP_NAME='Node_API_Staging'
PORT=3015
THROTTLE_LIMIT=1500
TZ='UTC'

FS_PATH=/var/app/storage

SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_AUTH_USER=apikey
SMTP_AUTH_PASS=${SENDGRID_API_KEY}

PG_DB="postgres://staginguser:${DB_PASSWORD}@staging-db.internal:5432/temporalapi_staging?sslmode=require"

TEMPORAL_ADDRESS=staging-namespace.a2c3z.tmprl.cloud:7233
TEMPORAL_NAMESPACE=staging-namespace.a2c3z
TEMPORAL_TASK_QUEUE=staging-queue
MAX_WORKERS=10
TEMPORAL_CLIENT_CERT_PATH=/app/certs/staging-client.pem
TEMPORAL_CLIENT_KEY_PATH=/app/certs/staging-client-key.pem
```

### Production (.env.production)

```bash
NODE_ENV=production
APP_NAME='Node_API'
PORT=3015
THROTTLE_LIMIT=1500
TZ='UTC'

FS_PATH=/var/app/storage

SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_AUTH_USER=apikey
SMTP_AUTH_PASS=${SENDGRID_API_KEY}

PG_DB="postgres://produser:${DB_PASSWORD}@prod-db.internal:5432/temporalapi?sslmode=require"

TEMPORAL_ADDRESS=prod-namespace.a2c3z.tmprl.cloud:7233
TEMPORAL_NAMESPACE=prod-namespace.a2c3z
TEMPORAL_TASK_QUEUE=production-queue
MAX_WORKERS=20
TEMPORAL_CLIENT_CERT_PATH=/app/certs/client.pem
TEMPORAL_CLIENT_KEY_PATH=/app/certs/client-key.pem
```

## Security Best Practices

### DO NOT Commit Secrets

Add to `.gitignore`:

```
.env
.env.local
.env.*.local
.env.production
.env.staging
*.pem
*.key
*.crt
certs/
```

### Use Secrets Management

**AWS Secrets Manager:**

```bash
# Store secret
aws secretsmanager create-secret \
  --name /myapp/db/password \
  --secret-string "super-secret-password"

# Retrieve in app (use AWS SDK)
const password = await getSecret('/myapp/db/password');
```

**HashiCorp Vault:**

```bash
# Store secret
vault kv put secret/myapp/db password="super-secret"

# Retrieve
vault kv get -field=password secret/myapp/db
```

**Environment Variables from Secrets:**

```bash
# Load from secrets manager in startup script
export PG_DB=$(aws secretsmanager get-secret-value --secret-id db-connection --query SecretString --output text)
export TEMPORAL_API_KEY=$(vault kv get -field=api-key secret/temporal)

# Start app
npm start
```

### Generate Secure Passwords

```bash
# Generate random password
openssl rand -base64 32

# Generate API key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Troubleshooting

### Database Connection Issues

**Problem:** `ECONNREFUSED` or connection timeout

**Solutions:**
1. Verify PostgreSQL is running:
```bash
pg_isready -h localhost -p 5432
```

2. Test connection string:
```bash
psql "postgres://postgres:postgres@localhost:5432/temporalapi" -c "SELECT 1;"
```

3. Check credentials:
```bash
# List databases
psql -U postgres -l

# Connect to database
psql -U postgres -d temporalapi
```

4. Check special characters in password:
```bash
# URL encode the password
# Example: P@ss#123 becomes P%40ss%23123
PG_DB="postgres://user:P%40ss%23123@localhost:5432/db"
```

### Temporal Cloud Connection Issues

**Problem:** `Error: connect ECONNREFUSED` or timeout

**Solutions:**
1. Verify address format:
```bash
# Correct format
TEMPORAL_ADDRESS=namespace.account-id.tmprl.cloud:7233
```

2. Check certificates:
```bash
# Verify certificate files exist and are readable
ls -la /path/to/certs/
cat /path/to/certs/client.pem
```

3. Test connectivity:
```bash
# Check if port 7233 is accessible
telnet namespace.account-id.tmprl.cloud 7233
```

4. Verify firewall allows outbound connections on port 7233

### Email Not Sending

**Problem:** Emails not being sent or received

**Solutions:**
1. Check SMTP credentials:
```bash
# Test SMTP connection
telnet smtp.gmail.com 587
```

2. For Gmail, use App Password (not account password):
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate app password
   - Use that as `SMTP_AUTH_PASS`

3. Check SMTP logs in your application

4. Use MailHog for local testing:
```bash
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

### Environment Variables Not Loading

**Problem:** Variables showing as `undefined`

**Solutions:**
1. Verify `.env` file location (must be in project root)
2. Check file name is exactly `.env` (not `.env.txt`)
3. Ensure dotenv is loaded:
```javascript
require('dotenv').config(); // CommonJS
// or
import 'dotenv/config'; // ES Modules
```

4. Check for syntax errors in `.env`:
```bash
# No spaces around =
CORRECT=value
WRONG = value

# Quotes for values with spaces
APP_NAME='My App'
```

## Complete Example Configuration

Here's a complete `.env.example` for reference:

```bash
# ===================================================================
# NODE SERVER CONFIGURATION
# ===================================================================
NODE_ENV=development
APP_NAME='Node_API'
PORT=3015
THROTTLE_LIMIT=1500
PREFIX=http://
DOMAIN=api.test
TZ='Asia/Kolkata'

# ===================================================================
# FILE STORAGE
# ===================================================================
FS_PATH=/Users/darshit/nfs/api

# ===================================================================
# EMAIL/SMTP CONFIGURATION
# ===================================================================
SMTP_HOST=localhost
SMTP_SECURE=false
SMTP_IGNORETLS=true
SMTP_PORT=1025
SMTP_USER=notifications@api.test
SMTP_AUTH_USER=api/api-dev
SMTP_AUTH_PASS='sfsff'

# ===================================================================
# POSTGRESQL DATABASE
# ===================================================================
PG_DB="postgres://postgres:postgres@localhost:5432/temporalapi"

# ===================================================================
# TEMPORAL WORKFLOW ORCHESTRATION
# ===================================================================
# For local: localhost:7233, default
# For cloud: your-namespace.account-id.tmprl.cloud:7233, your-namespace.account-id
TEMPORAL_ADDRESS=localhost:7233
TEMPORAL_NAMESPACE=default
TEMPORAL_TASK_QUEUE=loan-underwriter-queue
MAX_WORKERS=10

# Optional for Temporal Cloud
# TEMPORAL_API_KEY=your-api-key-here
# TEMPORAL_CLIENT_CERT_PATH=/path/to/client.pem
# TEMPORAL_CLIENT_KEY_PATH=/path/to/client-key.pem
```

## Next Steps

- [Quick Start](./quick-start.md) - Set up your environment
- [Adding New Resources](./adding-new-resource.md) - Build your first API
- [Features](./features.md) - Explore all capabilities
