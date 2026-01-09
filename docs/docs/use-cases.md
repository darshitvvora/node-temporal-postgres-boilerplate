---
sidebar_position: 4
---

# Use Cases

This boilerplate excels in scenarios where reliability, scalability, and maintainability are critical. Here are real-world use cases where this architecture shines.

## User Management & Onboarding

### Multi-Step User Registration

**Scenario**: A new user signs up and you need to:
1. Create user in database
2. Send welcome email
3. Create profile in analytics system
4. Provision user resources
5. Send notification to admin

**Without Temporal**:
- If email service is down, user is created but never receives email
- Complex retry logic needed for each step
- State management across failures is manual
- Partial completions leave inconsistent state

**With This Boilerplate**:
```typescript
// Workflow automatically handles retries, state, and failure recovery
export async function userOnboardingWorkflow(userData: UserData) {
  // Each step retries automatically on failure
  const user = await activities.createUser(userData);
  await activities.sendWelcomeEmail(user.email);
  await activities.createAnalyticsProfile(user.id);
  await activities.provisionResources(user.id);
  await activities.notifyAdmin(user.id);
  
  return user;
}
```

**Benefits**:
- Guaranteed completion even with service failures
- Automatic retries with exponential backoff
- Visual monitoring in Temporal UI
- Easy to modify workflow steps

## Payment Processing

### Reliable Payment Workflows

**Scenario**: Process a payment that involves:
1. Validate payment details
2. Charge payment gateway
3. Update order status
4. Send receipt email
5. Update inventory
6. Notify fulfillment system

**Challenge**: Payment gateways can be slow, timeout, or return ambiguous results.

**With This Boilerplate**:
```typescript
export async function paymentWorkflow(orderId: string, paymentDetails: PaymentDetails) {
  // Validate first (fast failure)
  await activities.validatePayment(paymentDetails);
  
  // Charge with idempotency - safe to retry
  const charge = await activities.chargePaymentGateway(orderId, paymentDetails);
  
  // All subsequent steps guaranteed to complete
  await activities.updateOrderStatus(orderId, 'paid');
  await activities.sendReceipt(charge.receiptEmail);
  await activities.updateInventory(orderId);
  await activities.notifyFulfillment(orderId);
  
  return charge;
}
```

**Benefits**:
- Idempotent payment charging (safe retries)
- Guaranteed order consistency
- Audit trail of all steps
- Handles slow or failing external APIs

## Data Processing Pipelines

### ETL and Data Migration

**Scenario**: Import large datasets from external sources:
1. Fetch data from external API (paginated)
2. Transform data format
3. Validate each record
4. Store in database
5. Update search index
6. Generate reports

**With This Boilerplate**:
```typescript
export async function dataImportWorkflow(source: DataSource) {
  const batches = await activities.fetchDataBatches(source);
  
  for (const batch of batches) {
    // Process each batch in parallel activities
    await Promise.all([
      activities.transformAndStore(batch),
      activities.updateSearchIndex(batch),
      activities.validateRecords(batch)
    ]);
  }
  
  await activities.generateReport(source);
}
```

**Benefits**:
- Resume from last successful batch on failure
- Parallel processing of batches
- Progress tracking in Temporal UI
- No data loss on crashes

## Scheduled Tasks & Cron Jobs

### Recurring Business Processes

**Scenario**: Daily/weekly/monthly automated tasks:
- Generate and email daily reports
- Clean up old records
- Sync data with external systems
- Send reminder emails
- Process subscriptions

**With This Boilerplate**:
```typescript
// Schedule workflows using Temporal's cron support
export async function dailyReportWorkflow() {
  const data = await activities.aggregateDailyStats();
  const report = await activities.generateReport(data);
  await activities.emailReport(report);
  await activities.archiveOldReports();
}

// Worker registration with cron schedule
Worker.create({
  workflowsPath: './workflows',
  taskQueue: 'daily-tasks',
  schedules: {
    dailyReport: {
      spec: { cronSchedule: '0 0 * * *' }, // Daily at midnight
      workflow: dailyReportWorkflow
    }
  }
});
```

**Benefits**:
- Reliable execution even with server restarts
- Missed runs catch up automatically
- Easy schedule modifications
- Centralized monitoring

## Microservices Orchestration

### Complex Service Coordination

**Scenario**: Coordinate multiple microservices:
1. Validate request across services
2. Reserve resources in Service A
3. Create record in Service B
4. Update Service C
5. Rollback if any step fails

