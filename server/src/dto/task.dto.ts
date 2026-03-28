import type { Task } from '../types';

export function toTaskDto(task: Task) {
  return {
    ...task,
    isCompleted: task.isCompleted === 1 ? true : false,
  };
}
