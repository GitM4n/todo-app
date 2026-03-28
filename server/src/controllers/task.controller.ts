import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware';
import {
  createTask as createTaskService,
  deleteTask as deleteTaskService,
  getAllTasks as getAllTasksService,
  searchTasksByTitle as searchTasksByTitleService,
  updateTask as updateTaskService,
} from '../services/task.service';

export function getTasks(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const tasks = getAllTasksService(req.user);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export function createTask(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const task = createTaskService(req.body, req.user.id);
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Bad request' });
  }
}

export function deleteTask(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    deleteTaskService(Number(req.params.id), req.user);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export function updateTask(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const taskId = Number(req.params.id);
    if (!taskId)
      return res.status(400).json({ message: 'Task ID is required' });

    const updatedTask = updateTaskService(taskId, req.body, req.user);

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
}

export function searchTasksByTitle(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const title = req.params.title as string;
    if (!title) return res.status(400).json({ message: 'Bad request' });

    const task = searchTasksByTitleService(title, req.user);
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
