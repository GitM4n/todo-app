export type UserRole = 'user' | 'admin';

export type User = {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  createdAt: number;
};

export type UserDto = Omit<User, 'password'>;

export type TaskRow = {
  taskId: number;
  title: string;
  description: string;
  dueDate: number;
  isCompleted: 0 | 1;
  taskCreatedAt: number;

  userId: number;
  userEmail: string;
  userRole: 'user' | 'admin';
  userCreatedAt: number;
};

export type Task = {
  id: number;
  createdAt: number;
  title: string;
  description: string;
  dueDate: number;
  isCompleted: 0 | 1; //sqlite3 does not support boolean 0 - false, 1 - true
  createdBy: Omit<User, 'password'>;
};

export type TaskDto = Omit<Task, 'isCompleted'> & {
  isCompleted: boolean;
};

export type PaginatedTasks = {
  data: TaskDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
}

export * from './task-query'