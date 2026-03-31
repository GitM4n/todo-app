<script setup lang="ts">
import type { TaskQuery } from '@/types';
import TaskFilters from './TaskFilters.vue';
import TaskItem from './TaskItem.vue';
import TasksPagination from './TasksPagination.vue';
import { useTasksStore } from '@/stores';

const EditTaskModal = defineAsyncComponent(() => import('./EditTaskModal.vue'));

const tasksStore = useTasksStore();

const tasks = computed(() => tasksStore.tasks);
const isFetching = computed(() => tasksStore.isFetching);
const pagination = computed(() => tasksStore.pagination);

function goToPage(page: number) {
  return tasksStore.getTasks({ page });
}

async function fetchTasks(query: TaskQuery = {}) {
  await tasksStore.getTasks(query);
}

async function deleteTask(id: number) {
  await tasksStore.deleteTask(id);
}

onMounted(async () => {
  await tasksStore.getTasks();
});

const selectedTaskId = ref<number>();

const isEditTaskModalOpened = computed({
  get() {
    return !!selectedTaskId.value;
  },
  set(value) {
    if (!value) selectedTaskId.value = undefined;
  },
});
</script>

<template>
  <div>
    <TaskFilters @on-filter-change="fetchTasks" />

    <LoadingOverlay v-if="isFetching" />

    <ul
      v-else-if="tasks.length"
      class="list-group d-flex flex-column gap-3"
      role="list"
      aria-live="polite"
    >
      <li v-for="task in tasks" :key="task.id">
        <TaskItem
          :task
          @edit-task="selectedTaskId = task.id"
          @delete-task="deleteTask"
        />
      </li>
    </ul>

    <p v-else role="status" class="no-tasks">No tasks</p>

    <TasksPagination
      v-if="pagination.totalPages > 1"
      :pagination
      @go-to-page="goToPage"
    />

    <EditTaskModal
      v-if="selectedTaskId"
      v-model="isEditTaskModalOpened"
      :task-id="selectedTaskId"
    />
  </div>
</template>

<style scoped>
.no-tasks {
  text-align: center;
  font-size: xx-large;
}
</style>