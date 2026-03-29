import type { Task, TaskQuery, PaginatedTasks } from '@/types';

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);

  const pagination = ref<PaginatedTasks['pagination']>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const isLoading = ref(false);

  const api = useApi();
  // const toast = useToast();

  async function getTasks(filters?: TaskQuery) {
    isLoading.value = true;

    try {
      let query:Partial<TaskQuery> = {
        page: filters?.page ?? pagination.value.page,
        limit: filters?.limit ?? pagination.value.limit,
      };

      if(filters) query = { ...query, ...filters };

      const response = await api.get<PaginatedTasks>('/tasks', query);
      tasks.value = response.data;
      pagination.value = response.pagination;
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  // async function createTask(task: Task) {
  //   try {
  //     const createdTask = await api.post<Task>('/tasks', task);

  //     toast.show('Task created', 'success');
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  return { tasks, pagination, isLoading, getTasks };
});
