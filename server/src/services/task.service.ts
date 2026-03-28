import db from '../db/db';
import { toTaskDto } from '../dto/task.dto';
import type { Task, TaskDto, User, UserRole } from '../types';

function canModifyTask(taskCreatedBy: number, user: Partial<User>) {
  return user.role === 'admin' || user.id === taskCreatedBy;
}

export function getAllTasks(user: Partial<User>) {
  let tasks: Task[];

  if (user.role === 'admin') {
    tasks = db
      .prepare('SELECT * FROM tasks WHERE title LIKE ? COLLATE NOCASE')
      .all() as Task[];
  } else {
    tasks = db
      .prepare('SELECT * FROM tasks WHERE createdBy = ?')
      .all(user.id) as Task[];
  }

  return tasks.map(toTaskDto);
}

export function createTask(
  task: Omit<Task, 'id' | 'createdBy' | 'isCompleted'>,
  userId: number
) {
  const result = db
    .prepare(
      'INSERT INTO tasks (title, description, dueDate, isCompleted, createdBy) VALUES (?, ?, ?, 0, ?)'
    )
    .run(task.title, task.description, task.dueDate, userId);

  return toTaskDto({
    id: result.lastInsertRowid as number,
    ...task,
    isCompleted: 0,
    createdBy: userId,
  });
}

export function getTaskById(id: number) {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task;
  return task ? toTaskDto(task) : null;
}

export function searchTasksByTitle(title: string, user: Partial<User>) {
  let tasks: Task[];

  const query = `%${title}%`;

  if (user.role === 'admin') {
    tasks = db
      .prepare('SELECT * FROM tasks WHERE title LIKE ? COLLATE NOCASE')
      .all(query) as Task[];
  } else {
    tasks = db
      .prepare(
        'SELECT * FROM tasks WHERE title LIKE ? COLLATE NOCASE AND createdBy = ?'
      )
      .all(query, user.id) as Task[];
  }

  return tasks.map(toTaskDto);
}

export function updateTask(
  taskId: number,
  taskData: Partial<Omit<TaskDto, 'id'>>,
  user: Partial<User>
) {
  const task = db
    .prepare('SELECT * FROM tasks WHERE id = ?')
    .get(taskId) as Task;

  if (!task) throw new Error('Task not found');
  if (!canModifyTask(task.createdBy, user)) throw new Error('Unauthorized');

  const updated = {
    ...task,
    ...taskData,
    isCompleted:
      taskData.isCompleted !== undefined
        ? taskData.isCompleted
          ? 1
          : 0
        : task.isCompleted,
  };

  db.prepare(
    'UPDATE tasks SET title = ?, description = ?, dueDate = ?, isCompleted = ? WHERE id = ?'
  ).run(
    updated.title,
    updated.description,
    updated.dueDate,
    updated.isCompleted,
    taskId
  );

  return toTaskDto(updated);
}

export function deleteTask(id: number, user: Partial<User>) {
  const task = getTaskById(id);
  if (!task) throw new Error('Task not found');

  if (!canModifyTask(task.createdBy, user)) throw new Error('Unauthorized');

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return { id };
}
