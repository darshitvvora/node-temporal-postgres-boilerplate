/**
 * Get User workflow
 * This workflow retrieves a single user by ID using one activity
 */
import { proxyActivities } from '@temporalio/workflow';
import { defaultActivityTimeout } from '../../config.js';

const activities = proxyActivities({
  startToCloseTimeout: defaultActivityTimeout,
});

/**
 * Get User workflow
 * @param {string} id - User ID to retrieve
 * @returns {object} Returns user data with code and user object
 */
async function getUserWorkflow(id) {
  // Execute the get user activity
  const user = await activities.getUserActivity(id);

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

const _getUserWorkflow = getUserWorkflow;
export { _getUserWorkflow as getUserWorkflow };
