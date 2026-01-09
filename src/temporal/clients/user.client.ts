/**
 * Temporal client helpers for user workflows.
 * Requires @temporalio/client installed to work.
 */
import { USER_QUEUE } from '../../config/environment/shared.js';
import temporal from '../../config/temporal.js';

const { getClient } = temporal;

interface UserData {
  email: string;
  name: string;
  mobile: string;
}

interface UpdateParams {
  id: number;
  userData: Record<string, any>;
}

interface GetAllUsersParams {
  limit?: number;
  offset?: number;
}

/**
 * Start the createUser workflow for user creation
 * Checks for duplicate mobile number (fraud detection) and creates user
 * @param userData - User data for creation
 * @param userData.email - User email
 * @param userData.name - User name
 * @param userData.mobile - User mobile number
 * @returns Returns workflow result with code, id/message, and user data
 */
async function startCreateUser(userData: UserData): Promise<any> {
  const client = await getClient();

  // Generate a unique workflow ID based on mobile and timestamp
  const workflowId = `create-user-${userData.mobile}-${Date.now()}`;

  const handle = await client.workflow.start('createUserWorkflow', {
    args: [userData],
    taskQueue: USER_QUEUE,
    workflowId,
  });

  return handle.result();
}

/**
 * Start the updateUser workflow for updating user data
 * @param params - Update parameters
 * @param params.id - User ID to update
 * @param params.userData - User data to update
 * @returns Returns workflow result with code and success status
 */
async function startUpdateUser({ id, userData }: UpdateParams): Promise<any> {
  const client = await getClient();

  // Generate a unique workflow ID based on user ID and timestamp
  const workflowId = `update-user-${id}-${Date.now()}`;

  const handle = await client.workflow.start('updateUserWorkflow', {
    args: [{ id, userData }],
    taskQueue: USER_QUEUE,
    workflowId,
  });

  return handle.result();
}

/**
 * Start the getUser workflow to retrieve a single user
 * @param id - User ID to retrieve
 * @returns Returns workflow result with code and user data
 */
async function startGetUser(id: number): Promise<any> {
  const client = await getClient();

  // Generate a unique workflow ID based on user ID and timestamp
  const workflowId = `get-user-${id}-${Date.now()}`;

  const handle = await client.workflow.start('getUserWorkflow', {
    args: [id],
    taskQueue: USER_QUEUE,
    workflowId,
  });

  return handle.result();
}

/**
 * Start the getAllUsers workflow to retrieve all users
 * @param params - Pagination parameters
 * @param params.limit - Number of records to retrieve
 * @param params.offset - Number of records to skip
 * @returns Returns workflow result with code and users array
 */
async function startGetAllUsers({ limit = 100, offset = 0 }: GetAllUsersParams): Promise<any> {
  const client = await getClient();

  // Generate a unique workflow ID based on timestamp
  const workflowId = `get-all-users-${Date.now()}`;

  const handle = await client.workflow.start('getAllUsersWorkflow', {
    args: [{ limit, offset }],
    taskQueue: USER_QUEUE,
    workflowId,
  });

  return handle.result();
}

export { startCreateUser, startGetAllUsers, startGetUser, startUpdateUser };
