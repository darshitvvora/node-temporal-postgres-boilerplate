# Deployment Guide

This guide covers deploying the Node.js API and Temporal Worker services using Docker and Kubernetes.

## Architecture Overview

The application consists of two main services:

1. **API Service** - Express.js REST API with OpenAPI documentation
2. **Worker Service** - Temporal workflow workers that execute background tasks

**Note**: PostgreSQL database and Temporal Server are expected to be deployed separately (managed services or dedicated infrastructure).

## Prerequisites

- Docker 24.0+
- Docker Compose 3.8+ (for local development)
- Kubernetes 1.28+ (for production)
- kubectl configured with cluster access
- Container registry access (Docker Hub, GCR, ECR, etc.)
- External PostgreSQL database
- External Temporal Server (Temporal Cloud or self-hosted)

## Environment Variables

Create a `.env` file based on `sample.env`:

```bash
# Application
NODE_ENV=production
PORT=3015
LOG_LEVEL=info

# Database (external)
DB_HOST=your-postgres-host
DB_NAME=node_api_db
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_PORT=5432

# Temporal (external)
TEMPORAL_ADDRESS=temporal.yournamespace.tmprl.cloud:7233
# or for self-hosted: temporal-server:7233

# Other configs...
```

## Local Development with Docker Compose

### Build and run all services:

```bash
# Build images
docker-compose build

# Start all services (API + Worker + Nginx)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Run individual services:

```bash
# Run only API
docker-compose up -d api

# Run only Worker
docker-compose up -d worker

# Run with nginx reverse proxy
docker-compose up -d api worker nginx
```

### Access the services:

- API (direct): http://localhost:3015
- API (via nginx): http://localhost
- Swagger docs: http://localhost:3015/api-docs
- Health check: http://localhost:3015/health

## Production Deployment with Kubernetes

### 1. Build and Push Docker Images

```bash
# Set your container registry
REGISTRY=your-registry.com
VERSION=v1.0.0

# Build API image
docker build -f Dockerfile.api -t $REGISTRY/node-api:$VERSION --target production .
docker push $REGISTRY/node-api:$VERSION

# Build Worker image
docker build -f Dockerfile.worker -t $REGISTRY/node-api-worker:$VERSION --target production .
docker push $REGISTRY/node-api-worker:$VERSION
```

### 2. Create Kubernetes Secrets

```bash
# Create secret for sensitive data
kubectl create secret generic node-api-secrets \
  --from-literal=DB_PASSWORD=your-db-password \
  --from-literal=DB_HOST=your-postgres-host \
  --from-literal=TEMPORAL_ADDRESS=temporal.yournamespace.tmprl.cloud:7233

# Verify secret
kubectl get secrets node-api-secrets
```

### 3. Update Kubernetes Manifests

Edit `k8s-deployment.yaml`:

1. Replace `your-registry/node-api:latest` with your actual image
2. Replace `your-registry/node-api-worker:latest` with your actual image
3. Update `api.yourdomain.com` with your actual domain
4. Adjust resource limits based on your needs
5. Update namespace if not using `default`

### 4. Apply Kubernetes Manifests

```bash
# Create namespace (optional)
kubectl create namespace node-api

# Apply all manifests
kubectl apply -f k8s-deployment.yaml

# Check deployment status
kubectl get pods -l app=node-api
kubectl get services -l app=node-api
kubectl get ingress node-api-ingress
```

### 5. Verify Deployments

```bash
# Check API pods
kubectl get pods -l component=api
kubectl logs -f deployment/node-api-service

# Check Worker pods
kubectl get pods -l component=worker
kubectl logs -f deployment/node-api-worker

# Check API service
kubectl get service node-api-service

# Check ingress
kubectl describe ingress node-api-ingress
```

### 6. Database Migrations

Run migrations as a Kubernetes Job:

```bash
# Create migration job
kubectl create job db-migration --image=$REGISTRY/node-api:$VERSION \
  -- npm run migrate

