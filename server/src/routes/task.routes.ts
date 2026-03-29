import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTasks,
  searchTasksByTitle,
  updateTask,
} from '../controllers/task.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', asyncHandler(getTasks));
router.post('/', asyncHandler(createTask));
router.get('/:title', asyncHandler(searchTasksByTitle));
router.put('/:id', asyncHandler(updateTask));
router.delete('/:id', asyncHandler(deleteTask));

export default router;
