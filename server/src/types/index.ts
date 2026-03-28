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
  isCompleted: 0 | 1; //sqlite3 does not support boolean 0 - false, 1 - true
  createdBy: number;
};

export type TaskDto = Omit<Task, 'isCompleted'> & {
  isCompleted: boolean;
};
