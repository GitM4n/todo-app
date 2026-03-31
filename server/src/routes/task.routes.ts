import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  getTaskById
} from '../controllers/task.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', asyncHandler(getTasks));
router.get('/:id', asyncHandler(getTaskById));
router.post('/', asyncHandler(createTask));
router.put('/:id', asyncHandler(updateTask));
router.delete('/:id', asyncHandler(deleteTask));

export default router;
