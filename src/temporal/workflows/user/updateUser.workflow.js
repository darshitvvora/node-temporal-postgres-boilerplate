/**
 * Update User workflow
 * This workflow orchestrates the user update process with a single activity
 */
import { proxyActivities } from '@temporalio/workflow';
import { defaultActivityTimeout } from '../../config.js';

const activities = proxyActivities({
  startToCloseTimeout: defaultActivityTimeout,
});

/**
 * Update User workflow
 * @param {object} params - Update parameters
 * @param {string} params.id - User ID to update
 * @param {object} params.userData - User data to update
 * @returns {object} Returns update result with code and success status
 */
async function updateUserWorkflow({ id, userData }) {
  // Execute the update activity
  const result = await activities.updateUserActivity({ id, userData });

  return {
    code: 200,
    success: result.success,
    id: result.id,
  };
}

const _updateUserWorkflow = updateUserWorkflow;
export { _updateUserWorkflow as updateUserWorkflow };
