<script setup lang="ts">
import { useTasksStore } from '@/stores';
import { AddTaskModal, TaskFilters, TaskItem } from '@/features/tasks';
import type { TaskQuery } from '@/types';

const tasksStore = useTasksStore();
const { user } = await useCurrentUser();

function goToPage(page: number) {
  return tasksStore.getMyTasks({ page });
}

async function fetchTasks(query: TaskQuery = {}) {
  if (user.value) {
    await tasksStore.getTasks({
      ...query,
      author: user.value.role !== 'admin' ? user.value.email : undefined,
    });
  }
}

onMounted(async () => {
  await tasksStore.getMyTasks();
});
</script>

<template>
  <div class="container">
    <h1 v-if="user">Tasks For {{ user.email }}</h1>

    <TaskFilters :on-filter-change="fetchTasks" />

    <LoadingOverlay v-if="tasksStore.isFetching" />

    <ul
      v-else-if="tasksStore.tasks"
      class="list-group d-flex flex-column gap-3"
    >
      <li
        v-for="task in tasksStore.tasks"
        :key="task.id"
      >
        <TaskItem :task />
      </li>
    </ul>

    <p v-else>No tasks</p>

    <!-- Пагинация -->
    <nav
      v-if="tasksStore.pagination.totalPages > 1"
      aria-label="Tasks pagination"
    >
      <ul class="pagination mt-3">
        <li
          class="page-item"
          :class="{ disabled: tasksStore.pagination.page === 1 }"
        >
          <button
            class="page-link"
            @click="goToPage(tasksStore.pagination.page - 1)"
          >
            Previous
          </button>
        </li>

        <li
          v-for="page in tasksStore.pagination.totalPages"
          :key="page"
          class="page-item"
          :class="{ active: tasksStore.pagination.page === page }"
        >
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>

        <li
          class="page-item"
          :class="{
            disabled:
              tasksStore.pagination.page === tasksStore.pagination.totalPages,
          }"
        >
          <button
            class="page-link"
            @click="goToPage(tasksStore.pagination.page + 1)"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>

    <AddTaskModal />
  </div>
</template>

<style scoped>
/* Your styles here */
</style>
