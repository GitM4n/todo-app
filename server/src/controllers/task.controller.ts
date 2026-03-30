import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware';
import type { Task, TaskQuery } from '../types';
import {
  createTask as createTaskService,
  deleteTask as deleteTaskService,
  getAllTasks as getAllTasksService,
  updateTask as updateTaskService,
  getTasks as getTasksService
} from '../services/task.service';
import { AppError } from '../utils/appError';

export function getAllTasks(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError('Unauthorized', 401);

  const tasks = getAllTasksService(req.user);
  res.json(tasks);
}

export function getTasks(req: AuthRequest<{}, {}, TaskQuery>, res: Response) {
  if (!req.user) throw new AppError('Unauthorized', 401);

  const tasks = getTasksService(req.query);
  res.json(tasks);
}

export function createTask(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError('Unauthorized', 401);
  const task = req.body as Task;
  if (!task.title || !task.description || !task.dueDate || !task.createdAt) {
    throw new AppError('Missing required fields', 400);
  }

  const createdTask = createTaskService(task, req.user.id);
  res.status(201).json(createdTask);
}

export function deleteTask(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError('Unauthorized', 401);

  deleteTaskService(Number(req.params.id), req.user);
  res.json({ message: 'Task deleted' });
}

export function updateTask(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError('Unauthorized', 401);

  if (!req.params.id) throw new AppError('Task ID is required', 400);
  const taskId = Number(req.params.id);

  const updatedTask = updateTaskService(taskId, req.body, req.user);
  res.json(updatedTask);
}

