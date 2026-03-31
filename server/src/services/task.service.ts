import db from '../db/db';
import { toTaskDto } from '../dto/task.dto';
import type {
  PaginatedTasks,
  Task,
  TaskDto,
  TaskQuery,
  TaskSortField,
  TaskRow,
  User,
  UserDto,
} from '../types';
import { AppError } from '../utils/appError';
import { mapRowToTask } from '../utils/mapTaskRowToTask';
import { parseTaskQuery } from '../utils/parseTaskQuery';

const TASK_WITH_USER_SQL = `
  SELECT 
    t.id as taskId, t.title, t.description, t.dueDate, t.isCompleted, t.createdAt as taskCreatedAt,
    u.id as userId, u.email as userEmail, u.role as userRole, u.createdAt as userCreatedAt
  FROM tasks t
  LEFT JOIN users u ON t.createdBy = u.id
`;

function canModifyTask(taskCreatedBy: number, user: Partial<User>) {
  return user.role === 'admin' || user.id === taskCreatedBy;
}

export function getTasks(query: TaskQuery): PaginatedTasks {
  const { page, limit, status, sort, order, author } = parseTaskQuery(query);
  const offset = (page - 1) * limit;

  const params: (string | number)[] = [];

  const sortMap: Record<TaskSortField, string> = {
    id: 't.id',
    createdAt: 't.createdAt',
    dueDate: 't.dueDate',
    isCompleted: 't.isCompleted',
    createdBy: 'u.email',
  };

  const sortField = sortMap[sort ?? 'createdAt'] || 't.createdAt';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

  let sql = TASK_WITH_USER_SQL + ' WHERE 1=1';

  if (status !== undefined) {
    sql += ` AND t.isCompleted = ?`;
    params.push(status ? 1 : 0);
  }

  if (author) {
    sql += ` AND u.email LIKE ?`;
    params.push(`%${author}%`);
  }

  sql += ` ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const rows = db.prepare(sql).all(...params) as TaskRow[];

  const tasks = rows.map(mapRowToTask);

  // ---------- COUNT ----------
  const countParams: (string | number)[] = [];
  let countSql = `SELECT COUNT(*) as count FROM tasks t WHERE 1=1`;

  if (status !== undefined) {
    countSql += ` AND t.isCompleted = ?`;
    countParams.push(status ? 1 : 0);
  }

  // JOIN только если нужен author
  if (author) {
    countSql = `
      SELECT COUNT(*) as count
      FROM tasks t
      LEFT JOIN users u ON t.createdBy = u.id
      WHERE 1=1
    `;

    if (status !== undefined) {
      countSql += ` AND t.isCompleted = ?`;
      countParams.push(status ? 1 : 0);
    }

    countSql += ` AND u.email LIKE ?`;
    countParams.push(`%${author}%`);
  }

  const total = (db.prepare(countSql).get(...countParams) as { count: number })
    .count;

  return {
    data: tasks.map(toTaskDto),
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

  const createdBy = db
    .prepare('SELECT id, email, role, createdAt FROM users WHERE id = ?')
    .get(userId) as UserDto;

  const result = db
    .prepare(
      'INSERT INTO tasks (title, description, dueDate, isCompleted, createdBy, createdAt) VALUES (?, ?, ?, 0, ?, ?)'
    )
    .run(task.title, task.description, task.dueDate, userId, task.createdAt);

  return toTaskDto({
    id: result.lastInsertRowid as number,
    ...task,
    isCompleted: 0,
    createdBy,
  });
}

export function getTaskById(id: number) {
  const row = db
    .prepare(`${TASK_WITH_USER_SQL} WHERE t.id = ?`)
    .get(id) as TaskRow;

  if (!row) return null;

  return toTaskDto(mapRowToTask(row));
}

export function updateTask(
  taskId: number,
  taskData: Partial<Omit<TaskDto, 'id'>>,
  user: Partial<User>
) {
  const row = db
    .prepare(`${TASK_WITH_USER_SQL} WHERE t.id = ?`)
    .get(taskId) as TaskRow;

  if (!row) throw new AppError('Task not found', 404);

  const task = mapRowToTask(row);

  if (!canModifyTask(task.createdBy.id, user))
    throw new AppError('Unauthorized', 401);

  const updatedIsCompleted =
    taskData.isCompleted !== undefined
      ? taskData.isCompleted
        ? 1
        : 0
      : task.isCompleted;

  db.prepare(
    'UPDATE tasks SET title = ?, description = ?, dueDate = ?, isCompleted = ? WHERE id = ?'
  ).run(
    taskData.title ?? task.title,
    taskData.description ?? task.description,
    taskData.dueDate ?? task.dueDate,
    updatedIsCompleted,
    taskId
  );

  return getTaskById(taskId);
}

export function deleteTask(id: number, user: Partial<User>) {
  const task = getTaskById(id);

  if (!task) throw new AppError('Task not found', 404);

  if (!canModifyTask(task.createdBy.id, user))
    throw new AppError('Unauthorized', 401);

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return { id };
}
