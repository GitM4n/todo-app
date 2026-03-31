export type UserRole = 'user' | 'admin';

export type User = {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  createdAt: number;
};

export type Task = {
  id: number;
  createdAt: number;
  title: string;
  description: string;
  dueDate: number;
  isCompleted: boolean;
  createdBy: User;
};

export type PaginatedTasks = {
  data: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type TaskSortField =
  | 'id'
  | 'dueDate'
  | 'createdBy'
  | 'isCompleted'
  | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export type TaskQuery = {
  page?: number;
  limit?: number;
  status?: boolean;
  author?: string;
  sort?: TaskSortField;
  order?: SortOrder;
};