**With This Boilerplate**:
```typescript
export async function crossServiceWorkflow(request: OrderRequest) {
  let reservation;
  
  try {
    // Validate across services
    await activities.validateWithServiceA(request);
    await activities.validateWithServiceB(request);
    
    // Reserve resources
    reservation = await activities.reserveResources(request);
    
    // Create records
    const recordB = await activities.createInServiceB(request);
    await activities.updateServiceC(recordB.id);
    
    return { success: true, recordId: recordB.id };
    
  } catch (error) {
    // Compensating actions (SAGA pattern)
    if (reservation) {
      await activities.releaseResources(reservation.id);
    }
    throw error;
  }
}
```

**Benefits**:
- Built-in SAGA pattern support
- Automatic rollback handling
- Service failure isolation
- Complete audit trail

## API Rate Limiting & Throttling

### Managing External API Limits

**Scenario**: Integrate with external APIs that have rate limits:
- Third-party APIs: 100 requests/minute
- Need to process 10,000 items
- Must respect rate limits
- Handle API downtime gracefully

**With This Boilerplate**:
```typescript
export async function bulkAPIWorkflow(items: Item[]) {
  const batches = chunk(items, 90); // Stay under rate limit
  
  for (const batch of batches) {
    // Process batch
    const results = await Promise.all(
      batch.map(item => activities.processWithExternalAPI(item))
    );
    
    // Wait before next batch to respect rate limit
    await sleep('1 minute');
  }
  
  return { processed: items.length };
}
```

**Benefits**:
- Automatic rate limit compliance
- Progress preserved across API failures
- Easy to adjust throttling
- No manual queue management

## Long-Running Business Processes

### Approval Workflows

**Scenario**: Multi-stage approval process:
1. Submit request
2. Wait for manager approval (hours/days)
3. Wait for finance approval
4. Wait for executive approval
5. Execute approved action
6. Send notifications

**With This Boilerplate**:
```typescript
export async function approvalWorkflow(request: Request) {
  // Submit request
  await activities.createRequest(request);
  
  // Wait for approvals (can take days)
  const managerApproval = await signals.waitForManagerApproval();
  if (!managerApproval.approved) {
    return { status: 'rejected', reason: managerApproval.reason };
  }
  
  const financeApproval = await signals.waitForFinanceApproval();
  if (!financeApproval.approved) {
    return { status: 'rejected', reason: financeApproval.reason };
  }
  
  // Execute approved action
  await activities.executeApprovedAction(request);
  await activities.notifyAllParties(request);
  
  return { status: 'approved' };
}
```

**Benefits**:
- Workflow can run for days/weeks/months
- State preserved across deployments
- Easy to add/modify approval stages
- Complete audit log

## When to Use This Boilerplate

### Ideal Scenarios

This boilerplate is perfect when you need:

1. **Reliability is Critical**
   - Payment processing
   - Financial transactions
   - User onboarding
   - Data migrations

2. **Complex Orchestration**
   - Multiple external services
   - Multi-step processes
   - Saga patterns
   - Long-running workflows

3. **Scalability Required**
   - High traffic APIs
   - Background job processing
   - Microservices architecture
   - Worker pools

4. **Production-Ready from Day One**
   - Startup MVPs
   - Enterprise applications
   - SaaS platforms
   - E-commerce backends

### When to Consider Alternatives

This boilerplate might be overkill for:

- Simple CRUD applications with no background processing
- Static websites or content management
- Real-time chat applications (use WebSockets instead)
- Simple prototype/demo projects

## Example Projects Built With This

Here are types of applications well-suited to this architecture:

1. **E-commerce Platform**
   - Order processing workflows
   - Payment handling
   - Inventory management
   - Email notifications

2. **SaaS Application**
   - User onboarding
   - Subscription management
   - Billing workflows
   - Feature provisioning

3. **Financial Services**
   - Transaction processing
   - Account reconciliation
   - Fraud detection workflows
   - Reporting pipelines

4. **Healthcare Systems**
   - Patient onboarding
   - Appointment workflows
   - Insurance claim processing
   - Compliance reporting

5. **IoT Platforms**
   - Device provisioning
   - Data collection workflows
   - Alert processing
   - Maintenance scheduling

## Architecture Benefits

### Why Temporal + Express?

**Express.js**: Handles HTTP requests synchronously
- Fast response times
- Traditional REST API
- Easy to understand

**Temporal Workers**: Handle background work asynchronously
- Durable execution
- Automatic retries
- Long-running processes

**Best of Both Worlds**:
- API responds immediately
- Work happens reliably in background
- Scale API and workers independently

## Next Steps

- **[Quick Start](./quick-start.md)** - Build your first workflow
- **[Features](./features.md)** - Explore all features
