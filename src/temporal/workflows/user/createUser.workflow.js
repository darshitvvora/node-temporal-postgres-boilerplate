/**
 * Create User workflow
 * This workflow orchestrates the user creation process:
 * 1. Check for duplicate users by mobile number (fraud detection)
 * 2. Create user in database if no duplicate found
 */
import { log, proxyActivities } from '@temporalio/workflow';
import { defaultActivityTimeout } from '../../config.js';

const activities = proxyActivities({
  startToCloseTimeout: defaultActivityTimeout,
});

/**
 * Create User workflow
 * @param {object} userData - User data for creation
 * @param {string} userData.email - User email
 * @param {string} userData.name - User name
 * @param {string} userData.mobile - User mobile number
 * @returns {object} Returns creation result with code, id/message, and user data
 */
async function createUserWorkflow(userData) {
  const { mobile, email } = userData;

  log.info('Starting user creation workflow', { email, mobile });

  // Step 1: Check for duplicate users by mobile number for fraud detection
  log.info('Checking for duplicate users', { mobile });
  const duplicate = await activities.checkDuplicateByMobileActivity(mobile);

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
  const result = await activities.createUserActivity(userData);

  log.info('User creation workflow completed successfully', { userId: result.id, email, mobile });

  return {
    code: 201,
    message: 'Your account created successfully.',
    id: result.id,
    user: result,
  };
}

const _createUserWorkflow = createUserWorkflow;
export { _createUserWorkflow as createUserWorkflow };
