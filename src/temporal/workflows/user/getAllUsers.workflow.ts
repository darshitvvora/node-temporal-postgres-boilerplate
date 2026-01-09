/**
 * Get All Users workflow
 * This workflow retrieves all users with pagination using one activity
 */
import { proxyActivities } from '@temporalio/workflow';
import { defaultActivityTimeout } from '../../config.js';
import type * as activities from '../../activities/index.js';

const { getAllUsersActivity } = proxyActivities<typeof activities.user>({
  startToCloseTimeout: defaultActivityTimeout,
});

interface GetAllUsersParams {
  limit?: number;
  offset?: number;
}

interface WorkflowResult {
  code: number;
  users: any[];
}

/**
 * Get All Users workflow
 * @param params - Pagination parameters
 * @param params.limit - Number of records to retrieve
 * @param params.offset - Number of records to skip
 * @returns Returns users array with code
 */
async function getAllUsersWorkflow({ limit = 100, offset = 0 }: GetAllUsersParams): Promise<WorkflowResult> {
  // Execute the get all users activity
  const users = await getAllUsersActivity({ limit, offset });

  return {
    code: 200,
    users,
  };
}

export { getAllUsersWorkflow };
