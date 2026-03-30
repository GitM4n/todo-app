import type { Task, TaskQuery, PaginatedTasks } from '@/types';

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);

  const pagination = ref<PaginatedTasks['pagination']>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const isFetching = ref(false);

  const api = useApi();
  const toast = useToast();

  async function getTasks(filters?: TaskQuery) {
    isFetching.value = true;

    try {
      let query: Partial<TaskQuery> = {
        page: filters?.page ?? pagination.value.page,
        limit: filters?.limit ?? pagination.value.limit,
      };

      if (filters) query = { ...query, ...filters };

      const response = await api.get<PaginatedTasks>('tasks', query);
      tasks.value = response.data;
      pagination.value = response.pagination;
    } catch (e) {
      console.error(e);
    } finally {
      isFetching.value = false;
    }
  }

  async function getMyTasks(filters?: Omit<TaskQuery, 'author'>) {
    const {user} = await useCurrentUser();
    if (!user.value) return;
    await getTasks({ author: user.value.email, ...filters });
  }

  async function getAllTasks(filters?: TaskQuery) {
    await getTasks(filters);
  }

  async function addTask(task: Omit<Task, 'id' | 'createdBy' | 'isCompleted'>) {
    try {
      const createdTask = await api.post<Task>('tasks', task);
      if (createdTask) {
        toast.show('Task created', 'success');

        await getMyTasks();
      }
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
    getMyTasks,
    getAllTasks,
  };
});
