export type TaskSortField =
  | 'id'
  | 'dueDate'
  | 'createdBy'
  | 'isCompleted'
  | 'createdAt';

export type SortOrder = 'asc' | 'desc';

export interface TaskQuery {
  page?: string;
  limit?: string;
  status?: string;
  author?: string;
  sort?: TaskSortField;
  order?: SortOrder;
}

export interface ParsedTaskQuery extends Omit<
  TaskQuery,
  'page' | 'limit' | 'status'
> {
  page: number;
  limit: number;
  status?: 0 | 1;
}
