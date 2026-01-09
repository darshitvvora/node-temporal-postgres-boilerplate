/**
 * Get User workflow
 * This workflow retrieves a single user by ID using one activity
 */
import { proxyActivities } from '@temporalio/workflow';
import { defaultActivityTimeout } from '../../config.js';
import type * as activities from '../../activities/index.js';

const { getUserActivity } = proxyActivities<typeof activities.user>({
  startToCloseTimeout: defaultActivityTimeout,
});

interface WorkflowResult {
  code: number;
  message?: string;
  user: any;
}

/**
 * Get User workflow
 * @param id - User ID to retrieve
 * @returns Returns user data with code and user object
 */
async function getUserWorkflow(id: number): Promise<WorkflowResult> {
  // Execute the get user activity
  const user = await getUserActivity(id);

  if (!user) {
    return {
      code: 404,
      message: 'User not found',
      user: null,
    };
  }

  return {
    code: 200,
    user,
  };
}

export { getUserWorkflow };
