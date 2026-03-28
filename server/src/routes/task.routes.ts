import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTasks,
  searchTasksByTitle,
  updateTask,
} from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:title', searchTasksByTitle);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
