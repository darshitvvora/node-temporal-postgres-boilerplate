---
sidebar_position: 5
---

# Adding a New API Resource

This guide walks you through adding a complete new resource to your API, including routes, database models, and Temporal workflows. We'll use a **Product** resource as an example.

## Overview

To add a new resource, you'll create:

1. **Database Migration** - Define the table schema
2. **Sequelize Model** - ORM model for database operations
3. **Temporal Activities** - Business logic functions
4. **Temporal Workflow** - Orchestration logic
5. **Temporal Client** - Functions to trigger workflows
6. **API Property Schema** - Request/response validation
7. **API Controller** - Request handlers
8. **API Routes** - HTTP endpoints
9. **Register Routes** - Connect routes to the app

Let's build a complete **Product** resource step by step.

## Step 1: Create Database Migration

First, create a migration file for the products table:

```bash
npx sequelize-cli migration:generate --name create-products
```

This creates a file in `src/db/migrations/` like `20260109000000-create-products.ts`.

Edit the migration file:

```typescript
// src/db/migrations/20260109000000-create-products.ts
import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('products', ['sku']);
    await queryInterface.addIndex('products', ['name']);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable('products');
  }
};
```

Run the migration:

```bash
npm run migrate
```

## Step 2: Create Sequelize Model

Create the Product model:

```bash
mkdir -p src/db/models
touch src/db/models/product.model.ts
```

```typescript
// src/db/models/product.model.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

export interface ProductAttributes {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreationAttributes extends Omit<ProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public price!: number;
  public stock!: number;
  public sku!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initProductModel = (sequelize: Sequelize): typeof Product => {
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: 'products',
      modelName: 'Product',
    }
  );

  return Product;
};

export default Product;
```

Register the model in your database initialization file.

## Step 3: Create Temporal Activities

Activities contain the actual business logic:

```bash
mkdir -p src/temporal/activities/product
touch src/temporal/activities/product/activities.ts
```

```typescript
// src/temporal/activities/product/activities.ts
import Product, { ProductCreationAttributes } from '../../../db/models/product.model';
import logger from '../../../utils/logger';

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku: string;
}

/**
 * Activity: Create a product in the database
 */
export async function createProductActivity(input: CreateProductInput): Promise<Product> {
  try {
    logger.info('Creating product', { sku: input.sku });

    const product = await Product.create({
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      sku: input.sku,
    });

    logger.info('Product created successfully', { 
      productId: product.id, 
      sku: product.sku 
    });

    return product;
  } catch (error) {
    logger.error('Failed to create product', { error, input });
    throw error;
  }
}

/**
 * Activity: Validate product data
 */
export async function validateProductActivity(input: CreateProductInput): Promise<void> {
  logger.info('Validating product', { sku: input.sku });

  // Check if SKU already exists
  const existingProduct = await Product.findOne({ where: { sku: input.sku } });
  
  if (existingProduct) {
    throw new Error(`Product with SKU ${input.sku} already exists`);
  }

  // Validate price
  if (input.price <= 0) {
    throw new Error('Price must be greater than 0');
  }

  // Validate stock
  if (input.stock < 0) {
    throw new Error('Stock cannot be negative');
  }

  logger.info('Product validation successful', { sku: input.sku });
}

/**
 * Activity: Send notification (e.g., to inventory system)
 */
export async function notifyInventorySystemActivity(productId: number): Promise<void> {
  logger.info('Notifying inventory system', { productId });
  
  // Simulate API call to inventory system
  // In production, this would be an actual HTTP request
  await new Promise(resolve => setTimeout(resolve, 100));
  
  logger.info('Inventory system notified', { productId });
}

/**
 * Activity: Update search index
 */
export async function updateSearchIndexActivity(productId: number): Promise<void> {
  logger.info('Updating search index', { productId });
  
  // Simulate updating Elasticsearch or similar
  // In production, this would update your search engine
  await new Promise(resolve => setTimeout(resolve, 100));
  
  logger.info('Search index updated', { productId });
}
```

## Step 4: Create Temporal Workflow