# Check job status
kubectl get jobs
kubectl logs job/db-migration
```

## Nginx Configuration

The nginx configuration handles:

- **Rate limiting**: 100 req/s per IP with burst of 20
- **Health checks**: `/health` endpoint for Kubernetes probes
- **SSL/TLS**: TLS 1.2/1.3 with modern ciphers
- **Security headers**: HSTS, X-Frame-Options, X-XSS-Protection
- **WebSocket support**: For real-time features (if needed)

### For Docker Compose:

The nginx service automatically uses `api:3015` as the upstream.

### For Kubernetes:

Update nginx configuration to use Kubernetes service DNS:

```nginx
upstream api_backend {
  server node-api-service.default.svc.cluster.local:3015;
}
```

Or use Kubernetes Ingress (recommended) instead of nginx deployment.

## Scaling

### Horizontal Scaling

**API Service** (scales with traffic):

```bash
# Manual scaling
kubectl scale deployment node-api-service --replicas=5

# Auto-scaling is configured via HPA (3-10 replicas)
kubectl get hpa node-api-hpa
```

**Worker Service** (scales with workflow volume):

```bash
# Manual scaling
kubectl scale deployment node-api-worker --replicas=4

# Temporal workers can be scaled based on:
# - Number of workflows
# - Activity execution time
# - Resource utilization
```

### Vertical Scaling

Update resource limits in `k8s-deployment.yaml`:

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "200m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

## Monitoring and Health Checks

### API Health Check

```bash
# Local
curl http://localhost:3015/health

# Kubernetes
kubectl exec -it deployment/node-api-service -- wget -qO- http://localhost:3015/health
```

### Kubernetes Probes

The API service has three types of probes:

1. **Liveness Probe**: Restarts pod if unhealthy
2. **Readiness Probe**: Removes pod from service if not ready
3. **Startup Probe**: Allows slow startup (up to 300s)

### Worker Health

Workers don't have HTTP health checks. Temporal Server monitors worker health via:

- Heartbeat mechanism
- Task polling activity
- Worker registration status

Check worker status in Temporal Web UI or CLI:

```bash
tctl --namespace default task-queue describe user
```

## Troubleshooting

### API not responding

```bash
# Check pods
kubectl get pods -l component=api
kubectl describe pod <pod-name>

# Check logs
kubectl logs -f deployment/node-api-service

# Check service
kubectl get endpoints node-api-service
```

### Worker not processing workflows

```bash
# Check worker logs
kubectl logs -f deployment/node-api-worker

# Verify Temporal connection
kubectl exec -it deployment/node-api-worker -- env | grep TEMPORAL

# Check if workers are registered
tctl task-queue describe user
```

### Database connection issues

```bash
# Test database connectivity from pod
kubectl exec -it deployment/node-api-service -- sh
apk add postgresql-client
psql -h $DB_HOST -U $DB_USER -d $DB_NAME
```

### Nginx returning 502/504

```bash
# Check nginx logs
docker-compose logs nginx
# or
kubectl logs deployment/nginx

# Verify upstream is healthy
curl http://api:3015/health  # from nginx container
```

## Security Best Practices

1. **Use non-root user**: Dockerfiles run as user `nodejs (1001)`
2. **Secrets management**: Use Kubernetes Secrets, never commit secrets
3. **Network policies**: Restrict pod-to-pod communication
4. **Resource limits**: Prevent resource exhaustion
5. **Image scanning**: Scan images for vulnerabilities
6. **SSL/TLS**: Always use HTTPS in production
7. **Rate limiting**: Protect against DDoS attacks

## CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build and push API
        run: |
          docker build -f Dockerfile.api -t $REGISTRY/node-api:$VERSION .
          docker push $REGISTRY/node-api:$VERSION

      - name: Build and push Worker
        run: |
          docker build -f Dockerfile.worker -t $REGISTRY/node-api-worker:$VERSION .
          docker push $REGISTRY/node-api-worker:$VERSION

      - name: Deploy to Kubernetes
        run: |
          kubectl apply -f k8s-deployment.yaml
          kubectl rollout status deployment/node-api-service
```

## Rollback

```bash
# View rollout history
kubectl rollout history deployment/node-api-service

# Rollback to previous version
kubectl rollout undo deployment/node-api-service

# Rollback to specific revision
kubectl rollout undo deployment/node-api-service --to-revision=2
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Secrets created in Kubernetes
- [ ] Images built and pushed to registry
- [ ] Resource limits configured appropriately
- [ ] SSL/TLS certificates configured
- [ ] DNS records pointing to ingress
- [ ] Monitoring and alerting set up
- [ ] Log aggregation configured
- [ ] Backup strategy for database
- [ ] Disaster recovery plan documented
- [ ] Load testing performed

## Support

For issues or questions:
- GitHub Issues: https://github.com/your-repo/issues
- Documentation: See README.md and API_DOCUMENTATION.md
