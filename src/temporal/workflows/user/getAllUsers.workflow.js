/**
 * Get All Users workflow
 * This workflow retrieves all users with pagination using one activity
 */
import { proxyActivities } from '@temporalio/workflow';
import { defaultActivityTimeout } from '../../config.js';

const activities = proxyActivities({
  startToCloseTimeout: defaultActivityTimeout,
});

/**
 * Get All Users workflow
 * @param {object} params - Pagination parameters
 * @param {number} params.limit - Number of records to retrieve
 * @param {number} params.offset - Number of records to skip
 * @returns {object} Returns users array with code
 */
async function getAllUsersWorkflow({ limit = 100, offset = 0 }) {
  // Execute the get all users activity
  const users = await activities.getAllUsersActivity({ limit, offset });

  return {
    code: 200,
    users,
  };
}

const _getAllUsersWorkflow = getAllUsersWorkflow;
export { _getAllUsersWorkflow as getAllUsersWorkflow };
