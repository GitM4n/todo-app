<script setup lang="ts">
import { ref, watch } from 'vue';
import type { TaskQuery, TaskSortField, SortOrder } from '@/types';

const props = withDefaults(
  defineProps<{
    onFilterChange: (query: TaskQuery) => void;
    filtersFor?: 'allTasks' | 'myTasks';
  }>(),
  {
    filtersFor: 'myTasks',
  }
);

const status = ref<'all' | 'completed' | 'pending'>('all');
const searchByAuthor = ref('');
const sortField = ref<TaskSortField>('createdAt');
const sortOrder = ref<SortOrder>('asc');
const limit = ref(10);

watch(
  [status, searchByAuthor, sortField, sortOrder, limit],
  () => {
    const query: TaskQuery = {
      page: 1,
      limit: limit.value,
      sort: sortField.value,
      order: sortOrder.value,
    };

    if (status.value === 'completed') query.status = true;
    if (status.value === 'pending') query.status = false;
    if (searchByAuthor.value) query.author = searchByAuthor.value;

    props.onFilterChange(query);
  },
  { immediate: true }
);
</script>

<template>
  <div class="d-flex flex-wrap gap-2 mb-3 align-items-center">
    <select v-model="status" class="form-select w-auto">
      <option value="all">All</option>
      <option value="completed">Completed</option>
      <option value="pending">Pending</option>
    </select>

    <input
      v-if="filtersFor === 'allTasks'"
      type="text"
      v-model="searchByAuthor"
      placeholder="Search by title or author"
      class="form-control w-auto"
    />

    <select v-model="sortField" class="form-select w-auto">
      <option value="createdAt">Created At</option>
      <option value="dueDate">Due Date</option>
      <option value="isCompleted">Status</option>
    </select>

    <select v-model="sortOrder" class="form-select w-auto">
      <option value="asc">Asc</option>
      <option value="desc">Desc</option>
    </select>

    <select v-model="limit" class="form-select w-auto">
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="20">20</option>
    </select>
  </div>
</template>
