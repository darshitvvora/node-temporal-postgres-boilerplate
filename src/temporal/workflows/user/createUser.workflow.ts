/**
 * Create User workflow
 * This workflow orchestrates the user creation process:
 * 1. Check for duplicate users by mobile number (fraud detection)
 * 2. Create user in database if no duplicate found
 */
import { log, proxyActivities } from '@temporalio/workflow';
import { defaultActivityTimeout } from '../../config.js';
import type * as activities from '../../activities/index.js';

const { checkDuplicateByMobileActivity, createUserActivity } = proxyActivities<typeof activities.user>({
  startToCloseTimeout: defaultActivityTimeout,
});

interface UserData {
  email: string;
  name: string;
  mobile: string;
}

interface WorkflowResult {
  code: number;
  message: string;
  id?: number;
  user?: any;
}

/**
 * Create User workflow
 * @param userData - User data for creation
 * @param userData.email - User email
 * @param userData.name - User name
 * @param userData.mobile - User mobile number
 * @returns Returns creation result with code, id/message, and user data
 */
async function createUserWorkflow(userData: UserData): Promise<WorkflowResult> {
  const { mobile, email } = userData;

  log.info('Starting user creation workflow', { email, mobile });

  // Step 1: Check for duplicate users by mobile number for fraud detection
  log.info('Checking for duplicate users', { mobile });
  const duplicate = await checkDuplicateByMobileActivity(mobile);

  if (duplicate) {
    log.warn('Duplicate user detected, aborting workflow', { mobile, duplicateId: duplicate.id });
    return {
      code: 409,
      id: duplicate.id,
      message: 'Duplicate mobile number found. Possible fraud.',
    };
  }

  // Step 2: Create user in database
  log.info('No duplicate found, creating user', { email, mobile });
  const result = await createUserActivity(userData);

  log.info('User creation workflow completed successfully', { userId: result.id, email, mobile });

  return {
    code: 201,
    message: 'Your account created successfully.',
    id: result.id,
    user: result,
  };
}

export { createUserWorkflow };
