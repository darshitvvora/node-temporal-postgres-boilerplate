# Temporal Workflows Guide

This guide explains how to use Temporal workflows in this boilerplate for building reliable, distributed applications.

## What is Temporal?

Temporal is a durable execution platform that ensures your application's workflows run to completion, even in the face of failures. It provides:

- **Automatic retries** - Failed activities are automatically retried
- **Durable execution** - Workflow state persists across failures
- **Visibility** - Track all workflow executions in Temporal UI
- **Scalability** - Scale workers independently of API servers

## Architecture

```
┌─────────────┐
│   Client    │ (API Controller)
└──────┬──────┘
       │ 1. Start Workflow
       ▼
┌─────────────┐
│  Temporal   │
│   Server    │
└──────┬──────┘
       │ 2. Queue Task
       ▼
┌─────────────┐
│   Worker    │ (Polls for tasks)
└──────┬──────┘
       │ 3. Execute Activity
       ▼
┌─────────────┐
│  Database   │
└─────────────┘
```

## Project Structure

```
src/temporal/
├── activities/
│   └── user/
│       └── activities.js       # Database operations
├── workflows/
│   └── user/
│       ├── createUser.workflow.js
│       ├── updateUser.workflow.js
│       ├── getUser.workflow.js
│       ├── getAllUsers.workflow.js
│       └── index.js            # Workflow registry
├── clients/
│   └── user.client.js          # Start workflows from API
└── workers/
    └── user.worker.js          # Worker process
```

## Quick Start

### 1. Start Temporal Server (Local Development)

```bash
# Using Docker
docker run -d -p 7233:7233 -p 8233:8233 temporalio/auto-setup:latest

# Access Temporal Web UI
open http://localhost:8233
```

### 2. Start the Worker

```bash
npm run start:worker:user
```

### 3. Start the API

```bash
npm start
```

### 4. Test a Workflow

```bash
# Create a user (triggers createUser workflow)
curl -X POST http://localhost:3015/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","mobile":"1234567890"}'
```

Check the workflow execution in Temporal UI at http://localhost:8233

## Creating a New Workflow

Let's create a workflow to send a welcome email when a user is created.

### Step 1: Create the Activity

Activities contain the actual business logic (database operations, API calls, etc.).

**File**: `src/temporal/activities/user/activities.js`

```javascript
export async function sendWelcomeEmailActivity({ userId, email, name }) {
  // Your email sending logic here
  console.log(`Sending welcome email to ${email}`);

  // Example: call email service
  await emailService.send({
    to: email,
    subject: 'Welcome!',
    template: 'welcome',
    data: { name }
  });

  return { success: true, userId, email };
}
```

### Step 2: Create the Workflow

Workflows orchestrate activities and define the execution logic.

**File**: `src/temporal/workflows/user/sendWelcomeEmail.workflow.js`

```javascript
import { proxyActivities } from '@temporalio/workflow';

const activities = proxyActivities({
  startToCloseTimeout: '1 minute',
});

async function sendWelcomeEmailWorkflow({ userId, email, name }) {
  try {
    // Execute the activity
    const result = await activities.sendWelcomeEmailActivity({
      userId,
      email,
      name,
    });

    return {
      code: 200,
      success: true,
      message: 'Welcome email sent',
      ...result,
    };
  } catch (error) {
    // Temporal will automatically retry on failure
    return {
      code: 500,
      success: false,
      message: 'Failed to send welcome email',
      error: error.message,
    };
  }
}

export { sendWelcomeEmailWorkflow };
```

### Step 3: Register the Workflow

**File**: `src/temporal/workflows/user/index.js`

```javascript
export { createUserWorkflow } from './createUser.workflow.js';
export { updateUserWorkflow } from './updateUser.workflow.js';
export { getUserWorkflow } from './getUser.workflow.js';
export { getAllUsersWorkflow } from './getAllUsers.workflow.js';
export { sendWelcomeEmailWorkflow } from './sendWelcomeEmail.workflow.js'; // Add this
```

### Step 4: Create Client Function

**File**: `src/temporal/clients/user.client.js`

```javascript
async function startSendWelcomeEmail({ userId, email, name }) {
  const client = await getClient();
  const workflowId = `send-welcome-email-${userId}-${Date.now()}`;

  const handle = await client.workflow.start('sendWelcomeEmailWorkflow', {
    args: [{ userId, email, name }],
    taskQueue: USER_QUEUE,
    workflowId,
  });

  return handle.result();
}

export {
  startCreateUser,
  startUpdateUser,
  startGetUser,
  startGetAllUsers,
  startSendWelcomeEmail, // Add this
};
```

### Step 5: Use in Controller

**File**: `src/api/user/user.controller.js`

