// Domain-specific activities for `user` workflows
import db from '../../../db/index.js';
import logger from '../../../utils/logger.js';
import type { UserCreationAttributes, UserUpdateAttributes, UserAttributes } from '../../../types/user.types.js';

const { User } = db;

interface UpdateUserParams {
  id: number;
  userData: UserUpdateAttributes;
}

interface GetAllUsersParams {
  limit?: number;
  offset?: number;
}

interface UpdateUserResult {
  id: number;
  success: boolean;
}

/**
 * Check if user already exists in database by mobile number
 * @param mobile - User mobile number to check
 * @returns Returns user if found, null otherwise
 */
export async function checkDuplicateByMobileActivity(mobile: string): Promise<UserAttributes | null> {
  logger.info('Checking for duplicate user by mobile', { mobile });

  const user = await User.findOne({
    attributes: ['id', 'mobile'],
    where: { mobile },
    raw: true,
  });

  if (user) {
    logger.warn('Duplicate mobile number found', { mobile, userId: user.id });
  } else {
    logger.info('No duplicate found', { mobile });
  }

  return user;
}

/**
 * Create a new user in database
 * @param userData - User data to create
 * @returns Returns created user with id
 */
export async function createUserActivity(userData: UserCreationAttributes): Promise<Partial<UserAttributes>> {
  const { name, email, mobile } = userData;

  logger.info('Creating new user', { email, mobile });

  try {
    const user = await User.create({
      name,
      email,
      mobile,
    });

    logger.info('User created successfully', { userId: user.id, email, mobile });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    };
  } catch (error: any) {
    logger.error('Failed to create user', { error: error.message, email, mobile });
    throw error;
  }
}

/**
 * Update an existing user in database
 * @param params - Update parameters
 * @param params.id - User ID to update
 * @param params.userData - User data to update
 * @returns Returns update result
 */
export async function updateUserActivity({ id, userData }: UpdateUserParams): Promise<UpdateUserResult> {
  logger.info('Updating user', { userId: id, userData });

  try {
    await User.update(
      {
        ...userData,
      },
      {
        where: {
          id,
        },
      },
    );

    logger.info('User updated successfully', { userId: id });

    return {
      id,
      success: true,
    };
  } catch (error: any) {
    logger.error('Failed to update user', { error: error.message, userId: id });
    throw error;
  }
}

/**
 * Get a single user from database
 * @param id - User ID to retrieve
 * @returns Returns user data or null if not found
 */
export async function getUserActivity(id: number): Promise<UserAttributes | null> {
  logger.info('Fetching user', { userId: id });

  const user = await User.findOne({
    attributes: ['id', 'mobile', 'name', 'email'],
    where: { id },
    raw: true,
  });

  if (user) {
    logger.info('User found', { userId: id });
  } else {
    logger.warn('User not found', { userId: id });
  }

  return user;
}

/**
 * Get all users from database with pagination
 * @param params - Pagination parameters
 * @param params.limit - Number of records to retrieve
 * @param params.offset - Number of records to skip
 * @returns Returns array of users
 */
export async function getAllUsersActivity({ limit = 100, offset = 0 }: GetAllUsersParams): Promise<any[]> {
  logger.info('Fetching all users', { limit, offset });

  const users = await User.findAll({
    limit,
    offset,
  });

  logger.info('Users fetched successfully', { count: users.length, limit, offset });

  return users;
}
