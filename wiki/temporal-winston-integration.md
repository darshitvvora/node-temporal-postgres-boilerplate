# Temporal + Winston Logger Integration

This document explains how Winston logger is integrated with Temporal.io in this project.

## Architecture Overview

The integration uses two separate logging contexts:

### 1. **Workflow Logs** (Temporal Native)
- Uses `@temporalio/workflow`'s native `log` API
- Replay-safe and designed for deterministic workflows
- Automatically captured in Temporal's workflow history
- **Location**: Inside workflow files

### 2. **Worker & Activity Logs** (Winston)
- Uses Winston logger for activities and worker operations
- Rich structured logging with file rotation
- Separate logs for errors and combined output
- **Location**: Activities, workers, and non-workflow code

## Why This Separation?

Temporal workflows must be **deterministic** and **replay-safe**. Using external loggers directly in workflows would break determinism. Therefore:

- ✅ **Workflows**: Use Temporal's `log` from `@temporalio/workflow`
- ✅ **Activities**: Use Winston logger freely
- ✅ **Workers**: Use Winston logger
- ❌ **Don't**: Import Winston or any I/O library in workflow files

## Implementation Details

### Winston Logger Setup

File: [src/utils/logger.js](../src/utils/logger.js)

```javascript
import { format, transports, createLogger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = createLogger({
  transports: [
    // Error logs only
    new DailyRotateFile({
      filename: 'logs/error.%DATE%.log',
      level: 'error',
    }),
    // All logs
    new DailyRotateFile({
      filename: 'logs/combined.%DATE%.log',
    }),
    // Console output (development)
    new transports.Console(),
  ],
});
```

### Temporal Logger Adapter

File: [src/utils/temporal-logger.js](../src/utils/temporal-logger.js)

This adapter bridges Temporal's logging interface with Winston:

```javascript
export class WinstonTemporalLogger {
  trace(message, attrs) { logger.debug(message, attrs); }
  debug(message, attrs) { logger.debug(message, attrs); }
  info(message, attrs) { logger.info(message, attrs); }
  warn(message, attrs) { logger.warn(message, attrs); }
  error(message, attrs) { logger.error(message, attrs); }
}
```

### Worker Configuration

File: [src/temporal/workers/user.worker.js](../src/temporal/workers/user.worker.js)

The worker is configured with the Winston logger adapter:

```javascript
import { createTemporalLogger } from '../../utils/temporal-logger.js';
import logger from '../../utils/logger.js';

const temporalLogger = createTemporalLogger({
  component: 'temporal-worker',
  taskQueue: USER_QUEUE,
});

const worker = await Worker.create({
  workflowsPath: join(__dirname, '../workflows/user'),
  activities,
  taskQueue: USER_QUEUE,
  sinks: {
    logger: temporalLogger,
  },
});

logger.info(`Temporal worker starting on task queue: ${USER_QUEUE}`);
```

## Usage Examples

### In Workflows (Temporal Native Logging)

File: [src/temporal/workflows/user/createUser.workflow.js](../src/temporal/workflows/user/createUser.workflow.js)

```javascript
import { log, proxyActivities } from '@temporalio/workflow';

async function createUserWorkflow(userData) {
  log.info('Starting user creation workflow', { email: userData.email });

  const duplicate = await activities.checkDuplicateByMobileActivity(userData.mobile);

  if (duplicate) {
    log.warn('Duplicate user detected', { mobile: userData.mobile });
    return { code: 409, message: 'Duplicate found' };
  }

  log.info('Creating user', { email: userData.email });
  const result = await activities.createUserActivity(userData);

  log.info('User created successfully', { userId: result.id });
  return result;
}
```

**Key Points:**
- Import `log` from `@temporalio/workflow`
- Use `log.info()`, `log.warn()`, `log.error()`, etc.
- Logs are visible in Temporal UI
- Logs are replay-safe

### In Activities (Winston Logger)

File: [src/temporal/activities/user/activities.js](../src/temporal/activities/user/activities.js)