```javascript
import * as userClient from '../../temporal/clients/user.client.js';

async function create(req, res, next) {
  try {
    const userData = req.body;

    // Create user via workflow
    const result = await userClient.startCreateUser(userData);

    if (result.code === 201) {
      // Send welcome email asynchronously (fire and forget)
      userClient.startSendWelcomeEmail({
        userId: result.id,
        email: userData.email,
        name: userData.name,
      }).catch(err => console.error('Welcome email failed:', err));

      return res.status(201).json(result);
    }

    return res.status(result.code).json(result);
  } catch (error) {
    next(error);
  }
}
```

## Workflow Patterns

### 1. Simple Activity Execution

```javascript
async function simpleWorkflow(input) {
  const result = await activities.doSomething(input);
  return result;
}
```

### 2. Sequential Activities

```javascript
async function sequentialWorkflow(input) {
  const step1 = await activities.firstStep(input);
  const step2 = await activities.secondStep(step1);
  const step3 = await activities.thirdStep(step2);
  return step3;
}
```

### 3. Parallel Activities

```javascript
async function parallelWorkflow(input) {
  const [result1, result2, result3] = await Promise.all([
    activities.task1(input),
    activities.task2(input),
    activities.task3(input),
  ]);

  return { result1, result2, result3 };
}
```

### 4. Saga Pattern (Compensating Transactions)

```javascript
async function sagaWorkflow(order) {
  try {
    // Reserve inventory
    await activities.reserveInventory(order);

    // Charge payment
    await activities.chargePayment(order);

    // Ship order
    await activities.shipOrder(order);

    return { success: true };
  } catch (error) {
    // Compensate (rollback)
    await activities.releaseInventory(order);
    await activities.refundPayment(order);
    throw error;
  }
}
```

### 5. Delayed Execution (Timers)

```javascript
import { sleep } from '@temporalio/workflow';

async function delayedWorkflow(input) {
  // Wait for 1 hour
  await sleep('1 hour');

  // Execute activity after delay
  return await activities.doSomething(input);
}
```

### 6. Child Workflows

```javascript
import { startChild } from '@temporalio/workflow';

async function parentWorkflow(input) {
  const child = await startChild('childWorkflow', {
    args: [input],
    taskQueue: 'user',
  });

  const result = await child.result();
  return result;
}
```

## Activity Options

Configure activity behavior with options:

```javascript
const activities = proxyActivities({
  startToCloseTimeout: '5 minutes',  // Max execution time
  scheduleToCloseTimeout: '1 hour',  // Including retries
  retry: {
    initialInterval: '1s',           // First retry after 1 second
    backoffCoefficient: 2,           // Double delay each retry
    maximumInterval: '1 minute',     // Max delay between retries
    maximumAttempts: 5,              // Max retry count
  },
});
```

## Worker Configuration

**File**: `src/temporal/workers/user.worker.js`

```javascript
import { Worker } from '@temporalio/worker';
import * as activities from '../activities/user/activities.js';
import * as workflows from '../workflows/user/index.js';

async function run() {
  const worker = await Worker.create({
    workflowsPath: './src/temporal/workflows/user/index.js',
    activities,
    taskQueue: 'user',
    maxConcurrentActivityTaskExecutions: 10,      // Parallel activities
    maxConcurrentWorkflowTaskExecutions: 100,     // Parallel workflows
  });

  await worker.run();
}

run().catch((err) => {
  console.error('Worker failed:', err);
  process.exit(1);
});
```

## Testing Workflows

**File**: `tests/integration/temporal/user.workflow.test.js`

```javascript
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { TestWorkflowEnvironment } from '@temporalio/testing';
import { createUserWorkflow } from '../../../src/temporal/workflows/user/createUser.workflow.js';
import * as activities from '../../../src/temporal/activities/user/activities.js';

describe('User Workflows', () => {
  let testEnv;

  before(async () => {
    testEnv = await TestWorkflowEnvironment.createLocal();
  });

  after(async () => {
    await testEnv?.teardown();
  });

  it('should create a user successfully', async () => {
    const { client } = testEnv;

    const handle = await client.workflow.start('createUserWorkflow', {
      args: [{
        name: 'Test User',
        email: 'test@example.com',
        mobile: '1234567890',
      }],
      taskQueue: 'test',
      workflowId: `test-${Date.now()}`,
    });

    const result = await handle.result();
    expect(result.code).to.equal(201);
    expect(result.success).to.be.true;
  });
});
```

## Monitoring Workflows

### Temporal Web UI

Access at http://localhost:8233 (local) or your Temporal Cloud URL

- View all workflow executions
- See workflow history and events
- Retry failed workflows
- Cancel running workflows

### Using tctl (Temporal CLI)

```bash
# List workflows
tctl workflow list

# Describe a workflow
tctl workflow describe --workflow_id=create-user-123

# Show workflow history
tctl workflow show --workflow_id=create-user-123

# Terminate a workflow
tctl workflow terminate --workflow_id=create-user-123

# Describe task queue
tctl task-queue describe --task-queue=user
```

