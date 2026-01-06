/**
 * @fileoverview User Repository - Data Access Layer
 * @author Darshit Vora
 * @class UserRepository
 * @description Handles all database operations for User entity
 */

import db from '../index.js';

const { User } = db;

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<object | null>} User object or null
 */
function findByEmail(email) {
  return User.findOne({
    where: { email },
    raw: true,
  });
}

/**
 * Find user by ID
 * @param {number} id - User ID
 * @returns {Promise<object | null>} User object or null
 */
function findById(id) {
  return User.findOne({
    where: { id },
    raw: true,
  });
}

/**
 * Get all users with pagination
 * @param {number} limit - Number of records to fetch
 * @param {number} offset - Number of records to skip
 * @returns {Promise<Array>} Array of users
 */
function findAll(limit = 10, offset = 0) {
  return User.findAll({
    limit,
    offset,
    raw: true,
  });
}

/**
 * Create or update user
 * @param {object} userData - User data object
 * @returns {Promise<object>} Created/Updated user
 */
const upsert = userData => User.upsert(userData);

/**
 * Create new user
 * @param {object} userData - User data object
 * @returns {Promise<object>} Created user
 */
const create = userData => User.create(userData);

/**
 * Update user by ID
 * @param {number} id - User ID
 * @param {object} userData - User data to update
 * @returns {Promise<[number, object[]]>} Number of affected rows and updated records
 */
function update(id, userData) {
  return User.update(userData, {
    where: { id },
    returning: true,
  });
}

/**
 * Delete user by ID
 * @param {number} id - User ID
 * @returns {Promise<number>} Number of deleted rows
 */
function deleteById(id) {
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