```javascript
import logger from '../../../utils/logger.js';
import db from '../../../db/index.js';

export async function createUserActivity(userData) {
  logger.info('Creating new user', { email: userData.email, mobile: userData.mobile });

  try {
    const user = await db.User.create(userData);
    logger.info('User created successfully', { userId: user.id });
    return user;
  } catch (error) {
    logger.error('Failed to create user', { error: error.message });
    throw error;
  }
}
```

**Key Points:**
- Import Winston logger directly
- Use structured logging with metadata objects
- Logs go to files and console
- Full error stack traces captured

## Log Output Locations

### File System
- `logs/error.YYYY-MM-DD.log` - Error level logs only
- `logs/combined.YYYY-MM-DD.log` - All log levels
- Rotated daily, kept for 10 days

### Console
- Development: All logs with colors
- Production: Silent (logs to files only)
- Test: Silent

### Temporal UI
- Workflow logs appear in the Temporal Web UI
- Navigate to: Workflows → Select Workflow → History → Logs
- Shows all `log.*()` calls from workflows

## Log Levels

| Level | Temporal | Winston | Usage |
|-------|----------|---------|-------|
| TRACE | ✅ | - | Very detailed debugging |
| DEBUG | ✅ | ✅ | Debugging information |
| INFO  | ✅ | ✅ | General information |
| WARN  | ✅ | ✅ | Warnings |
| ERROR | ✅ | ✅ | Errors |

## Best Practices

### ✅ Do's

1. **Use Temporal's log in workflows**
   ```javascript
   import { log } from '@temporalio/workflow';
   log.info('Workflow step completed');
   ```

2. **Use Winston in activities**
   ```javascript
   import logger from '../../../utils/logger.js';
   logger.info('Activity executed');
   ```

3. **Include contextual metadata**
   ```javascript
   logger.info('User created', { userId, email, timestamp });
   ```

4. **Log errors with full context**
   ```javascript
   logger.error('Database error', { error: error.message, stack: error.stack });
   ```

### ❌ Don'ts

1. **Don't import Winston in workflow files**
   ```javascript
   // ❌ WRONG - This breaks determinism
   import logger from '../../utils/logger.js'; // in workflow file
   ```

2. **Don't use console.log**
   ```javascript
   // ❌ WRONG - Use logger instead
   console.log('User created');
   ```

3. **Don't log sensitive data**
   ```javascript
   // ❌ WRONG
   logger.info('User login', { password: user.password });
   ```

## Monitoring & Debugging

### View Workflow Logs
1. Open Temporal Web UI (default: http://localhost:8233)
2. Navigate to Workflows
3. Click on a workflow execution
4. View logs in the History tab

### View Activity Logs
```bash
# Tail combined logs
tail -f logs/combined.$(date +%Y-%m-%d).log

# Tail error logs only
tail -f logs/error.$(date +%Y-%m-%d).log

# Search for specific user
grep "userId.*12345" logs/combined.$(date +%Y-%m-%d).log
```

## Environment Configuration

Add to your `.env` file:

```bash
# Winston Logger
NODE_ENV=development  # development, production, test
LOG_LEVEL=debug      # debug, info, warn, error

# Temporal
TEMPORAL_MODE=self-hosted
TEMPORAL_ADDRESS=127.0.0.1:7233
TEMPORAL_NAMESPACE=default
```

## Testing

The logger automatically silences output during tests:

```javascript
// In test files
import logger from '../src/utils/logger.js';

describe('User Service', () => {
  it('should create user', async () => {
    logger.info('This will not appear in test output');
    // test code...
  });
});
```

## Troubleshooting

### Logs not appearing in Temporal UI
- Check that you're using `log` from `@temporalio/workflow` in workflow files
- Verify workflow is actually executing
- Check Temporal server is running

### Winston logs not appearing
- Check `NODE_ENV` setting
- Verify `logs/` directory exists and is writable
- Check file permissions

### Performance Issues
- Reduce log verbosity in production
- Increase log rotation frequency
- Use log sampling for high-frequency activities

## Additional Resources

- [Temporal Logging Documentation](https://docs.temporal.io/workflows#logging)
- [Winston Documentation](https://github.com/winstonjs/winston)
- [Temporal Best Practices](https://docs.temporal.io/workflows#best-practices)
