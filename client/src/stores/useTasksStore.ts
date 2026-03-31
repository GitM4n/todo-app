import type { Task, TaskQuery, PaginatedTasks } from '@/types';

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const currentQuery = ref<TaskQuery>({
    page: 1,
    limit: 10,
  });

  const pagination = ref<PaginatedTasks['pagination']>({
    page: currentQuery.value.page || 1,
    limit: currentQuery.value.limit || 10,
    total: 0,
    totalPages: 0,
  });
  const isFetching = ref(false);

  const api = useApi();
  const toast = useToast();

  async function getTaskById(id: number) {
    try {
      const task = await api.get<Task>(`tasks/${id}`);
      return task;
    } catch (e) {
      console.error(e);
    }
  }

  async function getTasks(filters?: TaskQuery) {
    isFetching.value = true;

    try {
      currentQuery.value = {
        ...currentQuery.value,
        ...filters,
      };

      const response = await api.get<PaginatedTasks>(
        'tasks',
        currentQuery.value
      );
      tasks.value = response.data;
      pagination.value = response.pagination;

      if (tasks.value.length === 0 && pagination.value.page > 1) {
        currentQuery.value.page = pagination.value.page - 1;

        const retryResponse = await api.get<PaginatedTasks>(
          'tasks',
          currentQuery.value
        );
        tasks.value = retryResponse.data;
        pagination.value = retryResponse.pagination;
      }
    } catch (e) {
      console.error(e);
    } finally {
      isFetching.value = false;
    }
  }

  async function addTask(task: Omit<Task, 'id' | 'createdBy' | 'isCompleted'>) {
    try {
      const createdTask = await api.post<Task>('tasks', task);
      if (createdTask) {
        toast.show('Task created', 'success');

        await getTasks();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function updateTask(task: Omit<Task, 'createdBy'>) {
    try {
      const updatedTask = await api.put<Task>(`tasks/${task.id}`, task);
      if (updatedTask) await getTasks();
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteTask(id: number) {
    try {
      const deletedTaskId = await api.delete<Task>(`tasks/${id}`);

      if (deletedTaskId) await getTasks();
    } catch (e) {
      console.error(e);
    }
  }

  return {
    tasks,
    pagination,
    isFetching,
    getTasks,
    addTask,
    updateTask,
    getTaskById,
    deleteTask,
  };
});
