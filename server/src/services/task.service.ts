import db from '../db/db';
import { toTaskDto } from '../dto/task.dto';
import type { Task, TaskDto, TaskQuery, User, PaginatedTasks } from '../types';
import { AppError } from '../utils/appError';
import { parseTaskQuery } from '../utils/parseTaskQuery';

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

export function getTasks(query: TaskQuery): PaginatedTasks {
  const { page, limit, status, sort, order, author } = parseTaskQuery(query);
  const offset = (page - 1) * limit;

  const params: (string | number)[] = [];
  let sql = `SELECT tasks.*, users.email as authorEmail
             FROM tasks
             LEFT JOIN users ON tasks.createdBy = users.id
             WHERE 1=1`;

  // фильтр по статусу
  if (status !== undefined) {
    sql += ` AND isCompleted = ?`;
    params.push(status ? 1 : 0);
  }

  // фильтр по автору (частичная строка)
  if (author !== undefined) {
    sql += ` AND users.email LIKE ?`;
    params.push(`%${author}%`);
  }

  sql += ` ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const tasks = db.prepare(sql).all(...params) as (Task & { authorEmail: string })[];

  // подсчёт total
  const countParams: (string | number)[] = [];
  let countSql = `SELECT COUNT(*) as count
                  FROM tasks
                  LEFT JOIN users ON tasks.createdBy = users.id
                  WHERE 1=1`;

  if (status !== undefined) {
    countSql += ` AND isCompleted = ?`;
    countParams.push(status ? 1 : 0);
  }
  if (author !== undefined) {
    countSql += ` AND users.email LIKE ?`;
    countParams.push(`%${author}%`);
  }

  const total = (db.prepare(countSql).get(...countParams) as { count: number })
    .count;

  return {
    data: tasks.map(task => toTaskDto(task)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export function createTask(
  task: Omit<Task, 'id' | 'createdBy' | 'isCompleted'>,
  userId: number
) {
  const { title, description, dueDate, createdAt } = task;
  if (!title || !description || !dueDate || !createdAt) {
    throw new AppError('Missing required fields', 400);
  }

  const result = db
    .prepare(
      'INSERT INTO tasks (title, description, dueDate, isCompleted, createdBy, createdAt) VALUES (?, ?, ?, 0, ?, ?)'
    )
    .run(task.title, task.description, task.dueDate, userId, task.createdAt);

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

  if (!task) throw new AppError('Task not found', 404);
  if (!canModifyTask(task.createdBy, user))
    throw new AppError('Unauthorized', 401);

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
  if (!task) throw new AppError('Task not found', 404);

  if (!canModifyTask(task.createdBy, user))
    throw new AppError('Unauthorized', 401);

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return { id };
}
