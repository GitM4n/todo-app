import type {
  ParsedTaskQuery,
  SortOrder,
  TaskQuery,
  TaskSortField,
} from '../types/task-query';
import { AppError } from './appError';

export function parseTaskQuery(query: TaskQuery): ParsedTaskQuery {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const status =
    query.status === 'true' ? 1 : query.status === 'false' ? 0 : undefined;
  const author = query.author === 'undefined' ? undefined : query.author;

  const allowedSort: TaskSortField[] = [
    'id',
    'dueDate',
    'createdBy',
    'isCompleted',
    'createdAt',
  ];
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
