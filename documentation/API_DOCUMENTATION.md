# API Documentation

This project uses **OpenAPI 3.0** (formerly Swagger) for API documentation.

## Accessing the Documentation

Once the server is running, you can access the interactive API documentation at:

```
http://localhost:8080/api-docs
```

## Documentation Standards

### OpenAPI 3.0 Format

All API endpoints are documented using OpenAPI 3.0 specification with JSDoc comments in the controller files.

Example:

```javascript
/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a user via Temporal workflow
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
 *               name:
 *                 type: string
 *               mobile:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Duplicate found
 */
async function create(req, res, next) {
  // implementation
}
```

## Configuration

The Swagger configuration is located at `src/config/swagger.js`.

### Key Features:

- **OpenAPI Version**: 3.0.0
- **Authentication**: Bearer JWT tokens
- **Reusable Schemas**: Defined in `components.schemas`
- **Auto-discovery**: Automatically scans `src/api/**/*.controller.js` files

## Available Endpoints

### Users

- **POST /api/users** - Create a new user
- **GET /api/users** - Get all users (paginated)
- **GET /api/users/:id** - Get a single user by ID
- **PUT /api/users/:id** - Update a user

All user endpoints use Temporal workflows for processing.

## Reusable Schema Components

The following reusable schemas are defined:

- `User` - Complete user object
- `UserInput` - Input for user creation
- `UserUpdate` - Input for user updates
- `Error` - Standard error response
- `SuccessResponse` - Standard success response

## Adding New Documentation

When creating new endpoints:

1. Add OpenAPI JSDoc comments above the controller function
2. Follow the existing format
3. Use reusable schemas where possible
4. Include all possible response codes
5. Add examples for clarity

## Testing the API

You can test the API directly from the Swagger UI at `/api-docs` or use the "Try it out" feature for each endpoint.

## Best Practices

1. **Always document all parameters** - path, query, body
2. **Include response examples** - helps developers understand the API
3. **Use proper HTTP status codes** - 200, 201, 400, 404, 409, 500, etc.
4. **Tag endpoints logically** - group related endpoints with tags
5. **Keep descriptions clear** - explain what the endpoint does
6. **Document error cases** - include all possible error responses
