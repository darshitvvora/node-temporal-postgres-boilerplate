import { Router } from 'express';
import controller from './user.controller.js';

const router = Router();

router.get('/', controller.index);
router.get('/:id', controller.getUser);
router.post('/', controller.create);
router.put('/:id', controller.update);

export default router;