Workflows orchestrate activities:

```bash
mkdir -p src/temporal/workflows/product
touch src/temporal/workflows/product/createProduct.workflow.ts
```

```typescript
// src/temporal/workflows/product/createProduct.workflow.ts
import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../../activities/product/activities';

// Configure activity options
const { 
  createProductActivity,
  validateProductActivity,
  notifyInventorySystemActivity,
  updateSearchIndexActivity 
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '5 minutes',
  retry: {
    initialInterval: '1s',
    backoffCoefficient: 2,
    maximumInterval: '30s',
    maximumAttempts: 5,
  },
});

export interface CreateProductWorkflowInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku: string;
}

/**
 * Workflow: Create a new product
 * This workflow ensures all steps complete successfully or rolls back
 */
export async function createProductWorkflow(
  input: CreateProductWorkflowInput
): Promise<{ productId: number; sku: string }> {
  // Step 1: Validate product data
  await validateProductActivity(input);

  // Step 2: Create product in database
  const product = await createProductActivity(input);

  // Step 3: Execute post-creation tasks in parallel
  await Promise.all([
    notifyInventorySystemActivity(product.id),
    updateSearchIndexActivity(product.id),
  ]);

  return {
    productId: product.id,
    sku: product.sku,
  };
}
```

## Step 5: Create Temporal Client

Client functions trigger workflows from your API:

```bash
touch src/temporal/clients/product.client.ts
```

```typescript
// src/temporal/clients/product.client.ts
import { getTemporalClient } from '../../config/temporal';
import { CreateProductWorkflowInput } from '../workflows/product/createProduct.workflow';
import logger from '../../utils/logger';

export async function startCreateProductWorkflow(input: CreateProductWorkflowInput) {
  const client = await getTemporalClient();
  
  const workflowId = `product-creation-${input.sku}-${Date.now()}`;

  try {
    const handle = await client.workflow.start('createProductWorkflow', {
      taskQueue: 'product-queue',
      workflowId,
      args: [input],
    });

    logger.info('Product creation workflow started', { 
      workflowId, 
      sku: input.sku 
    });

    const result = await handle.result();

    logger.info('Product creation workflow completed', { 
      workflowId, 
      result 
    });

    return { workflowId, result };
  } catch (error) {
    logger.error('Product creation workflow failed', { 
      workflowId, 
      error 
    });
    throw error;
  }
}
```

## Step 6: Create API Property Schema

Define request/response validation:

```bash
mkdir -p src/api/product
touch src/api/product/product.property.ts
```

```typescript
// src/api/product/product.property.ts

/**
 * OpenAPI schema for Product
 */
export const ProductSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    name: { type: 'string', example: 'Laptop' },
    description: { type: 'string', example: 'High-performance laptop' },
    price: { type: 'number', example: 999.99 },
    stock: { type: 'integer', example: 50 },
    sku: { type: 'string', example: 'LAPTOP-001' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

/**
 * Request validation schema for creating a product
 */
export const CreateProductRequestSchema = {
  type: 'object',
  required: ['name', 'price', 'sku', 'stock'],
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 255 },
    description: { type: 'string', maxLength: 1000 },
    price: { type: 'number', minimum: 0.01 },
    stock: { type: 'integer', minimum: 0 },
    sku: { type: 'string', minLength: 1, maxLength: 100 },
  },
};
```

## Step 7: Create API Controller

Handle HTTP requests:

```bash
touch src/api/product/product.controller.ts
```

```typescript
// src/api/product/product.controller.ts
import { Request, Response } from 'express';
import { startCreateProductWorkflow } from '../../temporal/clients/product.client';
import Product from '../../db/models/product.model';
import logger from '../../utils/logger';

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const { name, description, price, stock, sku } = req.body;

    // Start Temporal workflow
    const { workflowId, result } = await startCreateProductWorkflow({
      name,
      description,
      price,
      stock,
      sku,
    });

    // Fetch the created product
    const product = await Product.findByPk(result.productId);

    res.status(201).json({
      status: 'success',
      data: {
        ...product?.toJSON(),
        workflowId,
      },
    });
  } catch (error: any) {
    logger.error('Error creating product', { error });
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create product',
    });
  }
}

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const products = await Product.findAll();

    res.status(200).json({
      status: 'success',
      data: products,
    });
  } catch (error: any) {
    logger.error('Error fetching products', { error });
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
    });
  }
}

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
export async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (error: any) {
    logger.error('Error fetching product', { error });
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch product',
    });
  }
}
```

