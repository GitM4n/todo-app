import type { TaskQuery, TaskSortField, SortOrder } from '../types/task-query';
import { AppError } from './appError';

export function parseTaskQuery(query: TaskQuery) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const status =
    query.status !== undefined ? query.status === 'true' : undefined;

  const author = query.author || undefined;

  const allowedSort: TaskSortField[] = ['id', 'dueDate', 'createdBy', 'isCompleted', 'createdAt'];
  const sort = allowedSort.includes(query.sort as TaskSortField)
    ? (query.sort as TaskSortField)
    : 'id';

  const allowedOrder: SortOrder[] = ['asc', 'desc'];
  const order = allowedOrder.includes(query.order as SortOrder)
    ? query.order!
    : 'asc';

  if (page < 1) throw new AppError('Invalid page', 400);
  if (limit > 100) throw new AppError('Limit too large', 400);

  return {
    page,
    limit,
    status,
    author,
    sort,
    order,
  };
}