/**
 * @fileoverview User Repository - Data Access Layer
 * @author Darshit Vora
 * @class UserRepository
 * @description Handles all database operations for User entity
 */

import db from '../index.js';
import type { UserAttributes, UserCreationAttributes, UserUpdateAttributes } from '../../types/user.types.js';

const { User } = db;

/**
 * Find user by email
 * @param email - User email
 * @returns User object or null
 */
function findByEmail(email: string): Promise<UserAttributes | null> {
  return User.findOne({
    where: { email },
    raw: true,
  });
}

/**
 * Find user by ID
 * @param id - User ID
 * @returns User object or null
 */
function findById(id: number): Promise<UserAttributes | null> {
  return User.findOne({
    where: { id },
    raw: true,
  });
}

/**
 * Get all users with pagination
 * @param limit - Number of records to fetch
 * @param offset - Number of records to skip
 * @returns Array of users
 */
function findAll(limit = 10, offset = 0): Promise<UserAttributes[]> {
  return User.findAll({
    limit,
    offset,
    raw: true,
  });
}

/**
 * Create or update user
 * @param userData - User data object
 * @returns Created/Updated user
 */
const upsert = (userData: UserCreationAttributes): Promise<[any, boolean | null]> => User.upsert(userData);

/**
 * Create new user
 * @param userData - User data object
 * @returns Created user
 */
const create = (userData: UserCreationAttributes): Promise<any> => User.create(userData);

/**
 * Update user by ID
 * @param id - User ID
 * @param userData - User data to update
 * @returns Number of affected rows and updated records
 */
function update(id: number, userData: UserUpdateAttributes): Promise<[number, any[]]> {
  return User.update(userData, {
    where: { id },
    returning: true,
  });
}

/**
 * Delete user by ID
 * @param id - User ID
 * @returns Number of deleted rows
 */
function deleteById(id: number): Promise<number> {
  return User.destroy({
    where: { id },
  });
}

export default {
  findByEmail,
  findById,
  findAll,
  upsert,
  create,
  update,
  deleteById,
};