## Best Practices

### 1. Keep Workflows Deterministic

❌ **Bad** - Non-deterministic:
```javascript
async function badWorkflow() {
  const random = Math.random();  // Non-deterministic!
  const now = new Date();        // Non-deterministic!

  if (random > 0.5) {
    await activities.doSomething();
  }
}
```

✅ **Good** - Deterministic:
```javascript
async function goodWorkflow(input) {
  // Use workflow-safe APIs
  const random = Math.random(); // OK in workflow context

  if (input.shouldExecute) {
    await activities.doSomething();
  }
}
```

### 2. Keep Activities Idempotent

Activities may be retried, so ensure they can safely run multiple times:

```javascript
export async function createUserActivity(userData) {
  // Check if user already exists
  const existing = await User.findOne({ where: { email: userData.email } });

  if (existing) {
    return { id: existing.id, alreadyExists: true };
  }

  // Create user if doesn't exist
  const user = await User.create(userData);
  return { id: user.id, alreadyExists: false };
}
```

### 3. Use Descriptive Workflow IDs

```javascript
// Good - easy to track
const workflowId = `create-user-${email}-${Date.now()}`;

// Bad - hard to identify
const workflowId = `workflow-${uuid()}`;
```

### 4. Handle Errors Gracefully

```javascript
async function robustWorkflow(input) {
  try {
    const result = await activities.riskyOperation(input);
    return { success: true, result };
  } catch (error) {
    // Log to workflow history
    console.error('Operation failed:', error.message);

    // Return error instead of throwing
    return { success: false, error: error.message };
  }
}
```

### 5. Use Signals for External Updates

```javascript
import { setHandler, condition } from '@temporalio/workflow';

async function orderWorkflow(orderId) {
  let orderCancelled = false;

  // Set up signal handler
  setHandler('cancelOrder', () => {
    orderCancelled = true;
  });

  // Wait for payment
  await activities.waitForPayment(orderId);

  // Check if cancelled
  if (orderCancelled) {
    await activities.refundOrder(orderId);
    return { cancelled: true };
  }

  // Process order
  await activities.processOrder(orderId);
  return { cancelled: false };
}

// Send signal from client
await handle.signal('cancelOrder');
```

## Common Issues

### Issue 1: Worker Not Processing Tasks

**Symptom**: Workflows stay in "Running" state but never complete

**Solution**:
```bash
# Check if worker is running
ps aux | grep worker

# Check worker logs
npm run start:worker:user

# Verify task queue name matches
# Client: taskQueue: 'user'
# Worker: taskQueue: 'user'
```

### Issue 2: Activity Timeouts

**Symptom**: Activities fail with "TIMEOUT" error

**Solution**:
```javascript
// Increase timeout for long-running activities
const activities = proxyActivities({
  startToCloseTimeout: '10 minutes', // Increase this
});
```

### Issue 3: Workflow Stuck in Retry Loop

**Symptom**: Workflow keeps retrying indefinitely

**Solution**:
```javascript
// Add maximum attempts
const activities = proxyActivities({
  retry: {
    maximumAttempts: 3, // Stop after 3 attempts
  },
});
```

## Production Considerations

### 1. Temporal Cloud vs Self-Hosted

- **Temporal Cloud** (Recommended): Fully managed, highly available
- **Self-Hosted**: More control, requires infrastructure management

### 2. Worker Scaling

```bash
# Scale workers based on load
kubectl scale deployment node-api-worker --replicas=5
```

### 3. Resource Limits

Set appropriate memory/CPU for workers:

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "200m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### 4. Monitoring

- Set up alerts for failed workflows
- Monitor worker health and task queue backlog
- Track workflow execution times

## Migration from Direct Database Calls

### Before (Direct DB):

```javascript
async function create(req, res, next) {
  const user = await User.create(req.body);
  res.status(201).json(user);
}
```

### After (With Temporal):

```javascript
async function create(req, res, next) {
  const result = await userClient.startCreateUser(req.body);
  res.status(result.code).json(result);
}
```

### Benefits:

1. ✅ Automatic retries on failure
2. ✅ Full execution history and visibility
3. ✅ Can handle long-running operations
4. ✅ Better error handling and recovery
5. ✅ Scalable worker pool

## Additional Resources

- [Temporal Documentation](https://docs.temporal.io/)
- [Temporal Node.js SDK](https://docs.temporal.io/dev-guide/typescript)
- [Temporal Samples](https://github.com/temporalio/samples-typescript)
- [Temporal Community Forum](https://community.temporal.io/)
- [Temporal Web UI Guide](https://docs.temporal.io/web-ui)

## Need Help?

- Check Temporal logs: `docker logs temporal-server` (local)
- Check worker logs: `npm run start:worker:user`
- Visit Temporal Web UI: http://localhost:8233
- Check this project's GitHub issues
