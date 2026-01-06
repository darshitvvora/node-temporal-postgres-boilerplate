import { startCreateUser, startGetAllUsers, startGetUser, startUpdateUser } from '../../temporal/clients/user.client.js';

const messagesMap = {
  201: 'Your account created successfully.',
  409: 'Duplicate',
  400: 'Bad Request',
};

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a user via Temporal workflow with duplicate mobile number detection for fraud prevention
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - mobile
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               name:
 *                 type: string
 *                 example: John Doe
 *               mobile:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your account created successfully.
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     mobile:
 *                       type: string
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bad Request
 *       409:
 *         description: Duplicate mobile number found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Duplicate mobile number found. Possible fraud.
 *                 id:
 *                   type: integer
 *                   example: 1
 */
async function create(req, res, next) {
  try {
    // Use Temporal workflow for user creation
    // Workflow will:
    // 1. Check for duplicate mobile number (fraud detection)
    // 2. Create user if no duplicate found
    const result = await startCreateUser(req.body);

    // Handle workflow result
    if (result.code === 409) {
      return res.status(409).json({
        message: result.message,
        id: result.id,
      });
    }

    if (result.code === 400) {
      return res.status(400).json({
        message: result.message,
      });
    }

    return res.status(201).json({
      message: result.message,
      id: result.id,
      user: result.user,
    });
  }
  catch (err) {
    // Handle unique constraint violation
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        message: messagesMap[409],
        error: err.message,
      });
    }
    return next(err);
  }
}

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a paginated list of all users via Temporal workflow
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Demo User
 *                   email:
 *                     type: string
 *                     example: demo@demo.com
 *                   mobile:
 *                     type: string
 *                     example: "1234567890"
 *       500:
 *         description: Internal server error
 */
async function index(req, res, next) {
  try {
    const limit = 100;
    const offset = 0;

    // Use Temporal workflow for fetching all users
    const result = await startGetAllUsers({ limit, offset });

    return res.status(result.code).json(result.users);
  }
  catch (err) {
    return next(err);
  }
}

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     description: Retrieve a specific user by their ID via Temporal workflow
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *         example: 1
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john@example.com
 *                 mobile:
 *                   type: string
 *                   example: "1234567890"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 */
async function getUser(req, res, next) {
  try {
    // Use Temporal workflow for fetching user
    const result = await startGetUser(req.params.id);

    if (result.code === 404) {
      return res.status(404).json({ message: result.message });
    }

    return res.status(result.code).json(result.user);
  }
  catch (err) {
    return next(err);
  }
}

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update an existing user's information via Temporal workflow
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *               name:
 *                 type: string
 *                 example: Updated Name
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully.
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 id:
 *                   type: string
 *                   example: "1"
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
async function update(req, res, next) {
  try {
    // Use Temporal workflow for user update
    const result = await startUpdateUser({
      id: req.params.id,
      userData: req.body,
    });

    return res.status(result.code).json({
      message: 'User updated successfully.',
      success: result.success,
      id: result.id,
    });
  }
  catch (err) {
    return next(err);
  }
}

export default {
  create,
  index,
  getUser,
  update,
};
