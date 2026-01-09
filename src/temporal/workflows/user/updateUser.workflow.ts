/**
 * Update User workflow
 * This workflow orchestrates the user update process with a single activity
 */
import { proxyActivities } from '@temporalio/workflow';
import { defaultActivityTimeout } from '../../config.js';
import type * as activities from '../../activities/index.js';

const { updateUserActivity } = proxyActivities<typeof activities.user>({
  startToCloseTimeout: defaultActivityTimeout,
});

interface UpdateParams {
  id: number;
  userData: Record<string, any>;
}

interface WorkflowResult {
  code: number;
  success: boolean;
  id: number;
}

/**
 * Update User workflow
 * @param params - Update parameters
 * @param params.id - User ID to update
 * @param params.userData - User data to update
 * @returns Returns update result with code and success status
 */
async function updateUserWorkflow({ id, userData }: UpdateParams): Promise<WorkflowResult> {
  // Execute the update activity
  const result = await updateUserActivity({ id, userData });

  return {
    code: 200,
    success: result.success,
    id: result.id,
  };
}

export { updateUserWorkflow };
