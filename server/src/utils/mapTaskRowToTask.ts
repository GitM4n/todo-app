import type { Task, TaskRow } from '../types';

export function mapRowToTask(row: TaskRow): Task {
  return {
    id: row.taskId,
    title: row.title,
    description: row.description,
    dueDate: row.dueDate,
    isCompleted: row.isCompleted,
    createdAt: row.taskCreatedAt,
    createdBy: {
      id: row.userId,
      email: row.userEmail,
      role: row.userRole,
      createdAt: row.userCreatedAt,
    },
  };
}