## Step 8: Create API Routes

Define HTTP endpoints:

```bash
touch src/api/product/product.routes.ts
```

```typescript
// src/api/product/product.routes.ts
import { Router } from 'express';
import { createProduct, getProducts, getProductById } from './product.controller';
import { body, param } from 'express-validator';
import { validate } from '../../middleware/validate';

const router = Router();

/**
 * Validation middleware
 */
const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('description').optional().trim(),
  validate,
];

const getProductByIdValidation = [
  param('id').isInt().withMessage('Product ID must be an integer'),
  validate,
];

/**
 * Routes
 */
router.post('/', createProductValidation, createProduct);
router.get('/', getProducts);
router.get('/:id', getProductByIdValidation, getProductById);

export default router;
```

## Step 9: Register Routes

Add the routes to your main router:

```typescript
// src/routes.ts
import { Application } from 'express';
import userRoutes from './api/user/user.routes';
import productRoutes from './api/product/product.routes'; // Add this

export default function routes(app: Application): void {
  app.use('/api/users', userRoutes);
  app.use('/api/products', productRoutes); // Add this
}
```

## Step 10: Create Worker

Create a worker to process product workflows:

```bash
mkdir -p src/temporal/workers
touch src/temporal/workers/product.worker.ts
```

```typescript
// src/temporal/workers/product.worker.ts
import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from '../activities/product/activities';
import { getTemporalConnection } from '../../config/temporal';
import logger from '../../utils/logger';

export async function startProductWorker(): Promise<void> {
  const connection = await getTemporalConnection();

  const worker = await Worker.create({
    connection,
    namespace: 'default',
    taskQueue: 'product-queue',
    workflowsPath: require.resolve('../workflows/product/createProduct.workflow'),
    activities,
  });

  logger.info('Product worker started', { taskQueue: 'product-queue' });

  await worker.run();
}

// Start worker if this file is run directly
if (require.main === module) {
  startProductWorker().catch((err) => {
    logger.error('Fatal error in product worker', { error: err });
    process.exit(1);
  });
}
```

Add a script to `package.json`:

```json
{
  "scripts": {
    "start:worker:product": "node dist/temporal/workers/product.worker.js",
    "start:worker:product:dev": "tsx src/temporal/workers/product.worker.ts"
  }
}
```

## Step 11: Test Your New Resource

### Start the worker:

```bash
npm run start:worker:product:dev
```

### Test creating a product:

```bash
curl -X POST http://localhost:3015/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "stock": 50,
    "sku": "LAPTOP-001"
  }'
```

### Test getting products:

```bash
curl http://localhost:3015/api/products
```

### Monitor the workflow:

Visit http://localhost:8233 to see the workflow execution in Temporal UI.

## Summary

You've successfully added a complete new resource! Here's what you created:

✅ Database migration and model  
✅ Temporal activities with business logic  
✅ Temporal workflow for orchestration  
✅ Temporal client to trigger workflows  
✅ API validation schemas  
✅ API controller with request handlers  
✅ API routes with validation  
✅ Worker to process workflows  

## Next Steps

- Add update and delete operations
- Implement pagination for list endpoints
- Add filtering and sorting
- Create unit and integration tests
- Add more complex workflows (e.g., bulk operations)

## Tips

1. **Follow the pattern**: Use the existing user resource as a reference
2. **Test incrementally**: Test each step before moving to the next
3. **Use TypeScript**: Take advantage of type safety
4. **Handle errors**: Add proper error handling in activities
5. **Monitor workflows**: Always check Temporal UI for workflow execution

Happy coding! 🚀
